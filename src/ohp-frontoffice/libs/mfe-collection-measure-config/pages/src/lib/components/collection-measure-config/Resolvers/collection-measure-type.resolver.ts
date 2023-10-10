import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-collection-measure-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CollectionMeasureConfigService } from '../Services/collection-measure-config.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionMeasureTypeResolver implements Resolve<boolean> {

  constructor(public collectionMeasureService:CollectionMeasureConfigService,public spinnerService:SpinnerService){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.collectionMeasureService.getCollectionMeasureType().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    )
  }
}
