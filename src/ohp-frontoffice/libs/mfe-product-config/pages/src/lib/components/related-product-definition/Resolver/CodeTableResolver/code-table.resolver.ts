import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { Observable, of, throwError } from 'rxjs';
import { InitialData } from '../../Models/initial-Codetable.model';
import { RelatedProductDefinitionService } from '../../Service/related-product-definition.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CodeTableResolver implements Resolve<InitialData> {
  constructor(public relatedprodService: RelatedProductDefinitionService,public spinner: SpinnerService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.relatedprodService.getCodeTableValues().pipe(
      catchError((error) => {
        this.spinner.setIsLoading(false)
        return throwError(error);
      })
    );
  }
}
