import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FollowupCase2DunningDossierService } from '../Services/followup-case2-dunning-dossier.service';

@Injectable({
  providedIn: 'root'
})
export class GetFollowUpCaseStatusResolver implements Resolve<boolean> {
  constructor(public followupDunningService:FollowupCase2DunningDossierService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.followupDunningService.getFollowUpCaseStatus().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
