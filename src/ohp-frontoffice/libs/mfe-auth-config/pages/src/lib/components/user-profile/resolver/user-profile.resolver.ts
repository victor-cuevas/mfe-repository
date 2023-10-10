import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core';
import { UserProfileService } from '../service/user-profile.service';
import { ManageUserProfileScreenDto } from '../models/manage-user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileResolver implements Resolve<ManageUserProfileScreenDto> {
  constructor(private service: UserProfileService, public spinnerService: SpinnerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getUserProfileList().pipe(
      catchError(error => {
        this.spinnerService.setIsLoading(false);
        return throwError(error);
      })
    );
  }
}
