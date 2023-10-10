import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { DepotPurposeProductService } from '../Service/depot-purpose-product.service';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';

@Injectable({
  providedIn: 'root'
})
export class DepotPurposeProductResolver implements Resolve<boolean> {
  constructor(private DepotpurposeService:DepotPurposeProductService,private spinnerService:SpinnerService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
   return  this.DepotpurposeService.getDepotData().pipe(
    catchError((error) => {
      this.spinnerService.setIsLoading(false)
      return throwError(error);
    })
   )
  }
}
