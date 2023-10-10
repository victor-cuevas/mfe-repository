import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';
import { catchError } from 'rxjs/operators';
import { RunnAccBookingPlanService } from '../service/runn-acc-booking-plan.service';


@Injectable({
  providedIn: 'root'
})
export class RunnAccBookingPlanResolver implements Resolve<boolean> {
  constructor(private runnAccBookingPlanService: RunnAccBookingPlanService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.runnAccBookingPlanService.getBookingPlanData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
