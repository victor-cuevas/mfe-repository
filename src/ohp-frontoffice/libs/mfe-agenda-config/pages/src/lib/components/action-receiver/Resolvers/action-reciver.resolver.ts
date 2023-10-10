import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResponseActionReceiver } from '../Model/responseActionReceiver';
import { ActionReceiverService } from '../Service/actionReceiver.service';

@Injectable({
  providedIn: 'root'
})
export class ActionReciverResolver implements Resolve<ResponseActionReceiver> {
  constructor(private actionService:ActionReceiverService,public spinnerService:SpinnerService ){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.actionService.GetResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    );;
  }
}
