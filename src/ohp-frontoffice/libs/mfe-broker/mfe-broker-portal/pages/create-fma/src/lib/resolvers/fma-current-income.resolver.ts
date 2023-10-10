import { Injectable } from '@angular/core';
import { CurrentIncomeResponse, FMAService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaCurrentIncomeResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CurrentIncomeResponse> {
    return this.fmaService.fMAGetCurrentIncome(route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number);
  }
}
