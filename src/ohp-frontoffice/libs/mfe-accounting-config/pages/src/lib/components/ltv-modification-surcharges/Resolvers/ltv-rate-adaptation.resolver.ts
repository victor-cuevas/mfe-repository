import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LtvModificationService } from '../services/ltv-modification.service';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';

@Injectable({
  providedIn: 'root'
})
export class LtvRateAdaptationResolver implements Resolve<boolean> {
  constructor(public ltvModificationService: LtvModificationService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.ltvModificationService.getltvRateAdaptation().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
