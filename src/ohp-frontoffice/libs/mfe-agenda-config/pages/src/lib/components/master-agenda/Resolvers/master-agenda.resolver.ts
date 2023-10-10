import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResponseMasterAgenda } from '../Model/responseMasterAgenda.model';
import { MasterAgendaService } from '../Service/masterAgenda.service';

@Injectable({
  providedIn: 'root'
})
export class MasterAgendaResolver implements Resolve<ResponseMasterAgenda> {
  constructor(private agendaService:MasterAgendaService,public spinnerService:SpinnerService ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.agendaService.GetResponse().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    );
  }
}
