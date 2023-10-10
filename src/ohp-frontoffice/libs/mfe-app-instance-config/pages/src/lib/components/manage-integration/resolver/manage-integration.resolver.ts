import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { GetManageFreeFieldConfigScreenDataResponseDto } from '../model/manage-integration.model';
import { ManageIntegrationService } from '../service/manage-integration.service';

@Injectable({
  providedIn: 'root'
})
export class ManageIntegrationResolver implements Resolve<GetManageFreeFieldConfigScreenDataResponseDto> {
  constructor(private service: ManageIntegrationService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getManageIntegrationData().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
