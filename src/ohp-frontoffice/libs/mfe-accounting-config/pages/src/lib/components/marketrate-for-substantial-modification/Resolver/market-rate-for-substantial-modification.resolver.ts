import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { MarketRateForSubstantialModificationService } from '../Service/market-rate-for-substantial-modification.service';

@Injectable({
  providedIn: 'root'
})
export class MarketRateForSubstantialModificationResolver implements Resolve<boolean> {
  constructor(public marketRateService: MarketRateForSubstantialModificationService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.marketRateService.getMarketRate().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
