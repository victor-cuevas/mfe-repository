import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { AffordabilityCheckResponse, CalculationService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipConfirmDipResolver {
  constructor(private calculationService: CalculationService, private spinnerService: SpinnerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AffordabilityCheckResponse> {
    this.spinnerService.setIsLoading(true, 'Please, wait for the affordability check result');
    return this.calculationService.calculationPutAffordibilityCheck(
      route.parent?.data.dipJourney?.dipData?.applicationDraftId,
      route.parent?.data.dipJourney?.dipData?.loanId,
    );
  }
}
