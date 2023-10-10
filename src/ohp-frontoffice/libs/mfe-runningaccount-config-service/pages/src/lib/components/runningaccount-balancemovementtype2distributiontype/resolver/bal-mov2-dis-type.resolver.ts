import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { BalMov2DisTypeService } from '../service/bal-mov2-dis-type.service';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BalMov2DisTypeResolver implements Resolve<boolean> {
  constructor(private balMov2DistypeService: BalMov2DisTypeService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.balMov2DistypeService.getBalMov2DisTypeList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
