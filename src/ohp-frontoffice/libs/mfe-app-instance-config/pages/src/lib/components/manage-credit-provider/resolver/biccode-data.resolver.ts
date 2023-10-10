import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreditProviderService } from '../service/credit-provider.service';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';


@Injectable({
  providedIn: 'root'
})
export class BICCodeDataResolver implements Resolve<string[]> {
  constructor(private service: CreditProviderService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getBICCodes().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
