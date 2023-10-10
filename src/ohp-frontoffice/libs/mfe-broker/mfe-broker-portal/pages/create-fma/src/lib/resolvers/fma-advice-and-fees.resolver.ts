import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdviceAndFeesResponse, FMAService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaAdviceAndFeesResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AdviceAndFeesResponse> {
    return this.fmaService.fMAGetAdviceAndFees(
      route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number,
      route.parent?.data.fmaJourney?.fmaData?.loanId as number,
    );
  }
}
