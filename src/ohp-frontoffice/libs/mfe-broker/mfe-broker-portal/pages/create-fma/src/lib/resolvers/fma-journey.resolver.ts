import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, Subject } from 'rxjs';
import { concatMap, map, skip, take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  CaseSummaryService,
  CheckRetirementService,
  DataService,
  FmaContactService,
  loadPersonalDetailsSuccess,
  loadProductSelectionSuccess,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { CreateDIPResponse, DIPService, FMAService, Journey, ValuationContact } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class FmaJourneyResolver {
  public onDestroy$ = new Subject<boolean>();

  constructor(
    private stepSetupService: StepSetupService,
    private router: Router,
    private dipService: DIPService,
    private fmaService: FMAService,
    private store: Store,
    private checkRetirementService: CheckRetirementService,
    private dataService: DataService,
    private caseSummaryService: CaseSummaryService,
    private fmaContactService: FmaContactService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ fmaData: CreateDIPResponse }> | Promise<boolean> {
    const routeSplit = state.url.split('/');

    // set FMA as journey
    this.stepSetupService.getFmaJourney();

    // run checks
    this.checkRetirementIncome();

    // if FMA possible and if step authorized cause of existing values (last steps need first step values)
    if (this.stepSetupService.isStepAuthorized(routeSplit[routeSplit.length - 1])) {
      if (this.caseSummaryService.fmaSummary) {
        this.caseSummaryService.checkProductsAvailability(route.parent?.data.summary.applicationDraftId, route.parent?.data.summary.loanId);
        return this.getAdditionalData({
          applicationDraftId: route.parent?.data.summary.applicationDraftId,
          loanId: route.parent?.data.summary.loanId,
        });
      } else {
        return this.dipService.dIPCreateDIP({ caseId: route.parent?.data.summary.caseData.caseId }).pipe(
          concatMap((response: CreateDIPResponse) => {
            return this.getAdditionalData(response);
          }),
        );
      }
    } else {
      return this.router.navigate(['broker/not-found'], { skipLocationChange: true });
    }
  }

  private getAdditionalData(response: CreateDIPResponse) {
    return forkJoin([
      this.dipService.dIPGetPersonalDetails(response.applicationDraftId as number),
      this.fmaService.fMAGetProductSelection(response.applicationDraftId as number, response.loanId as number),
      this.fmaService.fMAGetValuationDetails(response.applicationDraftId as number),
      this.fmaService.fMAGetLoanProgress(response.applicationDraftId as number, response.loanId as number),
    ]).pipe(
      map(([personalDetailsResponse, productSelectionResponse, valuationDetailsData, validatedSteps]) => {
        this.store.dispatch(loadPersonalDetailsSuccess({ entity: personalDetailsResponse }));
        this.store.dispatch(loadProductSelectionSuccess({ entity: productSelectionResponse }));
        if (validatedSteps.progress === null) this.dataService.journeyProgress = {};
        this.dataService.journeyProgress = validatedSteps.progress;

        if (this.dataService.journeyProgress) {
          this.stepSetupService
            .validateJourney(this.dataService.journeyProgress)
            .pipe(take(1))
            .subscribe(() => {
              this.stepSetupService.checkConfirmStep(Journey.Fma);
            });
        } else {
          this.stepSetupService.checkConfirmStep(Journey.Fma);
        }

        if (
          valuationDetailsData.valuationContact &&
          valuationDetailsData.valuationContact !== ValuationContact.SELLER &&
          valuationDetailsData.valuationContact !== ValuationContact.ESTATE_AGENT
        ) {
          this.fmaContactService.applicantFullName = valuationDetailsData.valuationContact;
        }

        return { fmaData: response };
      }),
    );
  }

  private checkRetirementIncome() {
    this.checkRetirementService
      .getRetiringApplicants()
      .pipe(skip(1), takeUntil(this.onDestroy$))
      .subscribe(value => {
        if (!value?.length) {
          this.stepSetupService.removeStepFromJourney('retirementIncome');
        }
      });
  }
}
