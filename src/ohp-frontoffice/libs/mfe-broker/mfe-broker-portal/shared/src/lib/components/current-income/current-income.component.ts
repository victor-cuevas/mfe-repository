import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddressFeService, DataService, GroupValidators } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantIncomeResponse,
  CurrentIncomeResponse,
  EmploymentContractType,
  EmploymentStatus,
  IncomeDescription,
  IncomeDetail,
  IncomeType,
  Months,
  OtherIncome,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  selector: 'mbp-current-income',
  templateUrl: './current-income.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentIncomeComponent implements AfterViewInit {
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  @Input() isFMA = false;

  //Data
  currentData: CurrentIncomeResponse = this.route.snapshot.data.currentIncomeData || {};

  applicantsFormArray = this.fb.array([]);

  currentIncomeFormArray(index: number) {
    return this.applicantsFormArray.at(index).get('currentIncome') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    readonly cd: ChangeDetectorRef,
    public dataService: DataService,
    private addressFeService: AddressFeService,
  ) {}

  ngAfterViewInit(): void {
    this.currentData.applicantIncomes && this.setFormData(this.currentData.applicantIncomes);
    this.cd.detectChanges();
  }

  addIncomes(index: number) {
    const currentIncomeForm = this.currentIncomeForm();
    this.setFieldValidators(currentIncomeForm);

    this.currentIncomeFormArray(index).push(currentIncomeForm);
  }

  deleteCurrentIncome(indexApplicants: number, indexCurrentIncome: number) {
    this.currentIncomeFormArray(indexApplicants).removeAt(indexCurrentIncome);
    this.applicantsFormArray.markAsDirty();
  }

  private setFormData(applicantIncomes: ApplicantIncomeResponse[]) {
    applicantIncomes.forEach((data: ApplicantIncomeResponse) => {
      const currentIncomeForm = this.fb.group({
        applicantId: data.applicantInfo?.applicantId,
        applicantFullName: `${data?.applicantInfo?.firstName} ${data?.applicantInfo?.familyName}`,
        currentIncome: this.fb.array([]),
      });

      if (data.incomeDetails && data.incomeDetails.length) {
        data.incomeDetails.forEach((el: IncomeDetail, index: number) => {
          const form = this.currentIncomeForm(el);
          (currentIncomeForm.controls.currentIncome as FormArray).push(form);
          if (index > 0) {
            form.get('incomeType')?.setValue(IncomeType.EMPLOYMENT);
          }
          setTimeout(() => {
            const address = el.employer?.address ? this.addressFeService.mapAddressBFFToAddressFE(el.employer.address) : null;
            form.get('address')?.get('selectedAddressControl')?.patchValue(address);
            this.applicantsFormArray.updateValueAndValidity();
          }, 1);
        });
      } else {
        const form = this.currentIncomeForm();
        (currentIncomeForm.controls.currentIncome as FormArray).push(form);
      }

      if (data.otherIncomes && data.otherIncomes.length) {
        data.otherIncomes.forEach((el: OtherIncome) => {
          const form = this.currentIncomeForm({}, el);
          form.get('incomeType')?.setValue(IncomeType.OTHER_INCOME);
          (currentIncomeForm.controls.currentIncome as FormArray).push(form);
        });
      }

      this.applicantsFormArray.push(currentIncomeForm);
      setTimeout(() => {
        this.applicantsFormArray.patchValue(this.applicantsFormArray?.value);
      }, 0);
    });

    this.applicantsFormArray.controls.forEach(formGroup => {
      (formGroup.get('currentIncome') as FormArray).controls.forEach(controls => {
        this.setFieldValidators(controls as FormGroup);
      });
    });
  }

  private setFieldValidators(group: FormGroup) {
    group.get('currentEmploymentStatus')?.valueChanges.subscribe(value => {
      if (value) {
        const vl = group as FormGroup;
        Object.keys(vl.controls).forEach(item => {
          group.get(item)?.setValidators(null);
          group.get(item)?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        });
        group.get('currentEmploymentStatus')?.setValidators(Validators.required);
      }

      group.get('contractType')?.setValidators(null);
      group.get('contractStartDate')?.setValidators(null);
      group.get('jobTitle')?.setValidators(null);
      group.get('employerName')?.setValidators(null);
      group.get('canIncomeBeVerified')?.setValidators(null);
      group.get('isIncomeRecurrentSalaryOrDailyRate')?.setValidators(null);
      group.get('contractEndDate')?.setValidators(null);

      switch (value) {
        case EmploymentStatus.Employed:
          group.get('contractType')?.setValidators(Validators.required);
          group.get('contractStartDate')?.setValidators(Validators.required);
          group.get('jobTitle')?.setValidators(Validators.required);
          group.get('employerName')?.setValidators(Validators.required);
          group.get('canIncomeBeVerified')?.setValidators(Validators.required);
          group.get('isIncomeRecurrentSalaryOrDailyRate')?.setValidators(Validators.required);
          break;
        case EmploymentStatus.Director25Plus:
          group.get('contractStartDate')?.setValidators(Validators.required);
          group.get('jobTitle')?.setValidators(Validators.required);
          group.get('canIncomeBeVerified')?.setValidators(Validators.required);
          group.get('employerName')?.setValidators(Validators.required);
          group.get('companyType')?.setValidators(Validators.required);
          break;
        case EmploymentStatus.SelfEmployedPartnership:
        case EmploymentStatus.SelfEmployed:
          group.get('contractStartDate')?.setValidators(Validators.required);
          group.get('jobTitle')?.setValidators(Validators.required);
          group.get('canIncomeBeVerified')?.setValidators(Validators.required);
          group.get('employerName')?.setValidators(Validators.required);
          group.get('canIncomeBeVerified')?.setValidators(Validators.required);
          group.get('currentEmploymentStatus')?.value === EmploymentStatus.SelfEmployedPartnership
            ? group.get('partnershipType')?.setValidators(Validators.required)
            : group.get('partnershipType')?.setValidators(null);
          break;
        case EmploymentStatus.DirectorLess25:
          group.get('contractStartDate')?.setValidators(Validators.required);
          group.get('jobTitle')?.setValidators(Validators.required);
          group.get('employerName')?.setValidators(Validators.required);
          group.get('canIncomeBeVerified')?.setValidators(Validators.required);
          group.get('isIncomeRecurrentSalaryOrDailyRate')?.setValidators(Validators.required);
          group.get('contractType')?.setValidators(Validators.required);
          break;
      }
      group.get('contractType')?.updateValueAndValidity();
      group.get('contractStartDate')?.updateValueAndValidity();
      group.get('jobTitle')?.updateValueAndValidity();
      group.get('employerName')?.updateValueAndValidity();
      group.get('canIncomeBeVerified')?.updateValueAndValidity();
      group.get('isIncomeRecurrentSalaryOrDailyRate')?.updateValueAndValidity();
      group.get('companyType')?.updateValueAndValidity();
      group.get('partnershipType')?.updateValueAndValidity();
      group.get('contractEndDate')?.updateValueAndValidity();
    });

    group.get('isIncomeRecurrentSalaryOrDailyRate')?.valueChanges.subscribe(value => {
      if (
        value === IncomeDescription.SALARY &&
        (group.get('currentEmploymentStatus')?.value === EmploymentStatus.Employed ||
          group.get('currentEmploymentStatus')?.value === EmploymentStatus.DirectorLess25)
      ) {
        group.get('basicSalary')?.setValidators(Validators.required);
        group.get('dailyRate')?.setValidators(null);
      } else if (
        value === IncomeDescription.DAILY_RATE &&
        (group.get('currentEmploymentStatus')?.value === EmploymentStatus.Employed ||
          group.get('currentEmploymentStatus')?.value === EmploymentStatus.DirectorLess25)
      ) {
        group.get('dailyRate')?.setValidators(Validators.required);
        group.get('basicSalary')?.setValidators(null);
      }
      group.get('basicSalary')?.updateValueAndValidity();
      group.get('dailyRate')?.updateValueAndValidity();
    });

    group.get('gIOvertimeAmount')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('gIOvertimeFrequency')?.setValidators(Validators.required);
      } else {
        group.get('gIOvertimeFrequency')?.setValidators(null);
      }

      group.get('gIOvertimeFrequency')?.updateValueAndValidity();
    });

    group.get('gIBonusAmount')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('gIBonusFrequency')?.setValidators(Validators.required);
      } else {
        group.get('gIBonusFrequency')?.setValidators(null);
      }
      group.get('gIBonusFrequency')?.updateValueAndValidity();
    });

    group.get('gICommissionAmount')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('gICommissionFrequency')?.setValidators(Validators.required);
      } else {
        group.get('gICommissionFrequency')?.setValidators(null);
      }
      group.get('gICommissionFrequency')?.updateValueAndValidity();
    });

    group.get('nogIOvertimeAmount')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('nogIOvertimeFrequency')?.setValidators(Validators.required);
      } else {
        group.get('nogIOvertimeFrequency')?.setValidators(null);
      }
      group.get('nogIOvertimeFrequency')?.updateValueAndValidity();
    });

    group.get('nogIBonusAmount')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('nogIBonusFrequency')?.setValidators(Validators.required);
      } else {
        group.get('nogIBonusFrequency')?.setValidators(null);
      }
      group.get('nogIBonusFrequency')?.updateValueAndValidity();
    });

    group.get('nogICommissionAmount')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('nogICommissionFrequency')?.setValidators(Validators.required);
      } else {
        group.get('nogICommissionFrequency')?.setValidators(null);
      }
      group.get('nogICommissionFrequency')?.updateValueAndValidity();
    });

    group.get('locationAllowance')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('locationAllowanceFrequency')?.setValidators(Validators.required);
      } else {
        group.get('locationAllowanceFrequency')?.setValidators(null);
      }
      group.get('locationAllowanceFrequency')?.updateValueAndValidity();
    });

    group.get('travelAllowance')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('travelAllowanceFrequency')?.setValidators(Validators.required);
      } else {
        group.get('travelAllowanceFrequency')?.setValidators(null);
      }
      group.get('travelAllowanceFrequency')?.updateValueAndValidity();
    });

    group.get('shiftAllowance')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('shiftAllowanceFrequency')?.setValidators(Validators.required);
      } else {
        group.get('shiftAllowanceFrequency')?.setValidators(null);
      }
      group.get('shiftAllowanceFrequency')?.updateValueAndValidity();
    });

    group.get('otherAllowance')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('otherAllowanceFrequency')?.setValidators(Validators.required);
      } else {
        group.get('otherAllowanceFrequency')?.setValidators(null);
      }
      group.get('otherAllowanceFrequency')?.updateValueAndValidity();
    });

    group.get('basicSalary')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('salaryFrequency')?.setValidators(Validators.required);
      } else {
        group.get('salaryFrequency')?.setValidators(null);
      }
      group.get('salaryFrequency')?.updateValueAndValidity();
    });

    group.get('dailyRate')?.valueChanges.subscribe(value => {
      if (value) {
        group.get('dailyRateNumberOfDays')?.setValidators(Validators.required);
      } else {
        group.get('dailyRateNumberOfDays')?.setValidators(null);
      }
      group.get('dailyRateNumberOfDays')?.updateValueAndValidity();
    });

    group.get('contractType')?.valueChanges.subscribe(value => {
      if (value === EmploymentContractType.INDEFINITELY || value === EmploymentContractType.TEMPORARY) {
        group.get('last3MonthsIncome')?.setValidators(null);
        group.get('last6MonthsIncome')?.setValidators(null);
        group.get('last12MonthsIncome')?.setValidators(null);
        group.get('hourlyRate')?.setValidators(null);
        group.get('hoursPerWeek')?.setValidators(null);
        value === EmploymentContractType.TEMPORARY
          ? group.get('contractEndDate')?.setValidators(Validators.required)
          : group.get('contractEndDate')?.setValidators(null);
      }

      group.get('last3MonthsIncome')?.updateValueAndValidity();
      group.get('last6MonthsIncome')?.updateValueAndValidity();
      group.get('last12MonthsIncome')?.updateValueAndValidity();
      group.get('hourlyRate')?.updateValueAndValidity();
      group.get('hoursPerWeek')?.updateValueAndValidity();
      group.get('contractEndDate')?.updateValueAndValidity();
    });

    group.get('incomeType')?.valueChanges.subscribe(value => {
      if (value === IncomeType.OTHER_INCOME) {
        group.get('currentEmploymentStatus')?.setValidators(null);
        group.get('grossIncome')?.setValidators(Validators.required);
        group.get('incomeSource')?.setValidators(Validators.required);
      } else {
        group.get('currentEmploymentStatus')?.setValidators(Validators.required);
        group.get('grossIncome')?.setValidators(null);
        group.get('incomeSource')?.setValidators(null);
      }

      group.get('currentEmploymentStatus')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
      group.get('grossIncome')?.updateValueAndValidity();
      group.get('incomeSource')?.updateValueAndValidity();
    });
  }

  private currentIncomeForm(data?: IncomeDetail, dataOtherIncome?: OtherIncome): FormGroup {
    let contractingTotalInMonthsObj = { months: 0, years: 0 };
    if (data?.contractingTotalInMonths) {
      contractingTotalInMonthsObj = this.calculateMonthAndYearFromContractinPeriodInTotal(data?.contractingTotalInMonths);
    }
    return this.fb.group(
      {
        currentEmploymentStatus: [data?.currentEmploymentStatus || null, Validators.required],
        contractType: data?.contractType || null,
        contractStartDate: data?.contractStartDate ? new Date(data?.contractStartDate) : null,
        jobTitle: data?.jobTitle || null,
        employerName:
          data?.currentEmploymentStatus === EmploymentStatus.Director25Plus ||
          data?.currentEmploymentStatus === EmploymentStatus.SelfEmployedPartnership ||
          data?.currentEmploymentStatus === EmploymentStatus.SelfEmployed
            ? data?.company?.name
            : data?.employer?.name,
        canIncomeBeVerified: data?.canIncomeBeVerified,
        contractEndDate: data?.contractEndDate ? new Date(data?.contractEndDate) : null,
        isIncomeRecurrentSalaryOrDailyRate: data?.isIncomeRecurrentSalaryOrDailyRate || null,
        basicSalary: data?.basicSalary || null,
        salaryFrequency: data?.basicSalary ? data?.salaryFrequency : null,
        dailyRate: data?.dailyRate || null,
        dailyRateNumberOfDays: data?.daysPerWeek || null,
        gIOvertimeAmount:
          (data?.guaranteedIncome && data?.guaranteedIncome['Overtime'] && data?.guaranteedIncome['Overtime'].amount) || null,
        gIOvertimeFrequency:
          (data?.guaranteedIncome && data?.guaranteedIncome['Overtime'] && data?.guaranteedIncome['Overtime'].frequency) || null,
        gIBonusAmount: (data?.guaranteedIncome && data?.guaranteedIncome['Bonus'] && data?.guaranteedIncome['Bonus'].amount) || null,
        gIBonusFrequency: (data?.guaranteedIncome && data?.guaranteedIncome['Bonus'] && data?.guaranteedIncome['Bonus'].frequency) || null,
        gICommissionAmount:
          (data?.guaranteedIncome && data?.guaranteedIncome['Commission'] && data?.guaranteedIncome['Commission'].amount) || null,
        gICommissionFrequency:
          (data?.guaranteedIncome && data?.guaranteedIncome['Commission'] && data?.guaranteedIncome['Commission'].frequency) || null,
        nogIOvertimeAmount:
          (data?.nonGuaranteedIncome && data?.nonGuaranteedIncome['Overtime'] && data?.nonGuaranteedIncome['Overtime'].amount) || null,
        nogIOvertimeFrequency:
          (data?.nonGuaranteedIncome && data?.nonGuaranteedIncome['Overtime'] && data?.nonGuaranteedIncome['Overtime'].frequency) || null,
        nogIBonusAmount:
          (data?.nonGuaranteedIncome && data?.nonGuaranteedIncome['Bonus'] && data?.nonGuaranteedIncome['Bonus'].amount) || null,
        nogIBonusFrequency:
          (data?.nonGuaranteedIncome && data?.nonGuaranteedIncome['Bonus'] && data?.nonGuaranteedIncome['Bonus'].frequency) || null,
        nogICommissionAmount:
          (data?.nonGuaranteedIncome && data?.nonGuaranteedIncome['Commission'] && data?.nonGuaranteedIncome['Commission'].amount) || null,
        nogICommissionFrequency:
          (data?.nonGuaranteedIncome && data?.nonGuaranteedIncome['Commission'] && data?.nonGuaranteedIncome['Commission'].frequency) ||
          null,
        locationAllowance: (data?.allowances && data?.allowances['Location'] && data?.allowances['Location'].amount) || null,
        locationAllowanceFrequency: (data?.allowances && data?.allowances['Location'] && data?.allowances['Location'].frequency) || null,
        travelAllowance: (data?.allowances && data?.allowances['TravelOrCar'] && data?.allowances['TravelOrCar'].amount) || null,
        travelAllowanceFrequency:
          (data?.allowances && data?.allowances['TravelOrCar'] && data?.allowances['TravelOrCar'].frequency) || null,
        shiftAllowance: (data?.allowances && data?.allowances['Shift'] && data?.allowances['Shift'].amount) || null,
        shiftAllowanceFrequency: (data?.allowances && data?.allowances['Shift'] && data?.allowances['Shift'].frequency) || null,
        otherAllowance: (data?.allowances && data?.allowances['OtherGuaranteed'] && data?.allowances['OtherGuaranteed'].amount) || null,
        otherAllowanceFrequency:
          (data?.allowances && data?.allowances['OtherGuaranteed'] && data?.allowances['OtherGuaranteed'].frequency) || null,
        last3MonthsIncome: data?.last3MonthsIncome || null,
        last6MonthsIncome: data?.last6MonthsIncome || null,
        last12MonthsIncome: data?.last12MonthsIncome || null,
        hourlyRate: data?.hourlyRate || null,
        hoursPerWeek: data?.hoursPerWeek || null,
        businessStartDate: data?.businessStartDate ? new Date(data?.businessStartDate) : null,
        shareOfBusinessOwned: data?.shareOfBusinessOwned || null,
        companyType: data?.company?.companyType || null,
        partnershipType: data?.partnershipType,
        companyNumber: data?.company?.number || null,
        annualDrawingsCurYear: (data?.financialIncomes?.length && data.financialIncomes[0].annualDrawings) || null,
        projectedNetProfitCurYear: (data?.financialIncomes?.length && data.financialIncomes[0].projectedNetProfit) || null,
        projectedGrossProfitCurYear: (data?.financialIncomes?.length && data.financialIncomes[0].projectedGrossProfit) || null,
        yearEndingCurYearMonth: this.CONFIGURATION.REQUEST_ENDING_DATE
          ? (data?.financialIncomes?.length && data.financialIncomes[0].yearEnding?.month) || Months.JANUARY
          : null,
        yearEndingCurYearYear: this.CONFIGURATION.REQUEST_ENDING_DATE
          ? (data?.financialIncomes?.length && data.financialIncomes[0].yearEnding?.year) || new Date().getFullYear()
          : null,
        projectedDividendCurYear: (data?.financialIncomes?.length && data.financialIncomes[0].projectedDividend) || null,
        annualDrawings1Year: (data?.financialIncomes?.length && data.financialIncomes[1]?.annualDrawings) || null,
        projectedDividend1Year: (data?.financialIncomes?.length && data.financialIncomes[1]?.projectedDividend) || null,
        projectedNetProfit1Year: (data?.financialIncomes?.length && data.financialIncomes[1]?.projectedNetProfit) || null,
        projectedGrossProfit1Year: (data?.financialIncomes?.length && data.financialIncomes[1]?.projectedGrossProfit) || null,
        annualDrawings2Year: (data?.financialIncomes?.length && data.financialIncomes[2]?.annualDrawings) || null,
        projectedNetProfit2Year: (data?.financialIncomes?.length && data.financialIncomes[2]?.projectedNetProfit) || null,
        projectedGrossProfit2Year: (data?.financialIncomes?.length && data.financialIncomes[2]?.projectedGrossProfit) || null,
        projectedDividend2Year: (data?.financialIncomes?.length && data.financialIncomes[2]?.projectedDividend) || null,

        //FMA Fields
        natureOfTheBusiness: data?.natureOfTheBusiness,
        isInProbatoryPeriod: data?.isInProbatoryPeriod,
        probatoryPeriod: data?.probatoryPeriod,
        probatoryPeriodEndDate: data?.probatoryPeriodEndDate ? new Date(data?.probatoryPeriodEndDate) : null,
        isPermanentAtEndOfProbatoryPeriod: data?.isPermanentAtEndOfProbatoryPeriod,
        addressType: data?.employer?.address?.addressType,
        //contractTerm: data?.contractTerm || null, //TODO out of scope for April
        isContractLikelyToBeRenewed: data?.isContractLikelyToBeRenewed,
        hasGapsBetweenContractsInLast12Months: data?.hasGapsBetweenContractsInLast12Months,
        reasonForGapsBetweenContracts: data?.reasonForGapsBetweenContracts,
        isApplicantProfessionalProvidingServices: data?.isApplicantProfessionalProvidingServices,
        contractingTotalInMonths: contractingTotalInMonthsObj.months || null,
        contractingTotalInYear: contractingTotalInMonthsObj.years || null,
        accountantCompanyName: data?.accountant?.company?.name,
        accountantAddress: data?.accountant?.company?.address?.addressLine1,
        accountantTelNo: data?.accountant?.telephone,
        accountantEmail: data?.accountant?.email,
        //accountantFirstName: data?.accountant?.firstName, //TODO add this field when ADS is ready
        accountantLastName: data?.accountant?.lastName,
        accountantQualification: data?.accountant?.qualification,
        incomeType: null,
        //other income obj
        incomeSource: dataOtherIncome?.otherIncomeSource,
        descriptionNote: dataOtherIncome?.description,
        grossIncome: dataOtherIncome?.amountNet,
        salaryFrequencyOtherIncome: dataOtherIncome?.frequency,
      },
      {
        validators: [
          GroupValidators.currentIncomeValidationGroupTwo('currentEmploymentStatus'),
          GroupValidators.currentIncomeValidationGroupThree('currentEmploymentStatus'),
        ],
      },
    );
  }

  private calculateMonthAndYearFromContractinPeriodInTotal(months: number): { months: number; years: number } {
    return { months: months % 12, years: Math.floor(months / 12) };
  }
}
