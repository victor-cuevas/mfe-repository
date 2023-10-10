import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, takeUntil } from 'rxjs/operators';

import {
  AddressFeService,
  DataService,
  GenericStepForm,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  BuilderGuaranteeSchemeType,
  ConstructionType,
  FMAService,
  Journey,
  PropertyType,
  SecurityPropertyRequest,
  SecurityPropertyResponse,
  TenureType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SecurityPropertyComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

@Component({
  templateUrl: './fma-security-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmaSecurityPropertyComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.fmaSecurityProperty.automationId;

  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  currentData: SecurityPropertyResponse = this.route.snapshot.data?.securityPropertyData || {};

  @ViewChild('securityPropertyChild') securityPropertyChild!: SecurityPropertyComponent;

  constructor(
    private stepSetupService: StepSetupService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private fmaService: FMAService,
    private cd: ChangeDetectorRef,
    private addressFeService: AddressFeService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.securityPropertyChild.securityPropertyForm)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setFormStatus(this.securityPropertyChild.securityPropertyForm?.status, this.STEP_NAME);
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
    return this.fmaService.fMAPutSecurityProperty(this.appId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      concatMap(() => {
        this.securityPropertyChild.securityPropertyForm?.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Fma,
          this.appId,
          this.loanId,
          {
            [this.STEP_NAME]: this.securityPropertyChild.securityPropertyForm.status,
            ...this.stepSetupService.validateFmaChecks(),
          },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<SecurityPropertyResponse> {
    return this.fmaService.fMAGetSecurityProperty(this.appId);
  }

  mapToDTO(): SecurityPropertyRequest {
    const formValues = this.securityPropertyChild.securityPropertyForm.getRawValue();

    return {
      versionNumber: this.currentData.versionNumber as number,
      addressType: formValues.addressType,
      propertyAddress: this.addressFeService.mapAddressFEtoBFFAddress(formValues.address, formValues.addressType),
      propertyStyle: formValues.propertyStyle,
      propertyType: formValues.propertyType,
      numberOfBedrooms: formValues.numberOfBedrooms,
      constructionType: formValues.constructionType,
      constructionDetails: formValues.constructionType === ConstructionType.OTHER ? formValues.constructionDetails : null,
      roofType: formValues.roofType,
      heritageStatus: formValues.heritageStatus,
      realEstateScenario: formValues.realEstateScenario,
      tenure: formValues.tenure,
      remainingTermOfLeaseInYears: formValues.tenure === TenureType.LEASEHOLD ? formValues.remainingTermOfLeaseInYears : null,
      yearBuilt: formValues.yearBuilt,
      numberOfFloors: formValues.numberOfFloors,
      floor: formValues.propertyType === PropertyType.FLAT_APARTMENT ? formValues.floor : null,
      hasLift: formValues.numberOfFloors > 3 ? formValues.hasLift : null,
      numberOfBathrooms: formValues.numberOfBathrooms,
      numberOfKitchens: formValues.numberOfKitchens,
      numberOfReceptionrooms: formValues.numberOfReceptionrooms,
      hasGarageOrParkingSpace: formValues.hasGarageOrParkingSpace,
      isPlotSizeGreaterThanOneAcre: formValues.isPlotSizeGreaterThanOneAcre,
      hasSufferedFromSubsidence: formValues.hasSufferedFromSubsidence,
      isHabitable: formValues.isHabitable,
      hasBeenPreviouslyOwnedByLo: formValues.hasBeenPreviouslyOwnedByLo,
      isHmo: formValues.isHmo,
      arePeopleOver17NotInTheMortgageLivingInTheProperty: formValues.arePeopleOver17NotInTheMortgageLivingInTheProperty,
      hasPropertyGuaranteeScheme: this.securityPropertyChild.showGuaranteeScheme ? formValues.hasPropertyGuaranteeScheme : null,
      propertyGuaranteeScheme:
        formValues.hasPropertyGuaranteeScheme && this.securityPropertyChild.showGuaranteeScheme ? formValues.propertyGuaranteeScheme : null,
      isAtRiskOfCoastalOrRiverErosion: formValues.isAtRiskOfCoastalOrRiverErosion,
      isToBeUsedForBusinessPurposes: formValues.isToBeUsedForBusinessPurposes,
      energyRating: formValues.energyRating,
      isFlatAboveCommercialPremises:
        formValues.propertyType === PropertyType.FLAT_APARTMENT ? formValues.isFlatAboveCommercialPremises : null,
      otherPropertyGuaranteeScheme:
        this.securityPropertyChild.showGuaranteeScheme && formValues.propertyGuaranteeScheme === BuilderGuaranteeSchemeType.OTHER
          ? formValues.otherPropertyGuaranteeScheme
          : null,
    };
  }

  private onChanges(): void {
    this.securityPropertyChild.securityPropertyForm?.valueChanges.subscribe(() => {
      const status = this.securityPropertyChild.securityPropertyForm.status;
      if (status === 'VALID' || status === 'INVALID') {
        this.dataService.setFormStatus(this.securityPropertyChild.securityPropertyForm?.status, this.STEP_NAME);
      }

      if (
        this.stepSetupService.stepIsValid(this.stepSetupService.affordabilityCheck) &&
        !this.securityPropertyChild.securityPropertyForm.pristine
      ) {
        this.stepSetupService.invalidateStep(this.stepSetupService.affordabilityCheck.automationId);
      }
    });

    this.securityPropertyChild.securityPropertyForm?.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentData.versionNumber = response.versionNumber;
        });
      });
  }

  private handleError() {
    this.saveData().subscribe(response => {
      this.currentData.versionNumber = response?.versionNumber as number;
    });
  }
}
