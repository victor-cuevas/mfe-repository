import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FMAService, SecurityPropertyResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaBankAccountResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SecurityPropertyResponse> {
    return this.fmaService.fMAGetBankAccountDetails(route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number);
  }
}
