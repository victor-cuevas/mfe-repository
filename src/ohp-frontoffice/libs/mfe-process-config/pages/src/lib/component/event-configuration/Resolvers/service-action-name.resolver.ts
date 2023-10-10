import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventConfigurationService } from '../Services/event-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceActionNameEventResolver implements Resolve<boolean> {

  constructor(public eventConfigService:EventConfigurationService , public spinnerService: SpinnerService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.eventConfigService.getServiceActionName().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
