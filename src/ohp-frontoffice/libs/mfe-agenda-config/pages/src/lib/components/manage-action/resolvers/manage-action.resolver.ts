import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { Observable, of, throwError } from 'rxjs';
import { AllActionDto } from '../models/manage-action.model';
import { catchError, } from 'rxjs/operators';
import { ManageActionService } from '../services/manage-action.service';

@Injectable({
  providedIn: 'root'
})
export class ManageActionResolver implements Resolve<AllActionDto> {
  constructor(private actionService: ManageActionService,public spinnerService:SpinnerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.actionService.getManageActions().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
  
}
