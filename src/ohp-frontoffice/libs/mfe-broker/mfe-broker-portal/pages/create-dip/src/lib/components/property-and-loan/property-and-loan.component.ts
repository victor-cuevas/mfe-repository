import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  CodeTablesService,
  DataService,
  GenericStepForm,
  loadPropertyLoanSuccess,
  RoutePaths,
  StepSetupService,
  CaseSummaryService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CasePurposeType,
  DIPService,
  Journey,
  PropertyAndLoanDetailsRequest,
  PropertyAndLoanDetailsResponse,
  RealEstateAgreementType,
  StepStatusEnum,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { map, debounceTime, take, takeUntil } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';
import { TranslateService } from '@ngx-translate/core';
import { GroupValidators } from '@close-front-office/mfe-broker/core';
import { Store } from '@ngrx/store';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';

@Component({
  selector: 'dip-property-and-loan',
  templateUrl: './property-and-loan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyLoansDetailsComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.propertyLoan.automationId;
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  locations = this.codeTablesService.getCodeTable('cdtb-jurisdiction');
  propertyOwnershipTypeOptions = this.codeTablesService.getCodeTable('cdtb-ads-realestateagreementtype');
  realEstateAgreementType: typeof RealEstateAgreementType = RealEstateAgreementType;
  casePurposeType: typeof CasePurposeType = CasePurposeType;
  routePaths: typeof RoutePaths = RoutePaths;
  currentData: PropertyAndLoanDetailsResponse = this.route.snapshot.data?.propertyLoanData || {};
  ltv$ = new BehaviorSubject(this.currentData.ltv ? this.currentData.ltv / 100 : this.currentData.ltv); // null = error & undefined = loading
  shouldSaveOnRedux = true;

  propertyLoansForm: FormGroup = this.fb.group(
    {
      propertyLocation: [this.currentData.propertyLocation, Validators.required],
      hasCustomerFoundProperty: [this.currentData.hasCustomerFoundProperty],
      applicantsLiveInTheProperty: [this.currentData.applicantsLiveInTheProperty, Validators.requiredTrue],
      propertyOwnershipType: [this.currentData.propertyOwnershipType],
      isPurchaseFromFamily: [this.currentData.isPurchaseFromFamily],
      purchasePrice: [
        this.currentData.purchaseAmount,
        [Validators.required, Validators.min(this.CONFIGURATION.MIN_PURCHASE_PRICE), Validators.max(this.CONFIGURATION.MAX_PURCHASE_PRICE)],
      ],
      fullMarketValue: this.currentData.fullMarketValue,
      loanAmount: [
        this.currentData.loanAmount,
        [
          Validators.required,
          this.stepSetupService.isRemortgage
            ? Validators.min(this.CONFIGURATION.LOAN_AMOUNT.MIN.REMORTGAGE)
            : Validators.min(this.CONFIGURATION.LOAN_AMOUNT.MIN.PURCHASE),
          this.stepSetupService.isRemortgage
            ? Validators.max(this.CONFIGURATION.LOAN_AMOUNT.MAX.REMORTGAGE)
            : Validators.max(this.CONFIGURATION.LOAN_AMOUNT.MAX.PURCHASE),
        ],
      ],
    },
    { validators: GroupValidators.loanAmountMaxValue('purchasePrice', 'loanAmount') },
  );
  LTVerror: string | undefined;
  MODE: typeof Mode = Mode;

  constructor(
    public stepSetupService: StepSetupService,
    private caseSummaryService: CaseSummaryService,
    private fb: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    private dipService: DIPService,
    private translateService: TranslateService,
    private store: Store,
    private codeTablesService: CodeTablesService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.ltv$.pipe(takeUntil(this.onDestroy$)).subscribe(ltv => {
      this.calculateLTVError(ltv);
    });
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
  }

  ngOnDestroy() {
    super.checkSubscription();
    super.onDestroy();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.propertyLoansForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
          this.caseSummaryService.checkProductsAvailability(this.appId, this.loanId);
          this.applicantsLiveInThePropertyValidation();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.propertyLoansForm.dirty;
  }

  getStepStatus(): StepStatusEnum {
    return this.propertyLoansForm.status === 'VALID' ? StepStatusEnum.VALID : StepStatusEnum.INVALID;
  }

  saveProgress(): void {
    this.dataService
      .saveProgress(Journey.Dip, this.appId, this.loanId, {
        [this.STEP_NAME]: this.getStepStatus(),
      })
      .subscribe();
  }

  saveData(): Observable<PropertyAndLoanDetailsResponse> {
    if (this.isSaving) {
      this.propertyLoansForm.markAsDirty();
      return of();
    }
    this.isSaving = true;
    this.propertyLoansForm.markAsPristine();
    return this.dipService.dIPPutPropertyAndLoanDetails(this.appId, this.loanId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      map((res: PropertyAndLoanDetailsResponse) => {
        this.currentData.versionNumber = res.versionNumber;
        this.ltv$.next(res.ltv ? res.ltv / 100 : res.ltv);
        this.isSaving = false;
        this.saveProgress();
        return res;
      }),
    );
  }

  protected saveOnRedux(item: PropertyAndLoanDetailsResponse): void {
    item && this.store.dispatch(loadPropertyLoanSuccess({ entity: item }));
  }

  mapToDTO(): PropertyAndLoanDetailsRequest {
    const data = this.propertyLoansForm.getRawValue();
    return {
      propertyLocation: data.propertyLocation,
      hasCustomerFoundProperty: data.hasCustomerFoundProperty,
      applicantsLiveInTheProperty: data.applicantsLiveInTheProperty,
      propertyOwnershipType: data.propertyOwnershipType,
      isPurchaseFromFamily:
        data.propertyOwnershipType === this.realEstateAgreementType.CONCESSIONARY_DISCOUNTED_PURCHASE ? data.isPurchaseFromFamily : null,
      purchasePrice: data.purchasePrice,
      fullMarketValue:
        data.propertyOwnershipType === this.realEstateAgreementType.CONCESSIONARY_DISCOUNTED_PURCHASE ? data.fullMarketValue : null,
      loanAmount: data.loanAmount,
      versionNumber: this.currentData.versionNumber,
    };
  }

  loadingLTV(): void {
    this.ltv$.next(undefined);
  }

  onChanges(): void {
    this.propertyLoansForm.valueChanges.subscribe(() => {
      this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
      this.store.dispatch(loadPropertyLoanSuccess({ entity: this.mapToDTO() }));
    });
    this.propertyLoansForm.get('purchasePrice')?.valueChanges.subscribe(() => {
      this.loadingLTV();
    });
    this.propertyLoansForm.get('loanAmount')?.valueChanges.subscribe(() => {
      this.loadingLTV();
    });
    this.propertyLoansForm.valueChanges
      .pipe(debounceTime(this.dataService.LOW_DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(res => {
          if (!res) return;
          this.caseSummaryService.checkProductsAvailability(this.appId, this.loanId);
          this.saveOnRedux(res);
        });
      });

    this.propertyLoansForm.controls.propertyOwnershipType?.valueChanges.subscribe(value => {
      if (value && value === this.realEstateAgreementType.CONCESSIONARY_DISCOUNTED_PURCHASE) {
        this.propertyLoansForm.get('isPurchaseFromFamily')?.setValidators(Validators.required);
        this.propertyLoansForm.get('fullMarketValue')?.setValidators(Validators.required);
      } else {
        this.propertyLoansForm.get('isPurchaseFromFamily')?.setValidators(null);
        this.propertyLoansForm.get('fullMarketValue')?.setValidators(null);
      }
      this.propertyLoansForm.get('isPurchaseFromFamily')?.updateValueAndValidity({ emitEvent: false });
      this.propertyLoansForm.get('fullMarketValue')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  getMinErrorMessage() {
    return this.translateService.instant('general.validations.minValue', {
      minAllowed: this.stepSetupService.isRemortgage
        ? this.CONFIGURATION.LOAN_AMOUNT.MIN.REMORTGAGE
        : this.CONFIGURATION.LOAN_AMOUNT.MIN.PURCHASE,
      fieldName: this.translateService.instant('createIllustration.labels.totalLoanAmount'),
    });
  }

  getMaxErrorMessage() {
    return this.translateService.instant('general.validations.maxValue', {
      maxAllowed: this.stepSetupService.isRemortgage
        ? this.CONFIGURATION.LOAN_AMOUNT.MAX.REMORTGAGE
        : this.CONFIGURATION.LOAN_AMOUNT.MAX.PURCHASE,
      fieldName: this.translateService.instant('createIllustration.labels.totalLoanAmount'),
    });
  }

  private calculateLTVError(ltv: number | null | undefined): void {
    this.LTVerror = undefined;
    if (ltv) {
      if (ltv > this.CONFIGURATION.LTV.MAX / 100) {
        this.propertyLoansForm.setErrors({ ...this.propertyLoansForm.errors, ltvMax: true }, { emitEvent: false });
        this.LTVerror = this.translateService.instant('general.validations.maxValue', {
          maxAllowed: `${this.CONFIGURATION.LTV.MAX}%`,
          fieldName: 'LTV',
        });
      } else if (ltv < this.CONFIGURATION.LTV.MIN / 100) {
        this.propertyLoansForm.setErrors({ ...this.propertyLoansForm.errors, ltvMin: true }, { emitEvent: false });
        this.LTVerror = this.translateService.instant('general.validations.minValue', {
          minAllowed: this.CONFIGURATION.LTV.MIN,
          fieldName: 'LTV',
        });
      }
    }
    this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
    this.cd.detectChanges();
  }

  private applicantsLiveInThePropertyValidation() {
    const applicantsLiveInThePropertyControls = this.propertyLoansForm.get('applicantsLiveInTheProperty');
    if (applicantsLiveInThePropertyControls?.value === false) {
      applicantsLiveInThePropertyControls?.markAsTouched();
    }

    if (!this.stepSetupService.isRemortgage) {
      this.propertyLoansForm.get('hasCustomerFoundProperty')?.setValidators(Validators.required);
      this.propertyLoansForm.get('propertyOwnershipType')?.setValidators(Validators.required);
    } else {
      this.propertyLoansForm.get('hasCustomerFoundProperty')?.setValidators(null);
      this.propertyLoansForm.get('propertyOwnershipType')?.setValidators(null);
    }
    this.propertyLoansForm.get('hasCustomerFoundProperty')?.updateValueAndValidity({ emitEvent: false });
    this.propertyLoansForm.get('propertyOwnershipType')?.updateValueAndValidity({ emitEvent: false });
  }
}
