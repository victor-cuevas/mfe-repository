import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService, GenericStepForm, RoutePaths, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  DIPService,
  ExpenditureDetailsRequest,
  ExpenditureDetailsResponse,
  Journey,
  SecurityPropertyResponse,
  TenureType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dip-household-expenditure',
  templateUrl: './household-expenditure.component.html',
})
export class HouseholdExpenditureComponent extends GenericStepForm implements OnInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.householdExpenditure.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  tenure: typeof TenureType = TenureType;
  currentData: ExpenditureDetailsResponse = this.route.snapshot.data?.householdExpenditure?.householdExpenditureData || {};
  securityPropertyData: SecurityPropertyResponse = this.route.snapshot.data?.householdExpenditure?.securityPropertyData || {};

  householdExpenditureForm = this.fb.group({
    serviceCharge: [this.currentData.expenditure?.serviceCharge, Validators.required],
    groundRent: [this.currentData.expenditure?.groundRent],
    childCare: [this.currentData.expenditure?.childCare, Validators.required],
    schoolFees: [this.currentData.expenditure?.schoolFees, Validators.required],
    maintenance: [this.currentData.expenditure?.maintenance, Validators.required],
    otherProperty: [this.currentData.expenditure?.tenancyRentOnOtherProperty, Validators.required],
    other: [this.currentData.expenditure?.otherExpenditureDetail?.amount, Validators.required],
    description: this.currentData.expenditure?.otherExpenditureDetail?.description || '',
    numberOfAdults: this.currentData.expenditure?.numberOfAdults || 0,
    numberOfChildren: this.currentData.expenditure?.numberOfChildren || 0,
  });

  MODE: typeof Mode = Mode;

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    private dipService: DIPService,
    private toastService: ToastService,
    private stepSetupService: StepSetupService,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataService.setFormStatus(this.householdExpenditureForm.status, this.STEP_NAME);
    if (this.securityPropertyData?.tenure === TenureType.LEASEHOLD) {
      this.householdExpenditureForm.get('groundRent')?.setValidators(Validators.required);
    } else {
      this.householdExpenditureForm.get('groundRent')?.setValue(null);
      this.householdExpenditureForm.get('groundRent')?.setValidators(null);
    }
    this.householdExpenditureForm.get('groundRent')?.updateValueAndValidity();
    this.checkActiveJourney();
  }

  ngOnDestroy(): void {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.householdExpenditureForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.householdExpenditureForm.dirty;
  }

  onChanges() {
    this.householdExpenditureForm.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.householdExpenditureForm.status, this.STEP_NAME);
    });

    this.householdExpenditureForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentData.versionNumber = response.versionNumber;
        });
      });

    this.householdExpenditureForm.get('other')?.valueChanges.subscribe(value => {
      if (value) {
        this.householdExpenditureForm.get('description')?.setValidators(Validators.required);
      } else {
        this.householdExpenditureForm.get('description')?.setValidators(null);
      }
      this.householdExpenditureForm.get('description')?.updateValueAndValidity();
    });
  }

  saveData(): Observable<ExpenditureDetailsResponse> {
    return this.dipService.dIPPutExpenditureDetails(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.householdExpenditureForm?.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.householdExpenditureForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<ExpenditureDetailsResponse> {
    return this.dipService.dIPGetExpenditureDetails(this.appId);
  }

  subtract(field: string) {
    if (!this.householdExpenditureForm.value[field]) return;
    this.householdExpenditureForm.get(field)?.setValue(this.householdExpenditureForm.value?.[field] - 1);
    this.householdExpenditureForm.markAsDirty();
  }

  add(field: string) {
    this.householdExpenditureForm.get(field)?.setValue(this.householdExpenditureForm.value?.[field] + 1);
    this.householdExpenditureForm.markAsDirty();
  }

  get otherValue() {
    return this.householdExpenditureForm.get('other')?.value;
  }

  mapToDTO(): ExpenditureDetailsRequest {
    const formValues = this.householdExpenditureForm.getRawValue();

    return {
      versionNumber: this.currentData.versionNumber as number,
      expenditure: {
        serviceCharge: formValues.serviceCharge,
        groundRent: formValues.groundRent,
        childCare: formValues.childCare,
        schoolFees: formValues.schoolFees,
        maintenance: formValues.maintenance,
        otherExpenditureDetail: {
          description: formValues.description,
          amount: formValues.other,
        },
        tenancyRentOnOtherProperty: formValues.otherProperty,
        numberOfAdults: formValues.numberOfAdults,
        numberOfChildren: formValues.numberOfChildren,
      },
    };
  }
}
