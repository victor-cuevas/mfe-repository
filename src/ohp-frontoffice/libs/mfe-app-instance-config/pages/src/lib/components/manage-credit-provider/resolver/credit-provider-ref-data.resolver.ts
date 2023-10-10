import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { GetCreditProviderRefCodeData } from '../model/credit-provider.model';
import { CreditProviderService } from '../service/credit-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CreditProviderRefDataResolver implements Resolve<GetCreditProviderRefCodeData> {
  constructor(private service: CreditProviderService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getCreditProviderRefCodeData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
