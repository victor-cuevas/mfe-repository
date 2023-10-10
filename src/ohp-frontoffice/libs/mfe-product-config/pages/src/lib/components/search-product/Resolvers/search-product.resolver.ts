import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of,throwError} from 'rxjs';
import { SearchProductCodeTables } from '../Models/searchproduct-codetable.model';
import { SearchProductService } from '../Service/search-product.service';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';

@Injectable({
  providedIn: 'root'
})
export class SearchProductResolver implements Resolve<SearchProductCodeTables> {
  constructor(private searchProductService: SearchProductService,private spinnerService:SpinnerService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.searchProductService.getSearchProduct().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    );
  }
}
