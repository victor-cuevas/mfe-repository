import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DIPService, FinancialCommitmentsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipFinancialCommitmentsResolver implements Resolve<FinancialCommitmentsResponse> {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FinancialCommitmentsResponse> {
    return this.dipService.dIPGetFinancialCommitments(route.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }
}
