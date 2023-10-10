import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { FreeFieldConfigService } from '../service/free-field-config.service';

@Injectable({
  providedIn: 'root'
})
export class FreeFieldConfigCodeTableResolver implements Resolve<boolean> {
  constructor(private service: FreeFieldConfigService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getFreeFieldConfigScreenData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
