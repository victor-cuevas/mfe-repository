import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Owner2participantService } from '../Service/owner2participant.service';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';


@Injectable({
  providedIn: 'root'
})
export class Owner2participantResolver implements Resolve<boolean> {
  constructor(private owner2participantService: Owner2participantService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.owner2participantService.getOwner2ParticipantList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
