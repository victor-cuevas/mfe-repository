import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { FeeConfigService } from '../Service/fee-config.service';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FeeConfigResolver implements Resolve<boolean> {
  constructor(public feeConfigService: FeeConfigService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.feeConfigService.GetFeeConfigResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
