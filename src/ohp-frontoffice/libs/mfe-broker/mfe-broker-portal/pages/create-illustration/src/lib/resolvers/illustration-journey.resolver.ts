import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, skip, take, takeUntil } from 'rxjs/operators';

import { loadLoanDetailsSuccess } from '../state/loan-details/loan-details.actions';
import { getLoanDetails } from '../state/loan-details/loan-details.selector';
import {
  DataService,
  loadProductSelectionSuccess,
  StepSetupService,
  CaseSummaryService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { IllustrationService, Journey, LoanDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { HttpErrorResponse } from '@angular/common/http';

interface IllustrationData {
  illustrationData: {
    applicationDraftId: number;
    loanId: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IllustrationJourneyResolver {
  public onDestroy$ = new Subject<boolean>();

  constructor(
    private illustrationService: IllustrationService,
    private store: Store,
    private caseSummaryService: CaseSummaryService,
    private stepSetupService: StepSetupService,
    private dataService: DataService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IllustrationData> | void {
    const applicationDraftId = parseInt(route.paramMap.get('applicationDraftId') || '');
    const loanId = parseInt(route.paramMap.get('loanId') || '');
    const routeSplit = state.url.split('/');

    // set ILLUSTRATION steps  as journey
    this.stepSetupService.getIllustrationJourney();
    // run checks
    this.checkLoanDetailsData();

    if (applicationDraftId && loanId && !isNaN(applicationDraftId) && !isNaN(loanId)) {
      if (this.stepSetupService.isStepAuthorized(routeSplit[routeSplit.length - 1])) {
        return forkJoin([
          this.illustrationService.illustrationGetLoanDetails(applicationDraftId, loanId),
          this.illustrationService.illustrationGetProductSelection(applicationDraftId, loanId),
          this.illustrationService.illustrationGetLoanProgress(applicationDraftId, loanId),
        ]).pipe(
          catchError((error: HttpErrorResponse) => {
            this.router.navigate(['broker/not-found'], { skipLocationChange: true });
            return throwError(error);
          }),
          map(([loanDetailsResponse, productSelectionResponse, validatedSteps]) => {
            this.store.dispatch(loadLoanDetailsSuccess({ entity: loanDetailsResponse }));
            this.store.dispatch(loadProductSelectionSuccess({ entity: productSelectionResponse }));
            if (validatedSteps.progress === null) this.dataService.journeyProgress = {};
            this.dataService.journeyProgress = validatedSteps.progress;

            this.caseSummaryService.checkProductsAvailability(applicationDraftId, loanId);

            if (this.dataService.journeyProgress) {
              this.stepSetupService
                .validateJourney(this.dataService.journeyProgress)
                .pipe(take(1))
                .subscribe(() => this.stepSetupService.checkConfirmStep(Journey.Illustration));
            } else {
              this.stepSetupService.checkConfirmStep(Journey.Illustration);
            }

            return {
              illustrationData: {
                applicationDraftId,
                loanId,
              },
            };
          }),
        );
      }
    }
    this.router.navigate(['broker/not-found'], { skipLocationChange: true });
    return;
  }

  private checkLoanDetailsData() {
    this.store
      .select(getLoanDetails)
      .pipe(takeUntil(this.onDestroy$), skip(1))
      .subscribe((data: LoanDetailsResponse | undefined) => {
        data?.purchasePrice && data?.totalLoanAmount
          ? this.stepSetupService.setDisabledStepStatus(this.stepSetupService.productSelection.automationId, false)
          : this.stepSetupService.setDisabledStepStatus(this.stepSetupService.productSelection.automationId, true);
      });
  }
}
