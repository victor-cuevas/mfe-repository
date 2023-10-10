import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ManageRemainderScenarioService } from '../Service/manage-remainder-scenario.service';

@Injectable({
  providedIn: 'root'
})
export class ManageRemainderScenarioResolver implements Resolve<boolean> {
  constructor(private remainderScenarioService:ManageRemainderScenarioService,public spinnerService:SpinnerService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.remainderScenarioService.getRemainderScenario().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    );
  }
}
