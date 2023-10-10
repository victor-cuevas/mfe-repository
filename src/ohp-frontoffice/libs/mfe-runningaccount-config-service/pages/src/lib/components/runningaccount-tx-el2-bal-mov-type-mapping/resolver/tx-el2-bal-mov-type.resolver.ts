import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { TxEl2BalMovTypeService } from '../service/tx-el2-bal-mov-type.service';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';

@Injectable({
  providedIn: 'root'
})
export class TxEl2BalMovTypeResolver implements Resolve<boolean> {
  constructor(private txel2balmovtypeService: TxEl2BalMovTypeService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.spinnerService.setIsLoading(true);
    return this.txel2balmovtypeService.getTxEl2BalMoveTypeList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
      ))
  }
}
