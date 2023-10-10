import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { PrepaymentReasonService } from '../Service/prepayment-reason-service.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrepaymentReasonResolver implements Resolve<boolean> {
  constructor(public prePaymentReasonService: PrepaymentReasonService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.prePaymentReasonService.GetPrePaymentReasonResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
