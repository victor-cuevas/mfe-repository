import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import {
  CaseSummaryService,
  CheckRetirementService,
  DataService,
  getCurrentIncome,
  getExistingMortgages,
  getPersonalDetails,
  getPropertyLoan,
  loadCurrentIncomeSuccess,
  loadExistingMortgagesSuccess,
  loadPersonalDetailsSuccess,
  loadProductSelectionSuccess,
  loadPropertyLoanSuccess,
  MortgageTermService,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantPersonalDetails,
  CaseStage,
  CaseStatusResponse,
  CreateDIPResponse,
  DIPService,
  Journey,
  LoanStateResponse,
  LoanStatus,
  PersonalDetailsResponse,
  ProductSelectionResponse,
  PropertyAndLoanDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { concatMap, distinctUntilKeyChanged, map, skip, take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Injectable({
  providedIn: 'root',
})
export class DipJourneyResolver {
  readonly CONFIGURATION = CONFIGURATION_MOCK;
  public onDestroy$ = new Subject<boolean>();

  constructor(
    private stepSetupService: StepSetupService,
    private router: Router,
    private dipService: DIPService,
    private store: Store,
    private mortgageTermService: MortgageTermService,
    private checkRetirementService: CheckRetirementService,
    private dataService: DataService,
    private caseSummaryService: CaseSummaryService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ dipData: CreateDIPResponse }> | void {
    this.stepSetupService.getJourneyByCaseTypes(route.parent?.data);
    const routeSplit = state.url.split('/');

    // set DIP journey by appropriate case type
    this.stepSetupService.getJourneyByCaseTypes(route.parent?.data);
    // run checks
    this.checkPropertyLoanData();
    this.setMaxMortgageTerm();
    this.checkRetirementIncome();
    this.checkPreviousEmployment();
    this.checkAdditionalBorrowing();
    this.checkRemortgageDeposit();
    if (this.stepSetupService.isStepAuthorized(routeSplit[routeSplit.length - 1])) {
      if (route.parent?.data.summary.caseData.statusHistory?.some((el: CaseStatusResponse) => el.stage === CaseStage.Dip)) {
        return this.reopenDIP(
          this.caseSummaryService.dipSummary?.loan?.status as LoanStatus,
          route.parent?.data.summary.applicationDraftId,
          route.parent?.data.summary.loanId,
        ).pipe(
          concatMap((response: LoanStateResponse) => {
            if (response.status) this.caseSummaryService.loanStatus = response.status;
            this.caseSummaryService.checkProductsAvailability(
              route.parent?.data.summary.applicationDraftId,
              route.parent?.data.summary.loanId,
            );
            return this.getAdditionalData({
              applicationDraftId: route.parent?.data.summary.applicationDraftId,
              loanId: route.parent?.data.summary.loanId,
            });
          }),
        );
      } else {
        return this.dipService.dIPCreateDIP({ caseId: route.parent?.data.summary.caseData.caseId }).pipe(
          concatMap((response: CreateDIPResponse) => {
            this.caseSummaryService.createDip(response);
            return this.getAdditionalData(response);
          }),
        );
      }
    } else {
      this.router.navigate(['broker/not-found'], { skipLocationChange: true });
      return;
    }
  }

  private reopenDIP(loanStatus: LoanStatus, applicationDraftId: number, loanId: number) {
    return loanStatus === LoanStatus.Rejected ? this.dipService.dIPRegressDIP(applicationDraftId, loanId) : of({} as LoanStateResponse);
  }

  private getAdditionalData(response: CreateDIPResponse) {
    return forkJoin([
      this.dipService.dIPGetPropertyAndLoanDetails(response.applicationDraftId as number, response.loanId as number),
      this.dipService.dIPGetPersonalDetails(response.applicationDraftId as number),
      this.dipService.dIPGetProductSelection(response.applicationDraftId as number, response.loanId as number),
      this.dipService.dIPGetCurrentIncome(response.applicationDraftId as number),
      this.dipService.dIPGetExistingMortgage(response.applicationDraftId as number),
      this.dipService.dIPGetLoanProgress(response.applicationDraftId as number, response.loanId as number),
    ]).pipe(
      map(([propertyLoanData, personalDetailsData, productSelectionData, currentIncomeData, existingMortgageData, validatedSteps]) => {
        this.updateMortgageTerm(productSelectionData);

        this.store.dispatch(loadPropertyLoanSuccess({ entity: propertyLoanData }));
        this.store.dispatch(loadPersonalDetailsSuccess({ entity: personalDetailsData }));
        this.store.dispatch(loadProductSelectionSuccess({ entity: productSelectionData }));
        this.store.dispatch(loadCurrentIncomeSuccess({ entity: currentIncomeData }));
        this.store.dispatch(loadExistingMortgagesSuccess({ entity: existingMortgageData }));
        if (validatedSteps.progress === null) this.dataService.journeyProgress = {};
        this.dataService.journeyProgress = validatedSteps.progress;
        if (this.dataService.journeyProgress) {
          this.stepSetupService
            .validateJourney(this.dataService.journeyProgress)
            .pipe(take(1))
            .subscribe(() => this.stepSetupService.checkConfirmStep(Journey.Dip));
        } else {
          this.stepSetupService.checkConfirmStep(Journey.Dip);
        }

        return {
          dipData: response,
        };
      }),
    );
  }

  private checkPropertyLoanData() {
    this.store
      .select(getPropertyLoan)
      .pipe(takeUntil(this.onDestroy$), skip(1))
      .subscribe((data: PropertyAndLoanDetailsResponse | undefined) => {
        this.checkPropertyLoanStep(data);
        if (data?.hasCustomerFoundProperty || this.stepSetupService.isRemortgage) {
          const propertyAndLoanIndex = this.stepSetupService.currentJourney.findIndex(item => item.automationId === 'propertyAndLoan');
          this.stepSetupService.addStepToJourney(propertyAndLoanIndex + 1, this.stepSetupService.securityProperty);
        } else {
          this.stepSetupService.removeStepFromJourney('securityProperty');
        }
      });
  }

  private checkRetirementIncome() {
    this.checkRetirementService
      .getRetiringApplicants()
      .pipe(takeUntil(this.onDestroy$), skip(1))
      .subscribe(value => {
        if (value?.length) {
          this.stepSetupService.addStepToJourney(this.stepSetupService.currentJourney.length - 2, this.stepSetupService.retirementIncome);
        } else {
          this.stepSetupService.removeStepFromJourney('retirementIncome');
        }
      });
  }

  private setMaxMortgageTerm() {
    this.store
      .select(getPersonalDetails)
      .pipe(
        map((personalDetailsData: PersonalDetailsResponse | undefined): ApplicantPersonalDetails => {
          const oldestPerson = personalDetailsData?.applicantPersonalDetails?.reduce((prev, curr) =>
            curr?.birthDate && prev?.birthDate && curr.birthDate > prev.birthDate ? prev : curr,
          );
          return oldestPerson ? oldestPerson : {};
        }),
        takeUntil(this.onDestroy$),
        distinctUntilKeyChanged('birthDate'),
      )
      .subscribe(oldestApplicant => {
        this.mortgageTermService.setMaxMortgageTerm(oldestApplicant?.birthDate);
      });
  }

  private checkAdditionalBorrowing() {
    combineLatest([this.store.select(getPropertyLoan), this.store.select(getExistingMortgages)])
      .pipe(
        skip(1),
        takeUntil(this.onDestroy$),
        map(([propertyLoan, existingMortgages]) => {
          return {
            propertyLoan: propertyLoan,
            existingMortgages: existingMortgages,
          };
        }),
      )
      .subscribe(response => {
        if (
          (response.propertyLoan?.loanAmount &&
            response.existingMortgages?.amountToBeRepaid &&
            response.propertyLoan?.loanAmount > response.existingMortgages?.amountToBeRepaid) ||
          response.existingMortgages?.isPropertyMortgaged === false
        ) {
          const existingMortgagesIndex = this.stepSetupService.currentJourney.findIndex(
            item => item.automationId === this.stepSetupService.existingMortgages.automationId,
          );
          this.stepSetupService.addStepToJourney(existingMortgagesIndex + 1, this.stepSetupService.additionalBorrowing);
        } else {
          this.stepSetupService.removeStepFromJourney(this.stepSetupService.additionalBorrowing.automationId);
        }
      });
  }

  private checkRemortgageDeposit() {
    if (this.stepSetupService.isRemortgage) {
      combineLatest([this.store.select(getPropertyLoan), this.store.select(getExistingMortgages)])
        .pipe(
          skip(1),
          takeUntil(this.onDestroy$),
          map(([propertyLoan, existingMortgages]) => {
            return {
              propertyLoan: propertyLoan,
              existingMortgages: existingMortgages,
            };
          }),
        )
        .subscribe(response => {
          const existingMortgagesIndex = this.stepSetupService.currentJourney.findIndex(
            item => item.automationId === this.stepSetupService.existingMortgages.automationId,
          );

          const loanAmount = response?.propertyLoan?.loanAmount ? response?.propertyLoan?.loanAmount : 0;
          const amountToBeRepaid = response.existingMortgages?.amountToBeRepaid ? response.existingMortgages?.amountToBeRepaid : 0;
          if (loanAmount < amountToBeRepaid) {
            this.stepSetupService.addStepToJourney(existingMortgagesIndex + 1, this.stepSetupService.deposit);
          } else {
            this.stepSetupService.removeStepFromJourney(this.stepSetupService.deposit.automationId);
          }
        });
    }
  }

  private checkPreviousEmployment() {
    this.store
      .select(getCurrentIncome)
      .pipe(takeUntil(this.onDestroy$), skip(1))
      .subscribe(() => {
        //TODO: check if this is needed for phase 2
        //
        // const shouldDisplayPrevEmployment = data?.applicantIncomes?.some(applicant => {
        //   return applicant.incomeDetails?.some(income => {
        //     if (income.currentEmploymentStatus !== EmploymentStatus.Retired && income.contractStartDate) {
        //       const today = new Date().getTime();
        //       const contractStartDate = new Date(income.contractStartDate).getTime();
        //       const isLessThanAYear = (today - contractStartDate) / (1000 * 3600 * 24 * 365) < 1;
        //
        //       return isLessThanAYear;
        //     }
        //     return false;
        //   });
        // });
        // if (shouldDisplayPrevEmployment) {
        //   const currentIncomeIndex = this.stepSetupService.currentJourney.findIndex(item => item.automationId === 'currentIncome');
        //   this.stepSetupService.addStepToJourney(currentIncomeIndex + 1, this.stepSetupService.previousEmployment);
        // } else {
        this.stepSetupService.removeStepFromJourney('previousEmployment');
        // }
      });
  }

  private checkPropertyLoanStep(data?: PropertyAndLoanDetailsResponse): void {
    if (data && this.isValidpropertyLoanData(data)) {
      this.stepSetupService.setDisabledStepStatus(this.stepSetupService.deposit.automationId, false);
      this.stepSetupService.setDisabledStepStatus(this.stepSetupService.productSelection.automationId, false);
    } else {
      this.stepSetupService.setDisabledStepStatus(this.stepSetupService.deposit.automationId, true);
      this.stepSetupService.setDisabledStepStatus(this.stepSetupService.productSelection.automationId, true);
      this.dataService.setFormStatus('INVALID', this.stepSetupService.deposit.automationId);
      this.dataService.setFormStatus('INVALID', this.stepSetupService.productSelection.automationId);
    }
  }

  private isValidpropertyLoanData(data: PropertyAndLoanDetailsResponse): boolean {
    if (!data.totalLoanAmount || !data.purchaseAmount) {
      return false;
    }
    const totalLoanAmount = data.totalLoanAmount as number;
    const purchasePrice = data.purchaseAmount as number;
    const isRemortgage = this.stepSetupService.isRemortgage;
    const minAllowedValue = isRemortgage ? this.CONFIGURATION.LOAN_AMOUNT.MIN.REMORTGAGE : this.CONFIGURATION.LOAN_AMOUNT.MIN.PURCHASE;
    const maxAllowedValue = isRemortgage ? this.CONFIGURATION.LOAN_AMOUNT.MAX.REMORTGAGE : this.CONFIGURATION.LOAN_AMOUNT.MAX.PURCHASE;

    const LTV = (totalLoanAmount / purchasePrice) * 100;
    const minAllowedLTV = this.CONFIGURATION.LTV.MIN;
    const maxAllowedLTV = this.CONFIGURATION.LTV.MAX;

    return totalLoanAmount <= maxAllowedValue && totalLoanAmount >= minAllowedValue && LTV <= maxAllowedLTV && LTV >= minAllowedLTV;
  }

  private updateMortgageTerm(value: ProductSelectionResponse): void {
    if (value?.loanParts?.length) {
      this.mortgageTermService.updateHighestMortgageTerm(value?.loanParts);
    }
  }
}
