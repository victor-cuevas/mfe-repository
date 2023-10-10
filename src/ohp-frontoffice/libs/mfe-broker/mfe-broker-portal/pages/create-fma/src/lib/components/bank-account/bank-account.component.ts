import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { DataService, GenericStepForm, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  BankAccountDetailsRequest,
  BankAccountDetailsResponse,
  BankAccountOwner,
  BankAccountResponseTypeEnum,
  FMAService,
  Journey,
  Response as BankAccountValidationError,
  StepStatusEnum,
  ValidateBankAccountResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { atLeastOneChecked } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';

@Component({
  selector: 'close-front-office-bank-account',
  templateUrl: './bank-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.bankAccount.automationId;

  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  preferredDayOptions = Array.from({ length: 28 }, (_, i) => ({ value: i + 1, label: i + 1 }));

  currentData: BankAccountDetailsResponse = this.route.snapshot.data.bankAccountData || {};
  status: 'VALID' | 'INVALID' | null = null;
  statusType: string | undefined = '';
  validationErrors: BankAccountValidationError[] = [];
  validationWarnings: BankAccountValidationError[] = [];
  validatingBankAccount$ = new BehaviorSubject(false);
  bankAccountResponseTypeEnum: typeof BankAccountResponseTypeEnum = BankAccountResponseTypeEnum;
  stepStatusEnum: typeof StepStatusEnum = StepStatusEnum;
  bankAccountForm: FormGroup = this.fb.group({
    applicants: this.fb.array([], atLeastOneChecked('isOwner')),
    sortCode: [this.currentData.sortCode, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{6}$/)])],
    accountNumber: [this.currentData.accountNumber, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{8}$/)])],
    preferredDay: [this.currentData.preferredDayOfTheMonthForDirectDebits, Validators.required],
    confirmation: [false],
  });

  isBankAccountAccepted = false;

  get applicants(): FormArray {
    return this.bankAccountForm.controls['applicants'] as FormArray;
  }

  MODE: typeof Mode = Mode;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private fmaService: FMAService,
    public dataService: DataService,
    private cd: ChangeDetectorRef,
    private stepSetupService: StepSetupService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setFormData();
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.bankAccountForm)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
          this.validateAccount();
          this.onChanges();
        }
      });
  }

  getData(): Observable<BankAccountDetailsResponse> {
    return this.fmaService.fMAGetBankAccountDetails(this.appId);
  }

  hasUnsavedChanges(): boolean {
    return this.bankAccountForm.dirty;
  }

  mapToDTO(): BankAccountDetailsRequest {
    const formValues = this.bankAccountForm.getRawValue() as any;
    const applicantIds = formValues.applicants.reduce(
      (acc: string[], applicant: BankAccountOwner) => (applicant.isOwner ? [...acc, applicant.applicantId] : acc),
      [],
    );

    return {
      versionNumber: this.currentData.versionNumber as number,
      applicantIds: applicantIds as Array<number> | null,
      accountNumber: formValues.accountNumber as string | null,
      preferredDayOfTheMonthForDirectDebits: formValues.preferredDay as number | null,
      sortCode: formValues.sortCode as string | null,
    };
  }

  validateAccount() {
    const { applicantIds, accountNumber, sortCode } = this.mapToDTO();

    if (this.bankAccountForm.status === StepStatusEnum.INVALID) return;

    this.dataService.setStepStatus(StepStatusEnum.INVALID, this.STEP_NAME);

    this.validatingBankAccount$.next(true);
    this.fmaService
      .fMAGetValidateBankaccount(this.appId, applicantIds as number[], accountNumber as string, sortCode as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (response: ValidateBankAccountResponse) => {
          this.validatingBankAccount$.next(false);
          this.status = response.isValid ? StepStatusEnum.VALID : StepStatusEnum.INVALID;
          this.validationWarnings = [];
          this.validationErrors = [];
          // Bank account is accepted + workaround for sort code 123456 and bank account number 12345678
          if (
            (this.status === StepStatusEnum.VALID && response.responses?.length === 0) ||
            (this.status === StepStatusEnum.VALID && response.responses?.[0].responseType === BankAccountResponseTypeEnum.INFORMATION)
          ) {
            this.isBankAccountAccepted = true;
            this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
          }

          //Bank account is not valid
          if (this.status === StepStatusEnum.INVALID) {
            this.validationErrors = response.responses?.filter(error => error.responseType === BankAccountResponseTypeEnum.ERROR) || [];
            this.isBankAccountAccepted = false;
            this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
          }

          if (this.status === StepStatusEnum.VALID && response.responses?.length) {
            this.validationWarnings =
              (response.isValid && response.responses?.filter(error => error.responseType === BankAccountResponseTypeEnum.WARNING)) || [];
            this.bankAccountForm.controls.confirmation.setValidators(Validators.required);
          } else {
            this.bankAccountForm.controls.confirmation.setValidators(null);
          }
          this.bankAccountForm.controls.confirmation.updateValueAndValidity({ emitEvent: false });
          this.bankAccountForm.controls.applicants.markAsPristine();
          this.bankAccountForm.controls.accountNumber.markAsPristine();
          this.bankAccountForm.controls.sortCode.markAsPristine();
          this.bankAccountForm.markAsDirty();
          if (response.responses) {
            Array.from(document.getElementsByClassName('scroll-container')).forEach(scrollContainer =>
              scrollContainer.scroll({ top: 0, left: 0, behavior: 'smooth' }),
            );
          }
        },
        error => {
          this.validatingBankAccount$.next(false);
          return throwError(error);
        },
      );
  }

  getStepStatus(): StepStatusEnum | null {
    if (this.bankAccountForm.status === StepStatusEnum.VALID && this.isBankAccountAccepted) return StepStatusEnum.VALID;
    if (this.bankAccountForm.status === StepStatusEnum.INVALID || !this.isBankAccountAccepted) return StepStatusEnum.INVALID;
    return null;
  }

  saveData(): Observable<BankAccountDetailsResponse> {
    return this.fmaService.fMAPutBankAccountDetails(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.bankAccountForm.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Fma,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.bankAccountForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  private onChanges() {
    this.bankAccountForm.valueChanges.subscribe(() => {
      if (
        !this.bankAccountForm.controls.applicants.pristine ||
        !this.bankAccountForm.controls.accountNumber.pristine ||
        !this.bankAccountForm.controls.sortCode.pristine
      ) {
        this.status = null;
        this.isBankAccountAccepted = false;
        this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
      }
    });
    this.bankAccountForm.get('confirmation')?.valueChanges.subscribe((value: boolean) => {
      if (this.bankAccountForm.status === StepStatusEnum.VALID && this.validationWarnings.length) {
        value ? (this.isBankAccountAccepted = true) : (this.isBankAccountAccepted = false);
        this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
      }
    });

    this.bankAccountForm.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
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

  private setFormData() {
    this.currentData.applicants?.forEach((applicant: BankAccountOwner) =>
      this.applicants.push(
        this.fb.group({
          applicantId: [applicant.applicantId],
          fullName: [applicant.fullName],
          isOwner: [applicant.isOwner],
        }),
      ),
    );
  }
}
