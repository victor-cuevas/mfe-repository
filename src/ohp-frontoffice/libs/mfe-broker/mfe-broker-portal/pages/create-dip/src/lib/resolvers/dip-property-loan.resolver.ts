import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipPropertyLoanResolver {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.dipService.dIPGetPropertyAndLoanDetails(
      route.parent?.data?.dipJourney?.dipData?.applicationDraftId,
      route.parent?.data?.dipJourney?.dipData?.loanId,
    );
  }
}
