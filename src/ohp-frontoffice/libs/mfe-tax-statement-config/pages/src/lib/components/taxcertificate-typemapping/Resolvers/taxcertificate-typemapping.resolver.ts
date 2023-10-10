import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TaxcertificateTypemappingService } from '../Services/taxcertificate-typemapping.service';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
@Injectable({
  providedIn: 'root'
})
export class TaxcertificateTypemappingResolver implements Resolve<boolean> {
  constructor(public taxcertificateTypeMappingService:TaxcertificateTypemappingService,public spinnerService:SpinnerService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.taxcertificateTypeMappingService.getTaxCertificateConfigTypeMapping().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
