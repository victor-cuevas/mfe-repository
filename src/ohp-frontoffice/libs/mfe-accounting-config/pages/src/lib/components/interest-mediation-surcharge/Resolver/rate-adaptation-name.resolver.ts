import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { InterestMediationService } from '../service/interest-mediation.service';

@Injectable({
  providedIn: 'root'
})
export class RateAdaptationNameResolver implements Resolve<boolean> {
  constructor(public interestMediationService: InterestMediationService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.interestMediationService.getRateAdaptation().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
