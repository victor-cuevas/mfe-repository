import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { NewProductService } from '../service/new-product.service';
import { catchError, } from 'rxjs/operators';
import { productCodeTables } from '../Models/productCodeTables.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core'

@Injectable({
  providedIn: 'root'
})
export class NewProductCodeTableResolver implements Resolve<productCodeTables> {
  constructor(public newProductService: NewProductService, public spinnerService: SpinnerService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
   
    return this.newProductService.codeTableResponse().pipe(
      catchError((err) => {
        this.spinnerService.setIsLoading(false)
        return throwError(err);
      }
      ))
  }
}
