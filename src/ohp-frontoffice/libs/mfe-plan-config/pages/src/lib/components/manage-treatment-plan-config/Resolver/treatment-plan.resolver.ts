import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TreatmentPlanService } from '../Service/treatment-plan.service';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';



@Injectable({
  providedIn: 'root'
})
export class TreatmentPlanResolver implements Resolve<boolean> {
  constructor(public treatmentService: TreatmentPlanService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.treatmentService.GetPlanDerivationCriteriaConfigInitialResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
