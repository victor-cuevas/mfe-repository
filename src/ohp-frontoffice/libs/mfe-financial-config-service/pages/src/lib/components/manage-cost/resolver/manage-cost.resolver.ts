import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ManageCostService } from '../service/manage-cost.service';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ManageCostResolver implements Resolve<boolean> {
  constructor(public manageCostService: ManageCostService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.manageCostService.GetManageCostResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
