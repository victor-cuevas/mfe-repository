import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

import { IllustrationService, LoanDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CiLoanDetailsResolver implements Resolve<LoanDetailsResponse> {
  constructor(private illustrationService: IllustrationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LoanDetailsResponse> {
    return this.illustrationService
      .illustrationGetLoanDetails(
        route.parent?.data.illustrationJourney?.illustrationData?.applicationDraftId,
        route.parent?.data.illustrationJourney?.illustrationData?.loanId,
      )
      .pipe(
        catchError(error => {
          this.router.navigate(['broker/not-found'], { skipLocationChange: true });
          return throwError(error);
        }),
      );
  }
}
