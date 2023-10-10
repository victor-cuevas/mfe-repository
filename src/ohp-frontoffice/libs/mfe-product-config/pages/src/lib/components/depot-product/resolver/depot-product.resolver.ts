import { Injectable } from '@angular/core';
import { Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { DepotProductsDto } from '../models/depot-product.model';
import { DepotProductService } from '../service/depot-product.service';

@Injectable({
  providedIn: 'root'
})
export class DepotProductResolver implements Resolve<DepotProductsDto> {
  constructor(private service: DepotProductService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getDepotProduct().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
