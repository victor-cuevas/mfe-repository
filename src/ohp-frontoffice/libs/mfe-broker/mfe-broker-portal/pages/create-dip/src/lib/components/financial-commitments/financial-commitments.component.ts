import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CodeTablesService,
  DataService,
  GenericStepForm,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantFinancialCommitmentResponse,
  ApplicantInfo,
  DIPService,
  ExpenseType,
  FinancialCommitment,
  FinancialCommitmentsRequest,
  FinancialCommitmentsResponse,
  Journey,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { Calendar } from 'primeng/calendar';

const regularMonthlyPaymentList = [
  ExpenseType.CREDIT_CARD,
  ExpenseType.RENTAL_PURCHASE,
  ExpenseType.INTEREST_FREE_LOAN,
  ExpenseType.MAIL_ORDER_CREDIT,
  ExpenseType.OTHER,
  ExpenseType.PERSONAL_LOAN,
  ExpenseType.EXISTING_MORTGAGE,
  ExpenseType.STUDENT_LOAN,
  ExpenseType.NON_REVOLTING_CREDIT,
  ExpenseType.CREDIT_SALE,
  ExpenseType.CONDITIONAL_SALE,
  ExpenseType.FINANCE_LEASE,
  ExpenseType.OPERATING_LEASE,
  ExpenseType.RENTAL_PURCHASE,
  ExpenseType.FHTB_LOAN,
  ExpenseType.RENTAL_PURCHASE,
  ExpenseType.MORTGAGE_INVESTMENT,
  ExpenseType.INFORMAL_LOAN,
  ExpenseType.PAYDAY_LOAN,
  ExpenseType.DOORSTEP_LOAN,
  ExpenseType.NON_REVOLTING_CREDIT,
];

const paymentEndDateList = [
  ExpenseType.RENTAL_PURCHASE,
  ExpenseType.OTHER,
  ExpenseType.PERSONAL_LOAN,
  ExpenseType.EXISTING_MORTGAGE,
  ExpenseType.NON_REVOLTING_CREDIT,
  ExpenseType.INTEREST_FREE_LOAN,
  ExpenseType.CREDIT_SALE,
  ExpenseType.CONDITIONAL_SALE,
  ExpenseType.FINANCE_LEASE,
  ExpenseType.OPERATING_LEASE,
  ExpenseType.RENTAL_PURCHASE,
  ExpenseType.FHTB_LOAN,
  ExpenseType.RENTAL_PURCHASE,
  ExpenseType.MORTGAGE_INVESTMENT,
  ExpenseType.INFORMAL_LOAN,
  ExpenseType.PAYDAY_LOAN,
  ExpenseType.DOORSTEP_LOAN,
  ExpenseType.NON_REVOLTING_CREDIT,
];

const creditLimitList = [ExpenseType.CHARGE_CARD, ExpenseType.CREDIT_CARD, ExpenseType.BANK_ACCOUNT_WITH_CREDIT];

const futurePaymentsList = [ExpenseType.BUY_NOW_PAY_LATER];

const paymentStartDateList = [ExpenseType.BUY_NOW_PAY_LATER];

const detailsList = [ExpenseType.OTHER];

interface FeFinancialCommitment extends Omit<FinancialCommitment, 'paymentStartDate' | 'paymentEndDate'> {
  paymentStartDate?: Date | null;
  paymentEndDate?: Date | null;
}

interface FeApplicantFinancialCommitmentResponse {
  applicantInfo?: ApplicantInfo;
  hasFinancialCommitements?: boolean | null;
  financialCommitments?: Array<FeFinancialCommitment> | null;
}

@Component({
  selector: 'dip-financial-commitments',
  templateUrl: './financial-commitments.component.html',
})
export class FinancialCommitmentsComponent extends GenericStepForm implements OnInit, OnDestroy {
  @ViewChild('calendarPaymentStartDate', { static: false }) private calendarPaymentStartDate: Calendar | undefined;
  @ViewChild('calendarPaymentEndDate', { static: false }) private calendarPaymentEndDate: Calendar | undefined;
  readonly STEP_NAME = this.stepSetupService.financialCommitments.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  MODE: typeof Mode = Mode;
  expenditureTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-financialcommitments');
  EXPENSE_TYPES = ExpenseType;

  //static value
  currentDate = new Date(Date.now());
  minDatePaymentEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
  maxDatePaymentEndDate = new Date(this.currentDate.getFullYear() + 50, 11, 31);
  minDatePaymentStartDate = new Date(this.currentDate.getFullYear() - 5, 0, 1);
  maxDatePaymentStartDate = new Date(this.currentDate.getFullYear() + 5, 11, 31);
  routePaths: typeof RoutePaths = RoutePaths;
  applicantsForm = this.fb.array([]);

  // valueCheck lists
  regularMonthlyPaymentList = regularMonthlyPaymentList;
  paymentEndDateList = paymentEndDateList;
  futurePaymentsList = futurePaymentsList;
  paymentStartDateList = paymentStartDateList;
  creditLimitList = creditLimitList;
  detailsList = detailsList;

  private initialData: FinancialCommitmentsResponse = this.route.snapshot.data?.financialCommitmentsData || {};

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private dipService: DIPService,
    private route: ActivatedRoute,
    public stepSetupService: StepSetupService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private codeTablesService: CodeTablesService,
  ) {
    super();
  }

  ngOnInit() {
    this.initialData?.applicantFinancialCommitments?.forEach((applicant, index) => {
      this.addApplicant(applicant, index);
    });
    this.dataService.setFormStatus(this.applicantsForm.status, this.STEP_NAME);
    this.checkActiveJourney();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.applicantsForm)
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
    return this.applicantsForm.dirty;
  }

  onChanges() {
    this.applicantsForm.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.applicantsForm.status, this.STEP_NAME);
    });
    this.applicantsForm.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
      this.saveData().subscribe(response => {
        this.initialData.versionNumber = response.versionNumber;
      });
    });
  }

  private handleError() {
    this.saveData().subscribe(response => {
      this.initialData.versionNumber = response?.versionNumber as number;
    });
  }

  saveData(): Observable<FinancialCommitmentsResponse> {
    return this.dipService.dIPPutFinancialCommitments(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.applicantsForm.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.applicantsForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  addFinancialCommitment(index: number, commitmentData?: FeFinancialCommitment | FinancialCommitment) {
    const formGroup = this.createFinancialCommitment(commitmentData);

    this.setValidators(formGroup);

    formGroup.controls.expenditureType?.valueChanges.subscribe(() => {
      this.setValidators(formGroup);
    });

    (this.applicantsForm.at(index).get('financialCommitments') as FormArray).push(formGroup);
  }

  getFinancialCommitments(index: number): FormArray {
    return this.applicantsForm.at(index).get('financialCommitments') as FormArray;
  }

  removeFinancialCommitment(applicantIndex: number, financialCommitmentIndex: number): void {
    this.getFinancialCommitments(applicantIndex).removeAt(financialCommitmentIndex);
    this.applicantsForm.markAsDirty();
    this.applicantsForm.updateValueAndValidity();
  }

  getData(): Observable<FinancialCommitmentsResponse> {
    return this.dipService.dIPGetFinancialCommitments(this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }

  mapToDTO(): FinancialCommitmentsRequest {
    const data = this.applicantsForm.getRawValue();
    return {
      versionNumber: this.initialData.versionNumber as number,
      applicantFinancialCommitments: data.map((applicant: FeApplicantFinancialCommitmentResponse) => {
        if (applicant.hasFinancialCommitements) {
          return {
            applicantId: applicant.applicantInfo?.applicantId,
            hasFinancialCommitements: applicant?.hasFinancialCommitements,
            financialCommitments: applicant.financialCommitments?.map((data: FeFinancialCommitment): FinancialCommitment => {
              const paymentEndDate = data?.paymentEndDate
                ? new Date(data?.paymentEndDate?.getTime() - data?.paymentEndDate?.getTimezoneOffset() * 60 * 1000).toISOString()
                : undefined;

              const paymentStartDate = data?.paymentStartDate
                ? new Date(data?.paymentStartDate?.getTime() - data?.paymentStartDate?.getTimezoneOffset() * 60 * 1000).toISOString()
                : undefined;

              return {
                ...data,
                paymentEndDate,
                futurePayments: data?.futurePayments,
                paymentStartDate,
              };
            }),
          };
        } else {
          return {
            applicantId: applicant.applicantInfo?.applicantId,
            hasFinancialCommitements: applicant?.hasFinancialCommitements,
            financialCommitments: [],
          };
        }
      }),
    };
  }

  //TODO fill the infoMsgExpenseTypes when the client know the final text
  public displayInfoMsgExpenseTypes(expenseTypes: string): string {
    let infoMsgExpenseTypes = '';
    switch (expenseTypes) {
      case ExpenseType.BUY_NOW_PAY_LATER:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.CHARGE_CARD:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.CREDIT_CARD:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.RENTAL_PURCHASE:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.INTEREST_FREE_LOAN:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.MAIL_ORDER_CREDIT:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.BANK_ACCOUNT_WITH_CREDIT:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.PERSONAL_LOAN:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.EXISTING_MORTGAGE:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.STUDENT_LOAN:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.NON_REVOLTING_CREDIT:
        infoMsgExpenseTypes = '';
        break;
      case ExpenseType.OTHER:
        infoMsgExpenseTypes = '';
        break;
    }

    return infoMsgExpenseTypes;
  }

  populateYearRange() {
    if (this.calendarPaymentEndDate) {
      this.calendarPaymentEndDate.populateYearOptions(this.currentDate.getFullYear(), this.currentDate.getFullYear() + 50);
    }
    if (this.calendarPaymentStartDate) {
      this.calendarPaymentStartDate.populateYearOptions(this.currentDate.getFullYear() - 5, this.currentDate.getFullYear() + 5);
    }
  }

  private createApplicantForm(applicant: ApplicantFinancialCommitmentResponse) {
    return this.fb.group({
      applicantInfo: this.fb.group({
        applicantId: applicant.applicantInfo?.applicantId,
        familyName: applicant.applicantInfo?.familyName,
        familyNamePrefix: applicant.applicantInfo?.familyNamePrefix,
        firstName: applicant.applicantInfo?.firstName,
      }),
      hasFinancialCommitements: [applicant.hasFinancialCommitements, Validators.required],
      financialCommitments: this.fb.array([]),
    });
  }

  private setValidators(formGroup: FormGroup): void {
    const optionalFormControls: { controlName: string; list: ExpenseType[] }[] = [
      { controlName: 'regularMonthlyPayment', list: this.regularMonthlyPaymentList },
      { controlName: 'paymentEndDate', list: this.paymentEndDateList },
      { controlName: 'futurePayments', list: this.futurePaymentsList },
      { controlName: 'paymentStartDate', list: this.paymentStartDateList },
      { controlName: 'creditLimit', list: this.creditLimitList },
      { controlName: 'details', list: this.detailsList },
    ];

    optionalFormControls.forEach(optionalFormControl =>
      this.toggleRequired(optionalFormControl.controlName, formGroup, optionalFormControl.list),
    );
  }

  private addApplicant(applicant: ApplicantFinancialCommitmentResponse, applicantIndex: number): void {
    const applicantForm = this.createApplicantForm(applicant);
    applicantForm.get('hasFinancialCommitements')?.valueChanges.subscribe(value => {
      if (value) {
        this.addFinancialCommitment(applicantIndex);
      } else {
        this.clearFormArray(applicantForm.get('financialCommitments') as FormArray);
        applicantForm.get('financialCommitments')?.reset();
      }
    });
    this.applicantsForm.push(applicantForm);

    if (applicant.financialCommitments?.length) {
      applicant.financialCommitments.forEach(commitment => this.addFinancialCommitment(applicantIndex, commitment));
    } else if (applicant.hasFinancialCommitements) {
      this.addFinancialCommitment(applicantIndex);
    }
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private toggleRequired(controlName: string, formGroup: FormGroup, list: ExpenseType[]): void {
    const expenditureType = formGroup.get('expenditureType')?.value;
    if (expenditureType && list.includes(expenditureType)) {
      formGroup.get(controlName)?.addValidators(Validators.required);
    } else {
      formGroup.get(controlName)?.removeValidators(Validators.required);
      formGroup.get(controlName)?.setValue(undefined, { onlySelf: true });
      formGroup.get(controlName)?.markAsUntouched({ onlySelf: true });
      formGroup.get(controlName)?.markAsPristine({ onlySelf: true });
    }
    formGroup.get(controlName)?.updateValueAndValidity({ onlySelf: true });
  }

  private createFinancialCommitment(commitment?: FeFinancialCommitment | FinancialCommitment): FormGroup {
    return this.fb.group({
      expenditureType: [commitment?.expenditureType, Validators.required],
      provider: [commitment?.provider, Validators.required],
      currentBalanceOwing: [commitment?.currentBalanceOwing, Validators.required],
      regularMonthlyPayment: commitment?.regularMonthlyPayment,
      paymentEndDate: commitment?.paymentEndDate ? new Date(commitment?.paymentEndDate) : null,
      futurePayments: commitment?.futurePayments,
      paymentStartDate: commitment?.paymentStartDate ? new Date(commitment?.paymentStartDate) : null,
      creditLimit: commitment?.creditLimit,
      details: [commitment?.details, Validators.compose([Validators.minLength(10), Validators.maxLength(50)])],
    });
  }
}
