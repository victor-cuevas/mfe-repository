import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Injectable({
  providedIn: 'root',
})
export class FmaJourneyAuthResolver {
  constructor(private stepSetupService: StepSetupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const routeSplit = state.url.split('/');

    if (this.stepSetupService.isStepAuthorized(routeSplit[routeSplit.length - 1])) {
      return true;
    } else {
      this.router.navigate(['broker/not-found'], { skipLocationChange: true });
      return false;
    }
  }
}
