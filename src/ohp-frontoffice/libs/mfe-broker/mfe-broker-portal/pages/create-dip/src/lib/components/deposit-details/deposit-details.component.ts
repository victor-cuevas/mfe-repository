import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';

import {
  CodeTablesService,
  DataService,
  GenericStepForm,
  getExistingMortgages,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantsType,
  CaseDataResponse,
  DepositDetailsRequest,
  DepositDetailsResponse,
  DepositType,
  DIPService,
  ExistingMortgageResponse,
  Journey,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dip-deposit-details',
  templateUrl: './deposit-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositDetailsComponent extends GenericStepForm implements OnInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.deposit.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  MODE: typeof Mode = Mode;
  DepositType = DepositType;
  currentData: DepositDetailsResponse = this.route.snapshot.data?.depositData?.depositDetailsData || {};
  caseData: CaseDataResponse = this.route.snapshot.data?.depositData?.caseData || {};
  existingMortgageData: ExistingMortgageResponse | undefined;
  totalLoanAmount = this.currentData.totalLoanAmount || 0;
  purchasePrice = this.currentData.purchaseAmount || 0;
  depositRequired = 0;
  toBeSatisfied = 0;

  isAllApplicantFirstTimeBuyer? = false;

  sourceOfDepositOptions = this.codeTablesService.getCodeTable('cdtb-deposittype');

  routePaths: typeof RoutePaths = RoutePaths;

  constructor(
    public dataService: DataService,
    private store: Store,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dipService: DIPService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private stepSetupService: StepSetupService,
    private cd: ChangeDetectorRef,
    private codeTablesService: CodeTablesService,
  ) {
    super();
  }

  depositDetailsForm: FormGroup = this.fb.group({
    depositDetails: this.fb.array([]),
  });

  get depositDetails(): FormArray {
    return this.depositDetailsForm.controls['depositDetails'] as FormArray;
  }

  ngOnInit(): void {
    this.store.select(getExistingMortgages).subscribe(response => (this.existingMortgageData = response));

    if (this.stepSetupService.isRemortgage && this.existingMortgageData?.amountToBeRepaid) {
      this.depositRequired = this.existingMortgageData?.amountToBeRepaid - this.totalLoanAmount;
      this.toBeSatisfied = this.depositRequired;
    } else {
      this.depositRequired = this.purchasePrice - this.totalLoanAmount;
      this.toBeSatisfied = this.depositRequired;
    }
    this.isAllApplicantFirstTimeBuyer = this.caseData?.contactsInformation?.every(el => {
      return el.contactType === ApplicantsType.FIRST_TIME_BUYER;
    });

    let sumOfAmountToDeposit = 0;

    this.currentData.deposits?.forEach((element: any) => {
      sumOfAmountToDeposit += element.depositAmount;
      this.toBeSatisfied = this.depositRequired - sumOfAmountToDeposit;
      this.addSourceOfDeposit(element);
    });

    if (!this.currentData.deposits?.length) {
      this.addSourceOfDeposit();
    }

    this.dataService.setFormStatus(this.depositDetailsForm.status, this.stepSetupService.deposit.automationId);
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.depositDetailsForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
          this.setValidation();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.depositDetailsForm.dirty;
  }

  setValidation() {
    if (this.depositDetailsForm.status == 'VALID' && this.toBeSatisfied == 0) {
      this.dataService.setFormStatus(this.depositDetailsForm.status, this.stepSetupService.deposit.automationId);
    } else {
      this.dataService.setFormStatus('INVALID', this.stepSetupService.deposit.automationId);
    }
  }

  addSourceOfDeposit(depositDetailsForm = { depositSourceType: '', depositAmount: null }) {
    const depositDetail: FormGroup = this.fb.group({
      depositSourceType: [depositDetailsForm.depositSourceType || null, Validators.required],
      depositAmount: [depositDetailsForm.depositAmount || null, Validators.required],
    });
    const index = this.depositDetails.length;

    depositDetail.get('depositAmount')?.valueChanges.subscribe(value => {
      let result = 0;
      this.depositDetails.controls.forEach((el, i) => {
        result += index !== i ? el.get('depositAmount')?.value : value;
      });
      this.toBeSatisfied = this.depositRequired - result;
    });

    this.depositDetails.push(depositDetail);
  }

  deleteDepositDetails(index: number) {
    this.toBeSatisfied += this.depositDetails.controls[index].get('depositAmount')?.value;
    this.depositDetails.removeAt(index);
  }

  onChanges() {
    this.depositDetailsForm.valueChanges.subscribe(() => {
      this.setValidation();
    });

    this.depositDetailsForm.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
      this.saveData().subscribe(response => {
        this.currentData.versionNumber = response.versionNumber;
      });
    });
  }

  saveData(): Observable<DepositDetailsResponse> {
    return this.dipService.dIPPutDepositDetails(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.depositDetailsForm.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.depositDetailsForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<DepositDetailsResponse> {
    return this.dipService.dIPGetDepositDetails(
      this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId,
      this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId,
    );
  }

  mapToDTO(): DepositDetailsRequest {
    const deposits = (this.depositDetails.controls as FormGroup[])
      .filter(value => value.valid)
      .map(depositDetail => depositDetail.getRawValue());

    return {
      versionNumber: this.currentData.versionNumber as number,
      deposits,
    };
  }

  setTextToDisplay(sourceOfDepositType: string): string {
    let textToDisplay = '';

    switch (sourceOfDepositType) {
      case DepositType.SAVINGS:
        textToDisplay = this.translateService.instant('createDip.labels.savingInfoMsg');
        break;
      case DepositType.EQUITY_RELEASE:
        textToDisplay = this.translateService.instant('createDip.labels.equityInfoMsg');
        break;
      case DepositType.GIFT:
        textToDisplay = this.translateService.instant('createDip.labels.giftWarning');
        break;
      case DepositType.FORCES_HELP_TO_BUY_SCHEME:
        textToDisplay = this.translateService.instant('createDip.labels.forcesHelpToBuyInfoMsg');
        break;
      case DepositType.HELP_TO_BUY_ISA_SCHEME:
        textToDisplay = this.translateService.instant('createDip.labels.helpToBuyISAInfoMsg');
        break;
      case DepositType.INHERITANCE:
        textToDisplay = this.translateService.instant('createDip.labels.inheritanceInfoMsg');
        break;
    }

    return textToDisplay;
  }
}
