import { Injectable } from '@angular/core';
import {Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core';
import { ManageUserService } from '../service/manage-user.service';
import { GetManageUserAssociationsResponseDto } from '../models/manage-user.model';


@Injectable({
  providedIn: 'root'
})
export class ManageUserResolver implements Resolve<GetManageUserAssociationsResponseDto> {

  constructor(private userService: ManageUserService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.userService.getUserAssociations().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))}
}
