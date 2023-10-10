import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DIPService, FutureChangesInIncomeResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipFutureChangesResolver implements Resolve<FutureChangesInIncomeResponse> {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FutureChangesInIncomeResponse> {
    return this.dipService.dIPGetFutureChangesInIncome(route.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }
}
