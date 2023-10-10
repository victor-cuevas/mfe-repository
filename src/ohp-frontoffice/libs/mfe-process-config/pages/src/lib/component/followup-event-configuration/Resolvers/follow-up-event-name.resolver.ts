import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FollowUpEventConfigurationService } from '../Services/follow-up-event-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class FollowUpEventNameConfigResolver implements Resolve<boolean> {
  constructor(public followupEventConfigService: FollowUpEventConfigurationService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.followupEventConfigService.getFollowUpEvent().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
