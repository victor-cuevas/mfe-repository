import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentIncomeResponse, DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipCurrentIncomeResolverResolver implements Resolve<CurrentIncomeResponse> {
  constructor(private dipService: DIPService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<CurrentIncomeResponse> {
    return this.dipService.dIPGetCurrentIncome(route.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }
}
