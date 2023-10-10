import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { FollowUpConfigScreenDto } from '../models/manage-followup.model';
import { ManageFollowupService } from '../service/manage-followup.service';

@Injectable({
  providedIn: 'root'
})
export class ManageFollowupResolver implements Resolve<FollowUpConfigScreenDto> {

  constructor(private service: ManageFollowupService, private spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getFollowUpScreenData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
