import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommunicationOutcomeService } from '../Services/communication-outcome.service';

@Injectable({
  providedIn: 'root'
})
export class GetCommunicationOutcome2DossierStatusResolver implements Resolve<boolean> {
  constructor(public communicationoutcomeService: CommunicationOutcomeService,public spinnerService:SpinnerService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.communicationoutcomeService.getCommunicationOutcome2DossierStatusList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
