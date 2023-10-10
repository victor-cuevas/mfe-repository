import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  CheckRetirementService,
  CodeTablesService,
  DataService,
  FeRetirementIncomeDetail,
  getPersonalDetails,
  RoutePaths,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantPersonalDetails,
  ApplicantRetirementIncomeResponse,
  PensionType,
  RetirementIncomeDetailsRequest,
  RetirementIncomeDetailsResponse,
  RetirementIncomeSource,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'mbp-retirement-income',
  templateUrl: './retirement-income.component.html',
})
export class RetirementIncomeComponent implements OnInit {
  @Input() isFMA = false;
  @ViewChild('calendarStartDate', { static: false }) private calendarStartDate: Calendar | undefined;

  readonly STEP_NAME = 'retirementIncome';

  retiredApplicants$ = new Subject();
  retirementIncomeType = RetirementIncomeSource;
  pensionType = PensionType;
  applicantPersonalDetails?: ApplicantPersonalDetails[] | null;
  minYear = new Date().getFullYear() - 20;
  maxYear = new Date().getFullYear();
  defaultDate = new Date(this.minYear, new Date().getMonth());
  currentDay = new Date(this.maxYear, new Date().getMonth(), new Date().getDate());
  minDateContractStartDate = new Date(this.minYear, 0, 1);

  routePaths: typeof RoutePaths = RoutePaths;

  initialData: RetirementIncomeDetailsResponse = this.route.snapshot.data?.retirementIncomeData || {};
  applicantsForm = this.fb.array([]);
  section = this.route.snapshot.data?.section || '';

  incomeSourceOptions = this.codeTablesService.getCodeTable('cdtb-ads-retirementincomesource');
  pensionTypeOptions = this.codeTablesService.getCodeTable('cdtb-withdrawmethod');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private checkRetirementService: CheckRetirementService,
    public dataService: DataService,
    private store: Store,
    private codeTablesService: CodeTablesService,
  ) {}

  ngOnInit() {
    // TODO remove when backend calculate retirement start date
    this.store.select(getPersonalDetails).subscribe(reduxData => (this.applicantPersonalDetails = reduxData?.applicantPersonalDetails));
    this.setFormData();
  }

  private setFormData() {
    this.initialData?.applicantRetirementIncomeDetails?.forEach((applicant, index) => {
      this.addApplicant(applicant, index);
    });
  }

  private addApplicant(applicant: ApplicantRetirementIncomeResponse, applicantIndex: number): void {
    this.applicantsForm.push(
      this.fb.group({
        applicantInfo: this.fb.group({
          applicantId: applicant.applicantInfo?.applicantId,
          familyName: applicant.applicantInfo?.familyName,
          familyNamePrefix: applicant.applicantInfo?.familyNamePrefix,
          firstName: applicant.applicantInfo?.firstName,
          isRetired: false,
        }),
        retirementIncomeDetails: this.fb.array([]),
      }),
    );
    if (applicant.retirementIncomeDetails?.length) {
      applicant.retirementIncomeDetails.forEach(detail => this.addRetirementIncomeDetail(applicantIndex, detail));
    } else {
      this.checkRetirementService.applicantRetiresById(applicant?.applicantInfo?.applicantId as number).subscribe(bool => {
        if (bool) {
          this.addRetirementIncomeDetail(applicantIndex);
        }
      });
    }
  }

  private createRetirementIncomeDetail(detail?: FeRetirementIncomeDetail): FormGroup {
    return this.fb.group({
      anticipatedAnnualIncome: [detail?.anticipatedAnnualIncome, Validators.required],
      anticipatedNetMonthlyIncome: [detail?.anticipatedNetMonthlyIncome],
      canTheIncomeBeVerified: [detail?.canTheIncomeBeVerified, Validators.required],
      currentValue: detail?.currentValue,
      description: detail?.description,
      incomeSource: [detail?.incomeSource, Validators.required],
      isTheIncomeGuaranteed: [detail?.isTheIncomeGuaranteed, Validators.required],
      pensionType: detail?.pensionType,
      projectedValue: detail?.projectedValue,
      isRetired: false,
      startDate: detail?.startDate ? new Date(detail?.startDate) : null,
    });
  }

  private togglePensionTypeValidators(formGroup: FormGroup): void {
    const { incomeSource, isRetired }: { incomeSource?: string; isRetired?: boolean } = formGroup.getRawValue();
    const pensionTypeControl = formGroup.get('pensionType');

    incomeSource === RetirementIncomeSource.PENSION_INCOME && isRetired
      ? pensionTypeControl?.addValidators(Validators.required)
      : pensionTypeControl?.removeValidators(Validators.required);

    pensionTypeControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private toggleCurrentValueValidators(formGroup: FormGroup): void {
    const { incomeSource, pensionType, isRetired }: { incomeSource?: string; pensionType?: string; isRetired?: boolean } =
      formGroup.getRawValue();
    const currentIncomeControl = formGroup.get('currentValue');

    (incomeSource === RetirementIncomeSource.PENSION_INCOME && !isRetired) ||
    (incomeSource === RetirementIncomeSource.PENSION_INCOME && pensionType === PensionType.DRAW_DOWN && isRetired)
      ? currentIncomeControl?.addValidators(Validators.required)
      : currentIncomeControl?.removeValidators(Validators.required);

    currentIncomeControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private toggleProjectedValueValidators(formGroup: FormGroup): void {
    const { incomeSource, isRetired } = formGroup.getRawValue();
    const projectedValueControl = formGroup.get('projectedValue');

    incomeSource === RetirementIncomeSource.PENSION_INCOME && !isRetired
      ? projectedValueControl?.addValidators(Validators.required)
      : projectedValueControl?.removeValidators(Validators.required);

    projectedValueControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private toggleDescriptionValidators(formGroup: FormGroup): void {
    const { incomeSource } = formGroup.getRawValue();
    const descriptionControl = formGroup.get('description');

    !(incomeSource === RetirementIncomeSource.PENSION_INCOME) &&
    !(incomeSource === RetirementIncomeSource.PENSION_STATE) &&
    !(incomeSource === RetirementIncomeSource.PENSION_WAR_PENSION_SCHEME)
      ? descriptionControl?.addValidators(Validators.required)
      : descriptionControl?.removeValidators(Validators.required);

    descriptionControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private toggleStartDateValidators(formGroup: FormGroup): void {
    const { incomeSource } = formGroup.getRawValue();
    const startDateControl = formGroup.get('startDate');

    incomeSource === RetirementIncomeSource.INVESTMENT_INCOME
      ? startDateControl?.addValidators(Validators.required)
      : startDateControl?.removeValidators(Validators.required);

    startDateControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  public applicantIsRetiredById(id: number) {
    return this.checkRetirementService.applicantIsRetiredById(id);
  }

  public getRetirementIncomeDetails(index: number): FormArray {
    return this.applicantsForm.at(index).get('retirementIncomeDetails') as FormArray;
  }

  public removeRetirementIncomeDetail(applicantIndex: number, retirementDetailIndex: number): void {
    this.getRetirementIncomeDetails(applicantIndex).removeAt(retirementDetailIndex);
    this.applicantsForm.markAsDirty();
  }

  public addRetirementIncomeDetail(index: number, detailData?: FeRetirementIncomeDetail) {
    const detailGroup = this.createRetirementIncomeDetail(detailData);
    const { isRetired }: { isRetired?: boolean } = detailGroup.getRawValue();

    this.checkRetirementService
      .applicantIsRetiredById(this.applicantsForm.at(index).get('applicantInfo')?.get('applicantId')?.value)
      .pipe(take(1))
      .subscribe(value => {
        this.applicantsForm.at(index).get('applicantInfo')?.get('isRetired')?.setValue(value);
        detailGroup.get('isRetired')?.setValue(value);

        this.togglePensionTypeValidators(detailGroup);
        this.toggleCurrentValueValidators(detailGroup);
        this.toggleProjectedValueValidators(detailGroup);
        this.toggleDescriptionValidators(detailGroup);
        this.toggleStartDateValidators(detailGroup);
      });

    detailGroup.get('incomeSource')?.valueChanges.subscribe(value => {
      const startDateValue = !isRetired && value === this.retirementIncomeType.INVESTMENT_INCOME ? null : this.defaultDate;
      detailGroup.get('startDate')?.setValue(startDateValue);
    });

    detailGroup.get('pensionType')?.valueChanges.subscribe(() => {
      this.toggleCurrentValueValidators(detailGroup);
    });

    detailGroup.valueChanges.subscribe(() => {
      this.togglePensionTypeValidators(detailGroup);
      this.toggleCurrentValueValidators(detailGroup);
      this.toggleProjectedValueValidators(detailGroup);
      this.toggleDescriptionValidators(detailGroup);
      this.toggleStartDateValidators(detailGroup);
    });

    this.getRetirementIncomeDetails(index).push(detailGroup);
  }

  public mapToDTO(): RetirementIncomeDetailsRequest {
    const data = this.applicantsForm.getRawValue();
    return {
      versionNumber: this.initialData.versionNumber as number,
      applicantRetirementIncomeDetails: data.map((applicant: any, index: number) => ({
        applicantId: applicant.applicantInfo?.applicantId,
        retirementIncomeDetails: applicant.retirementIncomeDetails.map((retirementIncomeDetail: FeRetirementIncomeDetail) => {
          const {
            incomeSource,
            pensionType,
            anticipatedAnnualIncome,
            currentValue,
            projectedValue,
            description,
            anticipatedNetMonthlyIncome,
            isTheIncomeGuaranteed,
            canTheIncomeBeVerified,
            isRetired,
            startDate,
          } = retirementIncomeDetail;

          // TODO remove when backend calculate retirement start date
          const expectedRetirementAge: number = this.applicantPersonalDetails?.[index].expectedRetirementAge || 0;
          const birthDate: Date = new Date(this.applicantPersonalDetails?.[index].birthDate || '');
          const yearOfBirth: number = birthDate.getFullYear();
          let retirementStartDate: Date = new Date(this.applicantPersonalDetails?.[index].birthDate || '');

          retirementStartDate.setFullYear(yearOfBirth + expectedRetirementAge);
          retirementStartDate = expectedRetirementAge ? retirementStartDate : new Date();

          return {
            incomeSource: incomeSource,
            pensionType: incomeSource === RetirementIncomeSource.PENSION_INCOME ? pensionType : undefined,
            currentValue:
              (incomeSource === RetirementIncomeSource.PENSION_INCOME && !isRetired) ||
              (incomeSource === RetirementIncomeSource.PENSION_INCOME && pensionType === PensionType.DRAW_DOWN && isRetired)
                ? currentValue
                : undefined,
            projectedValue: incomeSource === RetirementIncomeSource.PENSION_INCOME && !isRetired ? projectedValue : undefined,
            anticipatedAnnualIncome,
            description:
              !(incomeSource === RetirementIncomeSource.PENSION_INCOME) &&
              !(incomeSource === RetirementIncomeSource.PENSION_STATE) &&
              !(incomeSource === RetirementIncomeSource.PENSION_WAR_PENSION_SCHEME)
                ? description
                : undefined,
            anticipatedNetMonthlyIncome,
            isTheIncomeGuaranteed,
            canTheIncomeBeVerified,
            // startDate: incomeSource === RetirementIncomeSource.INVESTMENT_INCOME ? startDate : new Date() TODO restore when backend calculate retirement start date
            startDate: incomeSource === RetirementIncomeSource.INVESTMENT_INCOME ? startDate : retirementStartDate,
          };
        }),
      })),
    };
  }

  //Workaround for navigate in the past in the calendar
  //TODO remove when updating the ngprime library
  populateYearRange() {
    if (this.calendarStartDate) {
      this.calendarStartDate.populateYearOptions(this.minYear, this.maxYear);
    }
  }
}
