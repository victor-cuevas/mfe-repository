import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {SpinnerService} from '@close-front-office/mfe-financial-config-service/core'
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ManageDueAmountSortingService } from '../Services/manage-due-amount-sorting.service';

@Injectable({
  providedIn: 'root'
})
export class ManageDueAmountSortingResolver implements Resolve<boolean> {
  constructor(public managedueAmntService: ManageDueAmountSortingService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.managedueAmntService.getPaymentAllocation().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
