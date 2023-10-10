import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DIPService, AdviceAndFeesResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipAdviceFeesResolver {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AdviceAndFeesResponse> {
    return this.dipService.dIPGetAdviceAndFees(
      route.parent?.data.dipJourney?.dipData?.applicationDraftId,
      route.parent?.data.dipJourney?.dipData?.loanId,
    );
  }
}
