import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { CreditProviderService } from '../service/credit-provider.service';
import { CountryDto } from '../model/credit-provider.model';

@Injectable({
  providedIn: 'root'
})
export class CountryDataResolver implements Resolve<CountryDto[]> {
  constructor(private service: CreditProviderService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getCountryList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
