import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RuleEngineService } from '../Service/rule-engine.service';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';


@Injectable({
  providedIn: 'root'
})
export class RuleEnginePaymentAllocationPlanResolver implements Resolve<boolean> {
  constructor(public ruleEngineService: RuleEngineService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.ruleEngineService.GetPaymentAllocationPlanList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
