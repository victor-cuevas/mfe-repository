import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CollectionMeasureConfigService } from '../Services/collection-measure-config.service';
import {SpinnerService} from '@close-front-office/mfe-collection-measure-config/core'

@Injectable({
  providedIn: 'root'
})
export class FollowUpEventNameResolver implements Resolve<boolean> {

  constructor(public collectionMeasureService:CollectionMeasureConfigService,public spinnerService:SpinnerService){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.collectionMeasureService.getFollowUpEventName().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false);
        return throwError(error);
      })
    )
  }
}
