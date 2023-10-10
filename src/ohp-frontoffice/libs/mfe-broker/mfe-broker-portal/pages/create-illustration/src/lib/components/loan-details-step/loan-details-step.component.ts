//Angular imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

//Local imports
import { Observable, throwError } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { loadLoanDetailsSuccess } from '../../state/loan-details/loan-details.actions';
import {
  CaseSummaryService,
  CodeTablesService,
  DataService,
  GenericStepForm,
  loadPropertyLoanSuccess,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  IllustrationService,
  Journey,
  LoanDetailsRequest,
  LoanDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { GroupValidators } from '@close-front-office/mfe-broker/core';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';

@Component({
  selector: 'mbp-loan-details-step',
  templateUrl: './loan-details-step.component.html',
})
export class LoanDetailsStepComponent extends GenericStepForm implements OnInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.loanDetails.automationId;
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  private appId = this.route.snapshot.parent?.data.illustrationJourney?.illustrationData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.illustrationJourney?.illustrationData?.loanId;

  MODE: typeof Mode = Mode;
  routePaths: typeof RoutePaths = RoutePaths;
  initialData: LoanDetailsResponse = this.route.snapshot.data?.loanDetailsData || {};
  LTVerror: string | undefined;
  calculatedLTV: number | null = null;
  shouldSaveOnRedux = true;
  locations = this.codeTablesService.getCodeTable('cdtb-jurisdiction');

  loanDetailsForm: FormGroup = this.fb.group(
    {
      purchasePrice: [
        this.initialData.purchasePrice ? this.initialData?.purchasePrice : undefined,
        [Validators.required, Validators.min(this.CONFIGURATION.MIN_PURCHASE_PRICE), Validators.max(this.CONFIGURATION.MAX_PURCHASE_PRICE)],
      ],
      totalLoanAmount: [
        this.initialData.totalLoanAmount ? this.initialData?.totalLoanAmount : undefined,
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
      propertyLocationRegion: [this.initialData.propertyLocationRegion, Validators.required],
    },
    { validators: GroupValidators.loanAmountMaxValue('purchasePrice', 'totalLoanAmount') },
  );

  constructor(
    private route: ActivatedRoute,
    public dataService: DataService,
    private fb: FormBuilder,
    private illustrationService: IllustrationService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private stepSetupService: StepSetupService,
    private store: Store,
    private codeTablesService: CodeTablesService,
    private caseSummaryService: CaseSummaryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataService.setFormStatus(this.loanDetailsForm.status, this.STEP_NAME);
    this.calculateLTV();
    this.checkActiveJourney();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.loanDetailsForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        }
      });
  }

  hasUnsavedChanges(): boolean {
    return this.loanDetailsForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  protected saveOnRedux(item: LoanDetailsResponse): void {
    this.store.dispatch(loadPropertyLoanSuccess({ entity: item }));
  }

  onChanges(): void {
    this.loanDetailsForm.valueChanges.subscribe(() => {
      this.calculateLTV();
      this.store.dispatch(loadLoanDetailsSuccess({ entity: this.mapToDTO() }));
      this.dataService.setFormStatus(this.loanDetailsForm.status, this.STEP_NAME);
    });
    this.loanDetailsForm.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
      this.saveData().subscribe(response => {
        this.initialData.versionNumber = response.versionNumber;
        this.saveOnRedux(response);
      });
    });
  }

  saveData(): Observable<LoanDetailsResponse> {
    return this.illustrationService.illustrationPutLoanDetails(this.appId, this.loanId, this.mapToDTO()).pipe(
      concatMap(() => {
        if (!this.loanDetailsForm.controls.totalLoanAmount.pristine || !this.loanDetailsForm.controls.purchasePrice.pristine) {
          this.caseSummaryService.checkProductsAvailability(this.appId, this.loanId);
        }

        this.loanDetailsForm.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Illustration,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.loanDetailsForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<LoanDetailsResponse> {
    return this.illustrationService.illustrationGetLoanDetails(this.appId, this.loanId);
  }

  mapToDTO(): LoanDetailsRequest {
    const { purchasePrice, totalLoanAmount, propertyLocationRegion } = this.loanDetailsForm.getRawValue();
    return {
      versionNumber: this.initialData.versionNumber as number,
      purchasePrice: purchasePrice ? purchasePrice : undefined,
      totalLoanAmount: totalLoanAmount ? totalLoanAmount : undefined,
      propertyLocationRegion,
    };
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

  private calculateLTV(): void {
    const purchasePrice = this.loanDetailsForm.controls.purchasePrice.value;
    const totalLoanAmount = this.loanDetailsForm.controls.totalLoanAmount.value;

    if (!purchasePrice || !totalLoanAmount) {
      this.calculatedLTV = null;
      return;
    }

    this.calculatedLTV = totalLoanAmount / purchasePrice;
    this.LTVerror = this.checkLTVPercentage((totalLoanAmount / purchasePrice) * 100);
  }

  private checkLTVPercentage(calculatedLTVPercentage: number): string | undefined {
    if (calculatedLTVPercentage < this.CONFIGURATION.LTV.MIN) {
      return this.translateService.instant('general.validations.minValue', {
        minAllowed: this.CONFIGURATION.LTV.MIN,
        fieldName: 'LTV',
      });
    }

    if (calculatedLTVPercentage > this.CONFIGURATION.LTV.MAX) {
      return this.translateService.instant('general.validations.maxValue', {
        maxAllowed: this.CONFIGURATION.LTV.MAX,
        fieldName: 'LTV',
      });
    }
    return undefined;
  }
}
