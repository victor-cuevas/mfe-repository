import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { RoleTypeService } from '../Service/role-type.service';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoleTypeCodeTablesResolver implements Resolve<boolean> {
  constructor(public roleTypeService: RoleTypeService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.roleTypeService.GetCodeTableResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
