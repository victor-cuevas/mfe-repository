import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { Observable, of, throwError } from 'rxjs';
import { TaxcertificateSystemconfigService } from '../Services/taxcertificate-systemconfig.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxcertificateSystemconfigResolver implements Resolve<boolean> {

  constructor(public taxCertificateSystemConfig: TaxcertificateSystemconfigService,public spinnerService:SpinnerService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.taxCertificateSystemConfig.getTaxCertificateSystemConfig().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
