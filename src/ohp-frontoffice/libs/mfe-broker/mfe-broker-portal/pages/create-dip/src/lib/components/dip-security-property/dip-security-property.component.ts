import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import {
  AddressFeService,
  DataService,
  GenericStepForm,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ConstructionType,
  DIPService,
  ExpenditureDetailsRequest,
  ExpenditureDetailsResponse,
  Journey,
  SecurityPropertyRequest,
  SecurityPropertyResponse,
  TenureType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SecurityPropertyComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

@Component({
  selector: 'dip-security-property',
  templateUrl: './dip-security-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DipSecurityPropertyComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.securityProperty.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  currentData: SecurityPropertyResponse = this.route.snapshot.data?.securityPropertyData || {};
  expenditureDetails: ExpenditureDetailsResponse | null = null;

  @ViewChild('securityPropertyChild') securityPropertyChild!: SecurityPropertyComponent;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private dipService: DIPService,
    private cd: ChangeDetectorRef,
    private stepSetupService: StepSetupService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private addressFeService: AddressFeService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.dataService.setFormStatus(this.securityPropertyChild.securityPropertyForm?.status, this.STEP_NAME);
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.securityPropertyChild.securityPropertyForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        } else {
          this.securityPropertyChild.hasButtonVisible = false;
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.securityPropertyChild.securityPropertyForm.dirty;
  }

  saveData(): Observable<SecurityPropertyResponse> {
    return this.dipService.dIPPutSecurityProperty(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.securityPropertyChild.securityPropertyForm?.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.securityPropertyChild?.securityPropertyForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<SecurityPropertyResponse> {
    return this.dipService.dIPGetSecurityProperty(this.appId);
  }

  mapToDTO(): SecurityPropertyRequest {
    const formValues = this.securityPropertyChild.securityPropertyForm.getRawValue();
    const address = this.addressFeService.mapAddressFEtoBFFAddress(formValues.address, formValues.addressType);
    return {
      versionNumber: this.currentData.versionNumber as number,
      addressType: formValues.addressType,
      propertyAddress: { ...address, addressType: formValues.addressType },
      propertyStyle: formValues.propertyStyle,
      remainingTermOfLeaseInYears: formValues.tenure === TenureType.LEASEHOLD ? formValues.remainingTermOfLeaseInYears : null,
      propertyType: formValues.propertyType,
      numberOfBedrooms: formValues.numberOfBedrooms,
      constructionType: formValues.constructionType,
      constructionDetails: formValues.constructionType === ConstructionType.OTHER ? formValues.constructionDetails : null,
      roofType: formValues.roofType,
      heritageStatus: formValues.heritageStatus,
      realEstateScenario: formValues.realEstateScenario,
      tenure: formValues.tenure,
      yearBuilt: formValues.yearBuilt,
    };
  }

  private updateExpenditureDetails(): Observable<ExpenditureDetailsResponse> {
    const expenditureDetailsData: ExpenditureDetailsRequest = {
      versionNumber: this.expenditureDetails?.versionNumber || undefined,
      expenditure: { ...this.expenditureDetails?.expenditure, groundRent: null },
    };
    return this.dipService
      .dIPPutExpenditureDetails(this.appId, expenditureDetailsData)
      .pipe(concatMap(() => this.dipService.dIPGetExpenditureDetails(this.appId)));
  }

  private saveExpenditureDetails(): Observable<ExpenditureDetailsResponse> {
    const data = this.mapToDTO();

    if (data.tenure === TenureType.FREEHOLD) {
      if (this.expenditureDetails?.expenditure?.groundRent) {
        return this.updateExpenditureDetails();
      } else if (!this.expenditureDetails) {
        return this.dipService.dIPGetExpenditureDetails(this.appId).pipe(
          concatMap((response: ExpenditureDetailsResponse) => {
            this.expenditureDetails = response;
            this.currentData.versionNumber = response.versionNumber;
            if (response?.expenditure?.groundRent) {
              return this.updateExpenditureDetails();
            }
            return of() as Observable<ExpenditureDetailsResponse>;
          }),
        );
      }
    }
    return of() as Observable<ExpenditureDetailsResponse>;
  }

  private onChanges(): void {
    this.securityPropertyChild.securityPropertyForm?.valueChanges.pipe().subscribe(() => {
      this.dataService.setFormStatus(this.securityPropertyChild.securityPropertyForm?.status, this.STEP_NAME);
    });

    this.securityPropertyChild.securityPropertyForm?.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveExpenditureDetails()
          .pipe(
            concatMap(response => {
              if (response) {
                this.expenditureDetails = response;
                this.currentData.versionNumber = response.versionNumber;
              }
              return this.saveData();
            }),
          )
          .subscribe(response => {
            this.currentData.versionNumber = response.versionNumber;
          });
      });
  }
}
