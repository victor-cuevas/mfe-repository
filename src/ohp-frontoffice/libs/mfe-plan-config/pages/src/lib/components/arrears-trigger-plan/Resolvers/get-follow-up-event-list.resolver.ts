import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArrearsTriggerPlanService } from '../Services/arrears-trigger-plan.service';

@Injectable({
  providedIn: 'root'
})
export class GetFollowUpEventListResolver implements Resolve<boolean> {
  constructor(public arrearTriggerService: ArrearsTriggerPlanService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.arrearTriggerService.getFollowUpEventNameList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
