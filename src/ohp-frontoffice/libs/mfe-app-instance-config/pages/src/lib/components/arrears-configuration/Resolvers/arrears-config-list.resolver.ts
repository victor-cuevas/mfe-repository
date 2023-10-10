import { Injectable } from '@angular/core';
import { Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArrearsConfigurationService } from '../Services/arrears-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ArrearsConfigListResolver implements Resolve<boolean> {
  constructor(public arrearConfigurationService: ArrearsConfigurationService, public spinnerService: SpinnerService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.arrearConfigurationService.getArrearsConfigurationList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false);
        return throwError(error);
      }
    ))
  }
}
