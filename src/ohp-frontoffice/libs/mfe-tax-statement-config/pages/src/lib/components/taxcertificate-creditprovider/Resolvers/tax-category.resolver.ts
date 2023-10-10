import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaxcertificateCreditProviderService } from '../Services/taxcertificate-credit-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TaxCategoryResolver implements Resolve<boolean> {

  constructor(public taxcreditProviderService:TaxcertificateCreditProviderService,public spinnerService:SpinnerService){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.taxcreditProviderService.getTaxCategory().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
