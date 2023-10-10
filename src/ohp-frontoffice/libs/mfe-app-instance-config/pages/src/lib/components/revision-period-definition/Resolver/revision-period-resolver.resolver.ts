import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { RevisionPeriodService } from '../Service/revision-period-service.service';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RevisionPeriodResolver implements Resolve<boolean> {
  constructor(public revisionPeriodService: RevisionPeriodService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.revisionPeriodService.GetRevisionPeriodResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}