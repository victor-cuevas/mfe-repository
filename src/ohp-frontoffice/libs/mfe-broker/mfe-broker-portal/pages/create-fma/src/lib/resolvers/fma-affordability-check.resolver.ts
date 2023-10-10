import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AffordabilityCheckResponse, CalculationService, LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaAffordabilityCheckResolver {
  constructor(private calculationService: CalculationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AffordabilityCheckResponse> | null {
    if (route.parent?.data.summary?.fmaData?.loan?.status === LoanStatus.Documentation) {
      // TODO This is a workaround to get the needed data for the screen when the case is in status Documentation and de call fails.
      // Affordability Check should be a GET and return always a response with the needed data.
      // Also it's Affordability not Affordibility.
      return of({
        affordabilityRatio: 0.5,
        totalLoanAmount: route.parent?.data.summary?.fmaData?.loan?.loanPartSummary[0].loanAmount,
        duration: route.parent?.data.summary?.fmaData?.loan?.loanPartSummary[0].term,
      });
    }
    return this.calculationService.calculationPutAffordibilityCheck(
      route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number,
      route.parent?.data.fmaJourney?.fmaData?.loanId as number,
    );
  }
}
