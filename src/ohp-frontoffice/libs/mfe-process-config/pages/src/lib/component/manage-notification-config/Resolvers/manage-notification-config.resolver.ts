import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ManageNotificationConfigService } from '../Services/manage-notification-config.service';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';

@Injectable({
  providedIn: 'root'
})
export class ManageNotificationConfigResolver implements Resolve<boolean> {
  constructor(public manageNotificationConfigService: ManageNotificationConfigService,public spinnerService:SpinnerService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      return  this.manageNotificationConfigService.getNotificationData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
     )
  }
}
