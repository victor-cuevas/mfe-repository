import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DIPService, ExistingMortgageResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipExistingMortgageResolver implements Resolve<ExistingMortgageResponse> {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ExistingMortgageResponse> {
    return this.dipService.dIPGetExistingMortgage(route.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }
}
