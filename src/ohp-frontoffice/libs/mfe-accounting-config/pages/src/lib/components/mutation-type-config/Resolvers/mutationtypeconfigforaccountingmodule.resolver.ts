import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MutationTypeService } from '../Services/mutation-type-config.service';

@Injectable({
  providedIn: 'root'
})
export class MutationTypeResolver implements Resolve<boolean> {

  constructor(public genericservice: MutationTypeService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.genericservice.getMutationTypeScreenData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
