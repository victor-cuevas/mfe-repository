import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CodeTableParameterService } from '../Services/code-table-parameter.service';

@Injectable({
  providedIn: 'root'
})
export class CodeTableParamListResolver implements Resolve<boolean> {
  
  constructor(public codeTableParamservice: CodeTableParameterService, public spinnerService: SpinnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    
    return this.codeTableParamservice.getCodetableParamList().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      }
    ))
  }
}
