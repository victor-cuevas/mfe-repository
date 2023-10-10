import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommunicationReceiverService } from '../Services/communication-receiver.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationReceiverResolver implements Resolve<boolean> {

  constructor(public genericservice: CommunicationReceiverService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.genericservice.getCommunicationReceiverScreenData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
