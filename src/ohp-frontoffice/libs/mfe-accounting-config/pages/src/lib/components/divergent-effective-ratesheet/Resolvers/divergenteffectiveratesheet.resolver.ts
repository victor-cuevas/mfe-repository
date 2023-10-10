import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DivergentEffectiveRateService } from '../../divergent-effective-ratesheet/Services/divergent-effective-ratesheet.service';

@Injectable({
  providedIn: 'root'
})
export class DivergentEffectiveRateResolver implements Resolve<boolean> {

  constructor(public genericservice: DivergentEffectiveRateService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.genericservice.getDivergentEffectiveRateScreenData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
