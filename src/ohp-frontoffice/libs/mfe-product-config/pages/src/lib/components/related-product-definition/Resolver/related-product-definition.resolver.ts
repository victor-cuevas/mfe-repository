import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { Observable, of, throwError } from 'rxjs';
import { RelatedProductDefinitionService } from '../Service/related-product-definition.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelatedProductDefinitionResolver implements Resolve<boolean> {
  constructor(public relatedprodService: RelatedProductDefinitionService,public spinner: SpinnerService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.relatedprodService.getProductDefinition().pipe(
      catchError((error) => {
        this.spinner.setIsLoading(false)
        return throwError(error);
      })
    );;
  }
}
