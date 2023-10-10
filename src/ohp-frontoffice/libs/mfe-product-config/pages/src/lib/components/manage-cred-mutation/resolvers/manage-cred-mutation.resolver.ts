import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ManageMutationResponse } from '../models/managemutation.model';
import { ManageCredMutationService } from '../services/manage-cred-mutation.service';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';

@Injectable({
  providedIn: 'root'
})
export class ManageCredMutationResolver implements Resolve<ManageMutationResponse> {
  constructor(public mutationService:ManageCredMutationService,public spinnerService:SpinnerService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.mutationService.getManageMutationData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    );;
  }
}
