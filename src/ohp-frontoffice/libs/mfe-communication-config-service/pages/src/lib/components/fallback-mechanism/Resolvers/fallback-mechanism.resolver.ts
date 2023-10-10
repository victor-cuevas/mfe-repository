import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FallbackMechanismService } from '../Service/fallback-mechanism.service';

@Injectable({
  providedIn: 'root'
})
export class FallbackMechanismResolver implements Resolve<boolean> {

  constructor(public fallbackService: FallbackMechanismService,public spinnerService:SpinnerService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.fallbackService.getFallBackData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
