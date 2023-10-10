import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { GetCreditProviderSettingsDto } from '../model/credit-provider.model';
import { CreditProviderService } from '../service/credit-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CreditProviderResolver implements Resolve<GetCreditProviderSettingsDto> {
  constructor(private service: CreditProviderService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getCreditProviderData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
