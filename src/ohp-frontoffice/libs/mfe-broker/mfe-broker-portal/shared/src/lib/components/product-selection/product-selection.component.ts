import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  CaseSummaryService,
  DataService,
  FeLoanPart,
  FeProductSelectionResolve,
  GenericStepForm,
  getPersonalDetails,
  loadProductSelectionSuccess,
  MortgageTermService,
  ProductSelectionService,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CalculationService,
  CasePurposeType,
  ContactInformationResponse,
  FESubmissionRoute,
  FirmType,
  Journey,
  LoanPart,
  LoanPartType,
  PaymentTermResponse,
  ProductSelectionRequest,
  ProductSelectionResponse,
  StepStatusEnum,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from '@close-front-office/mfe-broker/shared-ui';
import { CustomValidators, GroupValidators } from '@close-front-office/mfe-broker/core';
import { debounceTime, map, pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  selector: 'mbp-product-selection',
  templateUrl: './product-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSelectionComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.productSelection.automationId;
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  private appId =
    this.route.snapshot.data.summary.applicationDraftId ||
    this.route.snapshot.data?.illustrationJourney?.illustrationData?.applicationDraftId ||
    this.route.snapshot.data?.dipJourney?.dipData?.applicationDraftId;
  private loanId =
    this.route.snapshot.data.summary.loanId ||
    this.route.snapshot.data?.illustrationJourney?.illustrationData?.loanId ||
    this.route.snapshot.data?.dipJourney?.dipData?.loanId;

  versionNumber = this.route.snapshot.data?.productSelectionData?.productData.versionNumber;
  atLeastOneValid = false;
  hasInvalidatedAdviceAndFees = false;
  firmType = FirmType;
  highestMortgageTerm$ = this.mortgageTermService.highestMortgageTerm$;
  paymentTerms?: PaymentTermResponse;
  loadingPaymentTerms = true;
  initialData: FeProductSelectionResolve = this.route.snapshot.data?.productSelectionData || {};
  showRemoveWarning = false;
  ltv = this.initialData.productData.ltv ? this.initialData.productData.ltv / 100 : this.initialData.productData.ltv;
  totalLoanAmount = this.initialData.productData.totalLoanAmount;
  showLtv$ = new BehaviorSubject(false);
  ltvError = this.isLtvError(this.ltv, this.CONFIGURATION.LTV.MAX / 100, this.CONFIGURATION.LTV.MIN / 100);
  propertyValuationAmountError = false;
  indexToRemove?: number;
  removeWarningData: DialogData = {
    header: 'Remove loan part',
    content: 'You are about to remove a loan part. Are you sure about this action?',
    type: 'danger',
    icon: 'pi-trash',
  };
  invalidLoanParts: number[] = [];

  loanPartType: typeof LoanPartType = LoanPartType;

  submissionRoutes: FESubmissionRoute[] = [
    ...(this.initialData.networkData.networks || []),
    ...(this.initialData.networkData.directlyAuthorized || []),
  ]
    .filter(network => network.isActivated || network.id === this.initialData.productData?.network)
    .map(network => ({ label: network.firmName, value: network.id, disabled: !network.isActivated }));
  submissionRoutesObject = this.submissionRoutes.reduce((obj, option: FESubmissionRoute) => ({ ...obj, [option.value]: option }), {});
  mortgageClubs: FESubmissionRoute[] =
    (this.initialData.networkData?.clubs?.length &&
      this.initialData.networkData.clubs
        .filter(club => club.isActivated || club.id === this.initialData.productData?.mortgageClub)
        .map(club => ({ label: club.firmName, value: club.id, disabled: !club.isActivated }))) ||
    [];
  clubsObject: { [key: string]: FESubmissionRoute } = this.mortgageClubs.reduce(
    (obj, option: FESubmissionRoute) => ({ ...obj, [option.value]: option }),
    {},
  );
  // default data for interest only amount
  interestOnlyRemaining = 0;
  // reactive form for product selection
  productSelectionForm: FormGroup = this.fb.group(
    {
      network: [
        {
          value: this.initialData.productData?.network,
          disabled: this.initialData.productData?.useMortgageClub,
        },
        [Validators.required, CustomValidators.selectedValueIsActive(this.submissionRoutes)],
      ],
      mortgageClub: [
        { value: this.initialData.productData?.mortgageClub, disabled: !this.initialData.productData?.useMortgageClub },
        [Validators.required, CustomValidators.selectedValueIsActive(this.mortgageClubs)],
      ],
      useMortgageClub: [this.initialData.productData?.useMortgageClub],
      loanParts: this.fb.array([]),
      remainingAmount: [null, CustomValidators.valueIs(0)],
    },
    { validators: GroupValidators.atLeastOneField(['network', 'mortgageClub']) },
  );
  // dynamic route vars
  routePaths: typeof RoutePaths = RoutePaths;
  invalidLoanPartsProduct$ = this.caseSummaryService.invalidLoanPartsProduct$;
  submissionRouteError = '';

  @Input() journey!: Journey;

  constructor(
    public dataService: DataService,
    private stepSetupService: StepSetupService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private mortgageTermService: MortgageTermService,
    private productSelectionService: ProductSelectionService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private calculationService: CalculationService,
    private store: Store,
    public caseSummaryService: CaseSummaryService,
  ) {
    super();
  }

  // getter of the loanParts formArray
  get loanParts(): FormArray {
    return this.productSelectionForm.controls['loanParts'] as FormArray;
  }

  get remainingAmount(): AbstractControl {
    return this.productSelectionForm.controls['remainingAmount'] as AbstractControl;
  }

  get remainingAmountValue(): number {
    return this.productSelectionForm.getRawValue().remainingAmount;
  }

  ngOnInit() {
    this.setMaxMortgageTerm();
    this.setFormData();
    this.setAtLeastOneValid();
    this.setPaymentTerms();
    this.remainingAmount.setValue(this.initialData.productData?.loanAmount);
    this.getRemainingAmount();
    this.checkRemainingAmount();
    this.cd.detectChanges();
    this.caseSummaryService.invalidLoanPartsProduct$.pipe(takeUntil(this.onDestroy$)).subscribe(invalidLoanParts => {
      if (invalidLoanParts) this.invalidLoanParts = invalidLoanParts;
      this.updateStepStatus();
      this.getRemainingAmount();
      this.showLtv$.next(
        this.shouldShowLtv(
          this.initialData.productData?.propertyValuationAmount,
          this.initialData.productData?.purchaseAmount,
          invalidLoanParts,
        ),
      );
    });
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
    this.invalidateAdviceAndFees();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.productSelectionForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.updateStepStatus();
          this.setSubmissionRoute();
          this.onChanges();
          this.checkSubmissionRoutes(
            this.productSelectionForm.getRawValue().useMortgageClub,
            this.productSelectionForm.getRawValue().mortgageClub,
          );
          this.cd.detectChanges();
        }
      });
  }

  private setSubmissionRoute() {
    if (
      this.initialData.productData?.useMortgageClub &&
      this.initialData.productData?.mortgageClub &&
      !this.clubsObject[this.initialData.productData?.mortgageClub]
    ) {
      this.productSelectionForm.controls.mortgageClub.setValue(null);
    }
    if (this.initialData.productData?.network !== this.submissionRoutes[0]?.value) {
      this.productSelectionForm.controls.network.setValue(this.submissionRoutes[0]?.value);
    }
    if (
      this.initialData.productData?.useMortgageClub &&
      (!this.mortgageClubs.length || (this.mortgageClubs.length === 1 && this.mortgageClubs[0].disabled))
    ) {
      this.productSelectionForm.controls.useMortgageClub.setValue(false);
    }
    if (
      !this.initialData.productData?.useMortgageClub &&
      (!this.submissionRoutes.length || this.submissionRoutes[0]?.disabled) &&
      this.mortgageClubs.length
    ) {
      this.productSelectionForm.controls.useMortgageClub.setValue(true);
      this.productSelectionForm.controls.network.disable();
      this.productSelectionForm.controls.mortgageClub.enable();
    }
  }

  private checkSubmissionRoutes(useMortgageClub: boolean, mortgageClub: string) {
    if (
      this.initialData.productData.useMortgageClub &&
      useMortgageClub &&
      this.initialData.productData.mortgageClub &&
      !this.clubsObject[mortgageClub]
    ) {
      this.submissionRouteError = 'createIllustration.labels.invalidMortgageClub';
    } else if (
      this.initialData.productData.mortgageClub &&
      (!this.mortgageClubs.length || this.mortgageClubs[0]?.disabled) &&
      this.submissionRoutes.length &&
      !this.submissionRoutes[0]?.disabled
    ) {
      this.submissionRouteError = 'createIllustration.labels.invalidMortgageClubNoOthers';
    } else if (
      this.initialData.productData?.network &&
      (!this.submissionRoutes.length || this.submissionRoutes[0]?.disabled) &&
      this.mortgageClubs.length &&
      !this.mortgageClubs[0]?.disabled
    ) {
      this.submissionRouteError = 'createIllustration.labels.noSubmissionRoutes';
    } else if (
      (!this.submissionRoutes.length || this.submissionRoutes[0]?.disabled) &&
      (!this.mortgageClubs.length || this.mortgageClubs[0]?.disabled)
    ) {
      this.submissionRouteError = 'createIllustration.labels.noSubmissionRoutesOrClubs';
    } else {
      this.submissionRouteError = '';
    }
  }

  invalidateAdviceAndFees() {
    this.loanParts.valueChanges.subscribe(() => {
      if (this.stepSetupService.stepIsValid(this.stepSetupService.adviceFees) && this.productSelectionForm.dirty) {
        this.hasInvalidatedAdviceAndFees = true;
        this.stepSetupService.invalidateStep(
          this.journey === Journey.Fma ? this.stepSetupService.adviceFees.automationId : this.stepSetupService.adviceFees.automationId,
        );
      }
    });
  }

  public setPaymentTerms(): void {
    if (this.atLeastOneValid && this.appId && this.loanId) {
      this.calculationService
        .calculationGetPaymentTerms(this.appId, this.loanId)
        .pipe(take(1))
        .subscribe(
          val => {
            this.loadingPaymentTerms = false;
            this.paymentTerms = val;
            this.cd.detectChanges();
          },
          () => {
            this.loadingPaymentTerms = false;
          },
        );
    }
    this.loadingPaymentTerms = false;
  }

  hasUnsavedChanges(): boolean {
    return this.productSelectionForm.dirty;
  }

  addLoanPart(loanPart?: FeLoanPart): void {
    this.loanParts.push(this.createLoanPart(loanPart));
  }

  createLoanPart(loanPart?: FeLoanPart): AbstractControl {
    const { years, months } = this.mortgageTermService.getMortgageTermMonthsAndYears(loanPart?.mortgageTerm);
    const formGroup = this.fb.group({
      loanPartId: loanPart?.loanPartId,
      loanPartAmount: [loanPart?.loanPartAmount, Validators.required],
      loanPartType: {
        value:
          this.route.snapshot.data.summary?.caseData?.casePurposeType === CasePurposeType.Purchase
            ? LoanPartType.PURCHASE
            : LoanPartType.REMORTGAGE,
      },
      feMortgageTerm: this.fb.group({
        years: [loanPart?.feMortgageTerm?.years || years],
        months: [loanPart?.feMortgageTerm?.months || months],
      }),
      mortgageTerm: [
        loanPart?.mortgageTerm,
        [Validators.min(1), CustomValidators.maxApplicantAge(this.mortgageTermService.maxMortgageTerm)],
      ],
      repaymentType: { value: loanPart?.repaymentType || 'ANNUITY' },
      product: this.fb.group({
        code: [loanPart?.product?.code, Validators.required],
        name: [loanPart?.product?.name],
        interestRate: [loanPart?.product?.interestRate],
        baseInterestRate: [loanPart?.product?.baseInterestRate],
      }),
    });

    formGroup
      ?.get('product')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.mortgageTermService.checkProductAvailability(formGroup, this.appId, this.loanId));

    formGroup
      .get('feMortgageTerm')
      ?.get('years')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.mortgageTermService.updateMortgageTermTotal(formGroup);
      });

    formGroup
      .get('feMortgageTerm')
      ?.get('months')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.mortgageTermService.updateMortgageTermTotal(formGroup);
      });

    formGroup
      .get('mortgageTerm')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.mortgageTermService.checkProductAvailability(formGroup, this.appId, this.loanId);
        this.updateHighestMortgageTerm();
      });

    return formGroup;
  }

  splitLoanPart(dataObject: { data: FeLoanPart[]; index: number }) {
    this.loanParts.at(dataObject.index).setValue(dataObject.data[0]);
    this.loanParts.insert(dataObject.index + 1, this.createLoanPart(dataObject.data[1]));
    this.productSelectionForm.markAsDirty();
    this.productSelectionForm.updateValueAndValidity({ emitEvent: false });
  }

  updateHighestMortgageTerm() {
    this.mortgageTermService.updateHighestMortgageTerm(this.loanParts.getRawValue());
  }

  removeLoanPart(index: number) {
    if (index === 0 && this.loanParts.length === 1) {
      this.toastService.showMessage({
        severity: this.toastService.SEVERITIES.WARNING,
        summary: 'You should always have at least one product',
      });
    } else {
      this.indexToRemove = index;
      this.showRemoveWarning = true;
      this.productSelectionForm.markAsDirty();
    }
  }

  onCancel() {
    this.showRemoveWarning = false;
  }

  onConfirm() {
    if (this.indexToRemove !== undefined) {
      const loanPartAmount = this.loanParts.at(this.indexToRemove).get('loanPartAmount')?.value;
      const loanPartId = this.loanParts.at(this.indexToRemove).get('loanPartId')?.value;

      if (loanPartAmount) {
        this.remainingAmount.setValue(this.remainingAmountValue + loanPartAmount);
      }
      this.loanParts.removeAt(this.indexToRemove);
      if (this.caseSummaryService.invalidLoanPartsProduct?.length) {
        this.caseSummaryService.invalidLoanPartsProduct = this.caseSummaryService.invalidLoanPartsProduct.filter(
          (invalidLoanPartId: number) => invalidLoanPartId !== loanPartId,
        );
      }
    }
    this.showRemoveWarning = false;
    this.cd.detectChanges();
  }

  getRemainingAmount(): void {
    if (typeof this.initialData.productData?.loanAmount === 'number') {
      this.remainingAmount.setValue(
        this.initialData.productData?.loanAmount -
          Array(this.loanParts.length)
            .fill(0)
            .map((v, index) => this.loanParts.at(index) as FormGroup)
            .filter(loanPart => loanPart.valid && !this.invalidLoanParts.includes(loanPart.get('loanPartId')?.value))
            .reduce((total, item) => {
              return total + item.get('loanPartAmount')?.value;
            }, 0),
      );
    }
  }

  public mapToDTO(): ProductSelectionRequest {
    const data = this.productSelectionForm.getRawValue();
    const array = Array(this.loanParts.length)
      .fill(0)
      .map((v, index) => this.loanParts.at(index) as FormGroup);

    const loanParts: LoanPart[] = array
      .map((loanPart: FormGroup) => {
        const mappedLoanPart = ({ loanPartId, loanPartAmount, mortgageTerm, product } = loanPart.getRawValue()) => ({
          loanPartId,
          loanPartAmount,
          mortgageTerm,
          product: {
            code: product.code,
            name: product.name,
            interestRate: product.interestRate,
            baseInterestRate: product.baseInterestRate,
          },
          //TODO remove hardcoded value
          repaymentType: 'ANNUITY',
        });

        return mappedLoanPart();
      })
      .filter(loanPart => loanPart.product.code);

    return {
      versionNumber: this.versionNumber,
      network: data.network,
      useMortgageClub: data.useMortgageClub,
      mortgageClub: data.useMortgageClub ? data.mortgageClub : null,
      loanParts,
    };
  }

  updateStepStatus(): void {
    this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
  }

  getStepStatus(): StepStatusEnum {
    return this.productSelectionForm.status === 'VALID' && !this.invalidLoanParts.length ? StepStatusEnum.VALID : StepStatusEnum.INVALID;
  }

  saveProgress() {
    this.dataService
      .saveProgress(this.journey, this.appId, this.loanId, {
        [this.STEP_NAME]: this.getStepStatus(),
        ...(this.journey === Journey.Fma && this.stepSetupService.validateFmaChecks()),
        ...(this.hasInvalidatedAdviceAndFees &&
          this.journey !== Journey.Fma && {
            [this.stepSetupService.adviceFees.automationId]: StepStatusEnum.INVALID,
          }),
        ...(this.hasInvalidatedAdviceAndFees &&
          this.journey === Journey.Fma && { [this.stepSetupService.adviceFees.automationId]: StepStatusEnum.INVALID }),
      })
      .subscribe();
  }

  saveData(): Observable<ProductSelectionResponse> {
    if (this.isSaving) {
      this.productSelectionForm.markAsDirty();
      return of();
    }
    this.isSaving = true;
    this.productSelectionForm.markAsPristine();
    return this.productSelectionService.putProductSelection(this.journey, this.appId, this.loanId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      map((res: ProductSelectionResponse) => {
        this.versionNumber = res.versionNumber;
        this.totalLoanAmount = res.totalLoanAmount;
        this.ltv = res.ltv ? res.ltv / 100 : res.ltv;
        this.isSaving = false;
        this.saveProgress();
        return res;
      }),
    );
  }

  onChanges() {
    const formControls = this.productSelectionForm.controls;

    this.productSelectionForm
      .get('useMortgageClub')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((useMortgageClub: boolean) => {
        this.checkSubmissionRoutes(useMortgageClub, this.productSelectionForm.getRawValue().mortgageClub);
        formControls.mortgageClub.setValue(null);
        formControls.mortgageClub.markAsUntouched();

        if (useMortgageClub) {
          formControls.mortgageClub.enable();
          formControls.network.disable();
        } else {
          formControls.network.enable();
          formControls.mortgageClub.disable();
        }
        formControls.network?.updateValueAndValidity({ emitEvent: false });
        formControls.mortgageClub?.updateValueAndValidity({ emitEvent: false });
      });

    this.productSelectionForm
      .get('mortgageClub')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((mortgageClub: string) => {
        this.checkSubmissionRoutes(this.productSelectionForm.getRawValue().useMortgageClub, mortgageClub);
      });

    this.loanParts.valueChanges.pipe(pairwise(), startWith([]), takeUntil(this.onDestroy$)).subscribe(([prev, next]) => {
      if (prev?.length !== next?.length) {
        this.updateHighestMortgageTerm();
      }

      this.setAtLeastOneValid();
      if (this.atLeastOneValid) {
        this.loadingPaymentTerms = true;
      }
      this.cd.detectChanges();
    });

    this.productSelectionForm.valueChanges.subscribe(() => {
      this.dataService.stepHasUnsavedChanges = this.productSelectionForm.dirty;
      this.updateStepStatus();
    });

    this.invalidLoanPartsProduct$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.loanParts.controls.forEach((loanPartControl: AbstractControl) => {
        loanPartControl.updateValueAndValidity({ emitEvent: false });
      });
    });

    this.productSelectionForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$ || this.dataService.navigatedToPanel$))
      .subscribe(() => {
        this.saveData().subscribe(res => {
          if (!res) return;
          this.setLoanPartIds(res.loanParts);
          this.setPaymentTerms();
          if (this.journey === Journey.Illustration) {
            this.store.dispatch(loadProductSelectionSuccess({ entity: res }));
          }
        });
      });
  }

  private setMaxMortgageTerm() {
    if (this.route.snapshot.data?.section === 'illustration') {
      this.route.snapshot.data.summary?.caseData?.contactsInformation?.forEach((applicant: ContactInformationResponse) => {
        this.mortgageTermService.setMaxMortgageTerm(applicant?.dateOfBirth);
      });
    } else {
      this.store
        .select(getPersonalDetails)
        .pipe(take(1))
        .subscribe(applicants => {
          applicants?.applicantPersonalDetails?.forEach(applicant => {
            this.mortgageTermService.setMaxMortgageTerm(applicant?.birthDate);
          });
        });
    }
  }

  private setFormData() {
    if (!this.initialData.productData?.loanParts?.length) {
      this.addLoanPart({ loanPartAmount: this.initialData.productData?.loanAmount });
    } else {
      this.initialData.productData?.loanParts?.forEach(loanPart => {
        this.addLoanPart(loanPart);
        if (loanPart.loanPartAmount && this.remainingAmountValue) {
          this.remainingAmount.setValue(this.remainingAmountValue - loanPart.loanPartAmount);
        }
      });
    }
  }

  private setAtLeastOneValid(): void {
    this.atLeastOneValid = this.loanParts.controls.some(control => control.valid);
  }

  private checkRemainingAmount(): void {
    this.loanParts.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.getRemainingAmount();
    });
  }

  private setLoanPartIds(loanParts?: LoanPart[] | null) {
    let checkProductsAvailability = false;

    if (!loanParts) return;
    this.loanParts.controls.forEach((control, index) => {
      if (control.get('loanPartId') && !control.get('loanPartId')?.value) {
        loanParts[index]?.loanPartId && control.get('loanPartId')?.setValue(loanParts[index].loanPartId);
        checkProductsAvailability = true;
      }
    });
    checkProductsAvailability && this.caseSummaryService.checkProductsAvailability(this.appId, this.loanId);
  }

  private isLtvError(ltv: number | undefined, ltvMax: number, ltvMin: number): boolean {
    if (!ltv) return false;
    return ltv > ltvMax || ltv < ltvMin;
  }

  private shouldShowLtv(
    propertyValuationAmount: number | undefined | null,
    purchaseAmount: number | undefined | null,
    invalidProducts: number[] | undefined | null,
  ): boolean {
    if (invalidProducts?.length) return true;
    if (!propertyValuationAmount || !purchaseAmount) return false;
    return propertyValuationAmount < purchaseAmount;
  }
}
