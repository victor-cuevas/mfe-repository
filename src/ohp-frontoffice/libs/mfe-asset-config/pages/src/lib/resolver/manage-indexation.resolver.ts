import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-asset-config/core';
import { ManageIndexationConfigInitialDataDto } from '../models/manage-indexation.model';
import { IndexationService } from '../service/indexation.service';

@Injectable({
  providedIn: 'root'
})
export class ManageIndexationResolver implements Resolve<ManageIndexationConfigInitialDataDto> {
  constructor(private service: IndexationService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.service.getManageIndexation().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
