import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';

import {
  DataService,
  FeIncomeDetail,
  GenericStepForm,
  loadCurrentIncomeSuccess,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantIncomeRequest,
  ContactInformationResponse,
  CurrentIncomeRequest,
  CurrentIncomeResponse,
  DIPService,
  EmploymentContractType,
  EmploymentStatus,
  FinancialIncome,
  IncomeDescription,
  IncomeDetail,
  IncomeType,
  Journey,
  MonthYear,
  OtherIncome,
  TemporaryContractType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { CurrentIncomeComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  selector: 'dip-current-income-step',
  templateUrl: './current-income-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentIncomeStepComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.currentIncome.automationId;
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  @ViewChild('currentIncome') currentIncome!: CurrentIncomeComponent;
  applicants = this.route.parent?.snapshot.data.summary.caseData.contactsInformation;
  shouldSaveOnRedux = true;

  //static value
  routePaths: typeof RoutePaths = RoutePaths;

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
    private dipService: DIPService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private store: Store,
    private stepSetupService: StepSetupService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.dataService.setFormStatus(this.currentIncome.applicantsFormArray?.status, this.STEP_NAME);
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.currentIncome.applicantsFormArray)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        }
      });
  }

  hasUnsavedChanges(): boolean {
    return this.currentIncome.applicantsFormArray.dirty;
  }

  canDeactivate(): Observable<boolean> {
    return this.dataService.activeJourney ? super.canDeactivate() : of(!this.dataService.activeJourney);
  }

  saveData(): Observable<CurrentIncomeResponse> {
    const dto = this.mapToDTO();

    return this.dipService.dIPPutCurrentIncome(this.appId, dto).pipe(
      concatMap(() => {
        this.currentIncome.applicantsFormArray.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          {
            [this.STEP_NAME]: this.currentIncome?.applicantsFormArray?.status,
            [this.stepSetupService.fmaCurrentIncome.automationId]: this.currentIncome?.applicantsFormArray?.status,
          },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<CurrentIncomeResponse> {
    return this.dipService.dIPGetCurrentIncome(this.appId);
  }

  mapToDTO(): CurrentIncomeRequest {
    const applicantIncomes: ApplicantIncomeRequest[] = [];
    const values = this.currentIncome.applicantsFormArray.getRawValue();

    values.forEach(applicant => {
      const incomeDetails: IncomeDetail[] = [];
      const otherIncomes: OtherIncome[] = [];
      applicant.currentIncome.forEach((currentIncomeDetails: FeIncomeDetail, index: number) => {
        if (index === 0) {
          const incomeDetailObj: IncomeDetail | null = this.createIncomeDetailObj(currentIncomeDetails);
          incomeDetailObj && incomeDetails.push(incomeDetailObj);
        } else {
          if (currentIncomeDetails.incomeType === IncomeType.EMPLOYMENT) {
            const incomeDetailObj: IncomeDetail | null = this.createIncomeDetailObj(currentIncomeDetails);
            incomeDetailObj && incomeDetails.push(incomeDetailObj);
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

  onChanges(): void {
    this.currentIncome?.applicantsFormArray?.valueChanges.pipe(debounceTime(50), takeUntil(this.debounceSub$)).subscribe(() => {
      const dto = this.mapToDTO();
      this.store.dispatch(
        loadCurrentIncomeSuccess({
          entity: {
            ...dto,
            applicantIncomes: this.applicants.map((applicant: ContactInformationResponse, index: number) => {
              return {
                applicantInfo: {
                  applicantId: dto.applicantIncomes && dto.applicantIncomes[index]?.applicantId,
                  firstName: applicant.firstName,
                  familyName: applicant.familyName,
                },
                incomeDetails: dto.applicantIncomes && dto.applicantIncomes[index].incomeDetails,
                otherIncomes: dto.applicantIncomes && dto.applicantIncomes[index].otherIncomes,
              };
            }),
          },
        }),
      );
      this.dataService.setFormStatus(this.currentIncome.applicantsFormArray?.status, this.STEP_NAME);
    });

    this.currentIncome.applicantsFormArray.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentIncome.currentData.versionNumber = response.versionNumber;
          this.store.dispatch(loadCurrentIncomeSuccess({ entity: response }));
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

  private createIncomeDetailObj(data: FeIncomeDetail): IncomeDetail | null {
    let incomeDetailsObj: IncomeDetail | null = null;
    const financialIncome: FinancialIncome[] = [];
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
          employer: {
            name: data.employerName,
          },
          canIncomeBeVerified: data.canIncomeBeVerified,
          contractEndDate: data.contractType === EmploymentContractType.TEMPORARY ? data.contractEndDate : null,
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
          contractTerm: data.contractType === EmploymentContractType.TEMPORARY ? TemporaryContractType.FIXED_TERM : null,
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
          canIncomeBeVerified: data.canIncomeBeVerified,
          company: {
            name: data.employerName,
            companyType: data.currentEmploymentStatus === EmploymentStatus.Director25Plus ? data.companyType : null,
          },
          partnershipType: data.currentEmploymentStatus === EmploymentStatus.SelfEmployedPartnership ? data.partnershipType : null,
          financialIncomes: financialIncome,
          contractTerm:
            data.currentEmploymentStatus === EmploymentStatus.Director25Plus && data.contractType === EmploymentContractType.TEMPORARY
              ? TemporaryContractType.FIXED_TERM
              : null,
        };
        break;
      case EmploymentStatus.HomeMaker:
      case EmploymentStatus.NotEmployed:
      case EmploymentStatus.Retired:
      case EmploymentStatus.Student:
        incomeDetailsObj = {
          currentEmploymentStatus: data.currentEmploymentStatus,
        };
        break;
      default:
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
    yearEnding?: MonthYear,
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

  private isYearEndingObjNull(yearEnding: MonthYear): boolean {
    return Object.values(yearEnding).every(value => {
      return value === null;
    });
  }
}
