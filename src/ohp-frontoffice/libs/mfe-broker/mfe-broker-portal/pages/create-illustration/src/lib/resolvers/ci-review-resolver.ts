import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import {
  AdviceAndFeesResponse,
  getProductSelection,
  IllustrationService,
  LoanDetailsResponse,
  ProductSelectionResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, throwError } from 'rxjs';
import { getLoanDetails } from '../state/loan-details/loan-details.selector';
import { catchError, map } from 'rxjs/operators';

interface ReviewData {
  loanDetailsData?: LoanDetailsResponse;
  productSelectionData?: ProductSelectionResponse;
  adviceAndFeesData?: AdviceAndFeesResponse;
}

@Injectable({
  providedIn: 'root',
})
export class CiReviewResolver implements Resolve<ReviewData> {
  constructor(private illustrationService: IllustrationService, private router: Router, private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ReviewData> {
    return forkJoin([
      this.store.select(getLoanDetails),
      this.store.select(getProductSelection),
      this.illustrationService.illustrationGetAdviceAndFees(
        route.parent?.data.illustrationJourney?.illustrationData?.applicationDraftId,
        route.parent?.data.illustrationJourney?.illustrationData?.loanId,
      ),
    ]).pipe(
      map(allResponses => ({ loanDetails: allResponses[0], productSelectionDetails: allResponses[1], adviceAndFeesData: allResponses[2] })),
      catchError(error => {
        this.router.navigate(['broker/not-found'], { skipLocationChange: true });
        return throwError(error);
      }),
    );
  }
}
