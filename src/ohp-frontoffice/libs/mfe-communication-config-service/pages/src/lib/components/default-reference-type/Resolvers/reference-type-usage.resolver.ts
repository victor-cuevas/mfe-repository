import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DefaultReferenceTypeService } from '../Service/default-reference-type.service';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';


@Injectable({
  providedIn: 'root'
})
export class ReferenceTypeUsageResolver implements Resolve<boolean> {
  constructor(public DefaultRefTypeService: DefaultReferenceTypeService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true)
    return this.DefaultRefTypeService.GetReferenceTypeUsage().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
