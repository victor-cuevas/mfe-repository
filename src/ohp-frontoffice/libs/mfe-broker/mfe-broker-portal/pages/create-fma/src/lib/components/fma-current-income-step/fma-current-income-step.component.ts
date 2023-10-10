import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';

import {
  AddressFeService,
  AddressSearchForm,
  DataService,
  FeIncomeDetail,
  GenericStepForm,
  GroupValidators,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  Accountant,
  AddressType2,
  ApplicantIncomeRequest,
  Contact,
  CurrentIncomeRequest,
  CurrentIncomeResponse,
  EmploymentContractType,
  EmploymentStatus,
  FinancialIncome,
  FMAService,
  IncomeDescription,
  IncomeDetail,
  IncomeType,
  Journey,
  MonthYear,
  OtherIncome,
  TemporaryContractType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CurrentIncomeComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { concatMap, debounceTime, takeUntil } from 'rxjs/operators';
import { FormArray, Validators } from '@angular/forms';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  templateUrl: './fma-current-income-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmaCurrentIncomeStepComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.fmaCurrentIncome.automationId;
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  @ViewChild('currentIncome') currentIncome!: CurrentIncomeComponent;

  //static value
  routePaths: typeof RoutePaths = RoutePaths;

  constructor(
    private dataService: DataService,
    private stepSetupService: StepSetupService,
    private fmaService: FMAService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private addressFeService: AddressFeService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  canDeactivate() {
    return this.dataService.activeJourney ? super.canDeactivate() : of(!this.dataService.activeJourney);
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.currentIncome.applicantsFormArray)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setFormStatus(this.currentIncome.applicantsFormArray?.status, this.STEP_NAME);
          this.onChanges();
          this.cd.detectChanges();
        }
      });
  }

  getData(): Observable<CurrentIncomeResponse> {
    return this.fmaService.fMAGetCurrentIncome(this.appId);
  }

  hasUnsavedChanges(): boolean {
    return this.currentIncome.applicantsFormArray.dirty;
  }

  mapToDTO(): CurrentIncomeRequest {
    const applicantIncomes: ApplicantIncomeRequest[] = [];
    const values = this.currentIncome.applicantsFormArray.getRawValue();

    values.forEach(applicant => {
      const incomeDetails: IncomeDetail[] = [];
      const otherIncomes: OtherIncome[] = [];
      applicant.currentIncome.forEach((currentIncomeDetails: FeIncomeDetail, index: number) => {
        if (index === 0) {
          const incomeDetailObj: IncomeDetail = this.createIncomeDetailObj(currentIncomeDetails);
          incomeDetails.push(incomeDetailObj);
        } else {
          if (currentIncomeDetails.incomeType === IncomeType.EMPLOYMENT) {
            const incomeDetailObj: IncomeDetail = this.createIncomeDetailObj(currentIncomeDetails);
            incomeDetails.push(incomeDetailObj);
          }
          if (currentIncomeDetails.incomeType === IncomeType.OTHER_INCOME) {
            const otherIncomesObj: OtherIncome = this.createOtherIncomeObj(currentIncomeDetails);
            otherIncomes.push(otherIncomesObj);
          }
        }
      });
      applicantIncomes.push({
        applicantId: applicant.applicantId,
        incomeDetails,
        otherIncomes,
      });
    });
    return {
      versionNumber: this.currentIncome.currentData.versionNumber as number,
      applicantIncomes,
    };
  }

  saveData(): Observable<CurrentIncomeResponse> {
    return this.fmaService.fMAPutCurrentIncome(this.appId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      concatMap(() => {
        this.currentIncome.applicantsFormArray.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Fma,
          this.appId,
          this.loanId,
          {
            ...this.stepSetupService.validateFmaChecks(),
            [this.STEP_NAME]: this.currentIncome.applicantsFormArray.status,
          },
          this.getData(),
        );
      }),
    );
  }

  private onChanges() {
    this.currentIncome.applicantsFormArray?.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.currentIncome.applicantsFormArray?.status, this.STEP_NAME);
      if (this.stepSetupService.stepIsValid(this.stepSetupService.affordabilityCheck) && !this.currentIncome.applicantsFormArray.pristine) {
        this.stepSetupService.invalidateStep(this.stepSetupService.affordabilityCheck.automationId);
      }
    });

    this.currentIncome.applicantsFormArray?.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentIncome.currentData.versionNumber = response.versionNumber;
        });
      });

    this.currentIncome.applicantsFormArray.controls.forEach(formGroup => {
      (formGroup.get('currentIncome') as FormArray).controls.forEach(controls => {
        //Validation for contractType
        controls.get('contractType')?.valueChanges.subscribe(value => {
          const isLessThanAYear = this.calculateLessThenOneYear(controls.get('contractStartDate')?.value);
          if (value === EmploymentContractType.INDEFINITELY && isLessThanAYear) {
            controls.get('isInProbatoryPeriod')?.setValidators(Validators.required);
            controls.get('hasGapsBetweenContractsInLast12Months')?.setValidators(null);
            controls.get('isContractLikelyToBeRenewed')?.setValidators(null);
          } else if (value === EmploymentContractType.TEMPORARY) {
            controls.get('isContractLikelyToBeRenewed')?.setValidators(Validators.required);
            controls.get('hasGapsBetweenContractsInLast12Months')?.setValidators(Validators.required);
            controls.get('isInProbatoryPeriod')?.setValidators(null);
          } else {
            controls.get('hasGapsBetweenContractsInLast12Months')?.setValidators(null);
            controls.get('isInProbatoryPeriod')?.setValidators(null);
            controls.get('isContractLikelyToBeRenewed')?.setValidators(null);
          }
          controls.get('isContractLikelyToBeRenewed')?.updateValueAndValidity();
          controls.get('isInProbatoryPeriod')?.updateValueAndValidity();
          controls.get('hasGapsBetweenContractsInLast12Months')?.updateValueAndValidity();
        });

        //Validation for contractStartDate
        controls.get('contractStartDate')?.valueChanges.subscribe(value => {
          const isLessThanAYear = this.calculateLessThenOneYear(value);

          if (isLessThanAYear && controls.get('contractType')?.value === EmploymentContractType.INDEFINITELY) {
            controls.get('isInProbatoryPeriod')?.setValidators(Validators.required);
          } else {
            controls.get('isInProbatoryPeriod')?.setValidators(null);
          }
          controls.get('isInProbatoryPeriod')?.updateValueAndValidity();
        });

        //Validation for isInProbatoryPeriod
        controls.get('isInProbatoryPeriod')?.valueChanges.subscribe(value => {
          const isLessThanAYear = this.calculateLessThenOneYear(controls.get('contractStartDate')?.value);
          if (value && isLessThanAYear) {
            controls.get('probatoryPeriod')?.setValidators(Validators.required);
            controls.get('isPermanentAtEndOfProbatoryPeriod')?.setValidators(Validators.required);
          } else {
            controls.get('probatoryPeriod')?.setValidators(null);
            controls.get('isPermanentAtEndOfProbatoryPeriod')?.setValidators(null);
          }

          controls.get('probatoryPeriod')?.updateValueAndValidity();
          controls.get('isPermanentAtEndOfProbatoryPeriod')?.updateValueAndValidity();
        });

        //Validaition for hasGapsBetweenContractsInLast12Months
        controls.get('hasGapsBetweenContractsInLast12Months')?.valueChanges.subscribe(value => {
          if (value) {
            controls.get('reasonForGapsBetweenContracts')?.setValidators(Validators.required);
          } else {
            controls.get('reasonForGapsBetweenContracts')?.setValidators(null);
          }
          controls.get('reasonForGapsBetweenContracts')?.updateValueAndValidity();
        });

        //Validation for contractTerm
        //TODO out of scope for April
        /*        controls.get('contractTerm')?.valueChanges.subscribe(value => {
          if (value === TemporaryContractType.FIXED_TERM) {
            controls.get('probatoryPeriodEndDate')?.setValidators(Validators.required);
            controls.get('isContractLikelyToBeRenewed')?.setValidators(Validators.required);
          } else {
            controls.get('probatoryPeriodEndDate')?.setValidators(null);
            controls.get('isContractLikelyToBeRenewed')?.setValidators(null);
          }

          controls.get('probatoryPeriodEndDate')?.updateValueAndValidity();
          controls.get('isContractLikelyToBeRenewed')?.updateValueAndValidity();
        });*/

        //Validation for selfEmployed
        controls.get('currentEmploymentStatus')?.valueChanges.subscribe(value => {
          controls.get('isApplicantProfessionalProvidingServices')?.setValidators(null);
          controls.get('companyNumber')?.setValidators(null);
          controls.get('accountantAddress')?.setValidators(null);
          controls.get('accountantTelNo')?.setValidators(null);
          controls.get('accountantEmail')?.setValidators(null);
          controls.get('accountantLastName')?.setValidators(null);
          controls.get('accountantQualification')?.setValidators(null);
          controls.get('businessStartDate')?.setValidators(null);
          controls.get('addressType')?.setValidators(null);
          if (value === EmploymentStatus.SelfEmployedPartnership || value === EmploymentStatus.SelfEmployed) {
            value === EmploymentStatus.SelfEmployedPartnership
              ? controls.get('shareOfBusinessOwned')?.setValidators(Validators.required)
              : controls.get('shareOfBusinessOwned')?.setValidators(null);
            controls.get('businessStartDate')?.setValidators(Validators.required);
            controls.get('accountantCompanyName')?.setValidators(Validators.required);
            controls.get('accountantAddress')?.setValidators(Validators.required);
            controls.get('accountantTelNo')?.setValidators(Validators.compose([Validators.required]));
            controls.get('accountantEmail')?.setValidators([Validators.email]);
            controls.get('accountantFirstName')?.setValidators(Validators.required);
            controls.get('accountantLastName')?.setValidators(Validators.required);
            controls.get('accountantQualification')?.setValidators(Validators.required);
          } else if (value === EmploymentStatus.Director25Plus) {
            controls.get('shareOfBusinessOwned')?.setValidators(Validators.required);
            controls.get('businessStartDate')?.setValidators(Validators.required);
            controls.get('isApplicantProfessionalProvidingServices')?.setValidators(Validators.required);
            controls.get('companyNumber')?.setValidators(Validators.required);
            controls.get('accountantCompanyName')?.setValidators(Validators.required);
            controls.get('accountantAddress')?.setValidators(Validators.required);
            controls.get('accountantTelNo')?.setValidators(Validators.compose([Validators.required]));
            controls.get('accountantEmail')?.setValidators([Validators.email]);
            controls.get('accountantFirstName')?.setValidators(Validators.required);
            controls.get('accountantLastName')?.setValidators(Validators.required);
            controls.get('accountantQualification')?.setValidators(Validators.required);
            controls.get('businessStartDate')?.setValidators(Validators.required);
          } else if (value === EmploymentStatus.DirectorLess25) {
            controls.get('shareOfBusinessOwned')?.setValidators(Validators.required);
            controls.get('businessStartDate')?.setValidators(Validators.required);
          } else if (value === EmploymentStatus.Employed) {
            controls.get('addressType')?.setValidators(Validators.required);
          }
          controls.get('addressType')?.updateValueAndValidity();
          controls.get('shareOfBusinessOwned')?.updateValueAndValidity();
          controls.get('businessStartDate')?.updateValueAndValidity();
          controls.get('isApplicantProfessionalProvidingServices')?.updateValueAndValidity();
          controls.get('companyNumber')?.updateValueAndValidity();
          controls.get('accountantAddress')?.updateValueAndValidity();
          controls.get('accountantTelNo')?.updateValueAndValidity();
          controls.get('accountantEmail')?.updateValueAndValidity();
          controls.get('accountantLastName')?.updateValueAndValidity();
          controls.get('accountantQualification')?.updateValueAndValidity();
          controls.get('accountantCompanyName')?.updateValueAndValidity();
        });

        //Validation for isApplicantProfessionalProvidingServices
        controls.get('isApplicantProfessionalProvidingServices')?.valueChanges.subscribe(value => {
          if (value) {
            controls.get('contractingTotalInMonths')?.setValidators(Validators.required);
            controls.get('contractingTotalInYear')?.setValidators(Validators.required);
            controls.get('isContractLikelyToBeRenewed')?.setValidators(Validators.required);
            controls.addValidators(GroupValidators.timeInterval('contractingTotalInYear', 'contractingTotalInMonths', 0, 60));
          } else {
            controls.get('contractingTotalInMonths')?.setValidators(null);
            controls.get('contractingTotalInYear')?.setValidators(null);
            controls.get('isContractLikelyToBeRenewed')?.setValidators(null);
          }
          controls.get('contractingTotalInMonths')?.updateValueAndValidity();
          controls.get('contractingTotalInYear')?.updateValueAndValidity();
          controls.get('isContractLikelyToBeRenewed')?.updateValueAndValidity();
        });
      });
    });
  }

  private createOtherIncomeObj(data: FeIncomeDetail): OtherIncome {
    return {
      amountNet: data.grossIncome,
      description: data.incomeSource === 'OTHER' ? data.descriptionNote : null,
      frequency: data.salaryFrequencyOtherIncome,
      otherIncomeSource: data.incomeSource,
    };
  }

  private handleError() {
    this.saveData().subscribe(response => {
      this.currentIncome.currentData.versionNumber = response?.versionNumber as number;
    });
  }

  private createIncomeDetailObj(data: FeIncomeDetail): IncomeDetail {
    let incomeDetailsObj: IncomeDetail = {};
    const financialIncome: FinancialIncome[] = [];

    const address = this.addressFeService.mapAddressFEtoBFFAddress(data?.address as AddressSearchForm, data?.addressType as AddressType2);

    if (
      data.currentEmploymentStatus === EmploymentStatus.SelfEmployedPartnership ||
      data.currentEmploymentStatus === EmploymentStatus.SelfEmployed ||
      data.currentEmploymentStatus === EmploymentStatus.Director25Plus
    ) {
      const financialIncomeCurYear = this.createFinancialIncomeObj(
        data.currentEmploymentStatus,
        data.annualDrawingsCurYear,
        data.projectedDividendCurYear,
        data.projectedGrossProfitCurYear,
        data.projectedNetProfitCurYear,
        new Date().getFullYear(),
        { month: data?.yearEndingCurYearMonth, year: data?.yearEndingCurYearYear },
      );
      const financialIncome1Year = this.createFinancialIncomeObj(
        data.currentEmploymentStatus,
        data.annualDrawings1Year,
        data.projectedDividend1Year,
        data.projectedGrossProfit1Year,
        data.projectedNetProfit1Year,
        1,
      );
      const financialIncome2Year = this.createFinancialIncomeObj(
        data.currentEmploymentStatus,
        data.annualDrawings2Year,
        data.projectedDividend2Year,
        data.projectedGrossProfit2Year,
        data.projectedNetProfit2Year,
        2,
      );
      financialIncome.push(financialIncomeCurYear, financialIncome1Year, financialIncome2Year);
    }

    switch (data.currentEmploymentStatus) {
      case EmploymentStatus.Employed:
      case EmploymentStatus.DirectorLess25:
        incomeDetailsObj = {
          currentEmploymentStatus: data.currentEmploymentStatus,
          contractType: data.contractType,
          contractStartDate: data.contractStartDate,
          jobTitle: data.jobTitle,
          employer:
            data.currentEmploymentStatus === EmploymentStatus.Employed
              ? ({
                  name: data.employerName,
                  address: {
                    ...address,
                    addressType: data.addressType,
                  },
                } as Contact)
              : null,
          canIncomeBeVerified: data.canIncomeBeVerified,
          contractEndDate: data.contractType === EmploymentContractType.TEMPORARY ? data.contractEndDate : null,
          natureOfTheBusiness: data.natureOfTheBusiness,
          businessStartDate: data.currentEmploymentStatus === EmploymentStatus.DirectorLess25 ? data.businessStartDate : null,
          shareOfBusinessOwned: data.currentEmploymentStatus === EmploymentStatus.DirectorLess25 ? data.shareOfBusinessOwned : null,
          company:
            data.currentEmploymentStatus === EmploymentStatus.DirectorLess25
              ? {
                  name: data.employerName,
                }
              : null,
          isInProbatoryPeriod:
            data.contractType === EmploymentContractType.INDEFINITELY && this.calculateLessThenOneYear(data.contractStartDate as string)
              ? data.isInProbatoryPeriod
              : null,
          probatoryPeriod:
            data.contractType === EmploymentContractType.INDEFINITELY && data.isInProbatoryPeriod ? data.probatoryPeriod : null,
          probatoryPeriodEndDate:
            (data.contractType === EmploymentContractType.INDEFINITELY && data.isInProbatoryPeriod) ||
            (data.contractType === EmploymentContractType.INDEFINITELY && data.contractTerm === TemporaryContractType.FIXED_TERM)
              ? data.probatoryPeriodEndDate
              : null,
          isPermanentAtEndOfProbatoryPeriod:
            data.contractType === EmploymentContractType.INDEFINITELY && data.isInProbatoryPeriod
              ? data.isPermanentAtEndOfProbatoryPeriod
              : null,
          contractTerm: data.contractType === EmploymentContractType.TEMPORARY ? TemporaryContractType.FIXED_TERM : null,
          isContractLikelyToBeRenewed: data.contractType === EmploymentContractType.TEMPORARY ? data.isContractLikelyToBeRenewed : null,
          hasGapsBetweenContractsInLast12Months:
            data.contractType === EmploymentContractType.TEMPORARY ? data.hasGapsBetweenContractsInLast12Months : null,
          reasonForGapsBetweenContracts:
            data.contractType === EmploymentContractType.TEMPORARY && data.hasGapsBetweenContractsInLast12Months
              ? data.reasonForGapsBetweenContracts
              : null,
          isIncomeRecurrentSalaryOrDailyRate:
            data.currentEmploymentStatus === EmploymentStatus.Employed || data.currentEmploymentStatus === EmploymentStatus.DirectorLess25
              ? data.isIncomeRecurrentSalaryOrDailyRate
              : null,
          basicSalary: data.isIncomeRecurrentSalaryOrDailyRate === IncomeDescription.SALARY ? data.basicSalary : null,
          salaryFrequency:
            data.isIncomeRecurrentSalaryOrDailyRate === IncomeDescription.SALARY && data.basicSalary ? data.salaryFrequency : null,
          dailyRate: data.isIncomeRecurrentSalaryOrDailyRate === IncomeDescription.DAILY_RATE ? data.dailyRate : null,
          daysPerWeek:
            data.isIncomeRecurrentSalaryOrDailyRate === IncomeDescription.DAILY_RATE && data.dailyRate ? data.dailyRateNumberOfDays : null,
          last3MonthsIncome: data.contractType === EmploymentContractType.ZERO_HOUR_CONTRACT ? data.last3MonthsIncome : null,
          last6MonthsIncome: data.contractType === EmploymentContractType.ZERO_HOUR_CONTRACT ? data.last6MonthsIncome : null,
          last12MonthsIncome: data.contractType === EmploymentContractType.ZERO_HOUR_CONTRACT ? data.last12MonthsIncome : null,
          hourlyRate: data.contractType === EmploymentContractType.ZERO_HOUR_CONTRACT ? data.hourlyRate : null,
          hoursPerWeek: data.contractType === EmploymentContractType.ZERO_HOUR_CONTRACT ? data.hoursPerWeek : null,
          guaranteedIncome: {
            Overtime: {
              amount: data.gIOvertimeAmount,
              frequency: data.gIOvertimeAmount ? data.gIOvertimeFrequency : null,
            },
            Bonus: {
              amount: data.gIBonusAmount,
              frequency: data.gIBonusAmount ? data.gIBonusFrequency : null,
            },
            Commission: {
              amount: data.gICommissionAmount,
              frequency: data.gICommissionAmount ? data.gICommissionFrequency : null,
            },
          },
          nonGuaranteedIncome: {
            Overtime: {
              amount: data.nogIOvertimeAmount,
              frequency: data.nogIOvertimeAmount ? data.nogIOvertimeFrequency : null,
            },
            Bonus: {
              amount: data.nogIBonusAmount,
              frequency: data.nogIBonusAmount ? data.nogIBonusFrequency : null,
            },
            Commission: {
              amount: data.nogICommissionAmount,
              frequency: data.nogICommissionAmount ? data.nogICommissionFrequency : null,
            },
          },
          allowances: {
            Location: {
              amount: data.locationAllowance,
              frequency: data.locationAllowance ? data.locationAllowanceFrequency : null,
            },
            TravelOrCar: {
              amount: data.travelAllowance,
              frequency: data.travelAllowance ? data.travelAllowanceFrequency : null,
            },
            Shift: {
              amount: data.shiftAllowance,
              frequency: data.shiftAllowance ? data.shiftAllowanceFrequency : null,
            },
            OtherGuaranteed: {
              amount: data.otherAllowance,
              frequency: data.otherAllowance ? data.otherAllowanceFrequency : null,
            },
          },
        };
        break;
      case EmploymentStatus.SelfEmployedPartnership:
      case EmploymentStatus.SelfEmployed:
      case EmploymentStatus.Director25Plus:
        incomeDetailsObj = {
          currentEmploymentStatus: data.currentEmploymentStatus,
          contractStartDate: data.contractStartDate,
          jobTitle: data.jobTitle,
          businessStartDate: data.businessStartDate,
          shareOfBusinessOwned:
            data.currentEmploymentStatus === EmploymentStatus.SelfEmployedPartnership ||
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus
              ? data.shareOfBusinessOwned
              : null,
          partnershipType: data.currentEmploymentStatus === EmploymentStatus.SelfEmployedPartnership ? data.partnershipType : null,
          company: {
            companyType: data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.companyType : null,
            name: data.employerName,
            number: data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.companyNumber : null,
          },
          isApplicantProfessionalProvidingServices:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.isApplicantProfessionalProvidingServices : null,
          contractingTotalInMonths:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus
              ? this.calculationMonthsFormContractiPeriodInTotal(
                  data.contractingTotalInMonths as number,
                  data.contractingTotalInYear as number,
                )
              : null,
          isContractLikelyToBeRenewed:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.isContractLikelyToBeRenewed : null,
          contractTerm:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus && data.contractType === EmploymentContractType.TEMPORARY
              ? TemporaryContractType.FIXED_TERM
              : null,
          natureOfTheBusiness: data.natureOfTheBusiness,
          probatoryPeriodEndDate: data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.probatoryPeriodEndDate : null,
          hasGapsBetweenContractsInLast12Months:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.hasGapsBetweenContractsInLast12Months : null,
          reasonForGapsBetweenContracts:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.reasonForGapsBetweenContracts : null,
          canIncomeBeVerified: data.canIncomeBeVerified,
          accountant: {
            company: {
              name: data.accountantCompanyName,
              address: { addressLine1: data.accountantAddress },
            },
            telephone: data.accountantTelNo?.e164Number,
            email: data.accountantEmail,
            //firstName: data.accountantFirstName, // TODO add this field when ADS is ready
            lastName: data.accountantLastName,
            qualification: data.accountantQualification,
          } as Accountant,

          financialIncomes: financialIncome,
        };
        break;
      default:
        incomeDetailsObj = {
          currentEmploymentStatus: data.currentEmploymentStatus,
        };
        break;
    }

    return incomeDetailsObj;
  }

  private createFinancialIncomeObj(
    currentEmploymentStatus: string,
    annualDrawings?: number,
    projectedDividend?: number,
    projectedGrossProfit?: number,
    projectedNetProfit?: number,
    year?: number,
    yearEnding?: MonthYear | null,
  ): FinancialIncome {
    return {
      annualDrawings: annualDrawings,
      projectedDividend: currentEmploymentStatus === EmploymentStatus.Director25Plus ? projectedDividend : null,
      projectedGrossProfit: projectedGrossProfit,
      projectedNetProfit: projectedNetProfit,
      year: year,
      yearEnding:
        !this.CONFIGURATION.REQUEST_ENDING_DATE && yearEnding && this.isYearEndingObjNull(yearEnding as MonthYear)
          ? null
          : { month: yearEnding?.month, year: yearEnding?.year },
    };
  }

  private calculationMonthsFormContractiPeriodInTotal(contractingTotalInMonths: number, contractingTotalInYear: number): number {
    return contractingTotalInMonths + contractingTotalInYear * 12;
  }

  private calculateLessThenOneYear(value: string): boolean {
    const today = new Date().getTime();
    const contractStartDate = new Date(value).getTime();
    return (today - contractStartDate) / (1000 * 3600 * 24 * 365) < 1;
  }

  private isYearEndingObjNull(yearEnding: MonthYear): boolean {
    return Object.values(yearEnding).every(value => {
      return value === null;
    });
  }
}
