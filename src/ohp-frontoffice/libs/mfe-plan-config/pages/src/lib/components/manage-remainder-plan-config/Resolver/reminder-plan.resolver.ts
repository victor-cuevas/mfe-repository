import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReminderPlanService } from '../Service/reminder-plan.service';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';


@Injectable({
  providedIn: 'root'
})
export class ReminderPlanResolver implements Resolve<boolean> {
  constructor(public reminderService: ReminderPlanService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.reminderService.GetPlanDerivationCriteriaConfigInitialResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
