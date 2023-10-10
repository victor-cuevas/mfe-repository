import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { FollowUpEventService } from '../Service/follow-up-event.service';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EventNameResolver implements Resolve<boolean> {
  constructor(public followupEventConfigService: FollowUpEventService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.followupEventConfigService.GetFollowUpEventNameResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
