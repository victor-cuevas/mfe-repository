import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FMAService, LendingPolicyCheckResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaLenderPolicyCheckResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LendingPolicyCheckResponse> {
    return this.fmaService.fMAGetLendingPolicyCheck(
      route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number,
      route.parent?.data.fmaJourney?.fmaData?.loanId as number,
    );
  }
}
