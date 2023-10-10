import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { DepotProductService } from '../service/depot-product.service';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { DepotTypeDto } from '../models/depot-product.model';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DepotTypeDataResolver implements Resolve<DepotTypeDto> {
  constructor(private service: DepotProductService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getDepotType().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
