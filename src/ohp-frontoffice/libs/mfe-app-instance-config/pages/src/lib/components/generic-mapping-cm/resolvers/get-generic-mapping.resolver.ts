import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CmGenericMappingService } from '../services/cm-generic-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class GetGenericMappingResolver implements Resolve<boolean> {
  constructor(public cmgenericservice: CmGenericMappingService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.cmgenericservice.getcmGenericMapping().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
    ))
  }
}
