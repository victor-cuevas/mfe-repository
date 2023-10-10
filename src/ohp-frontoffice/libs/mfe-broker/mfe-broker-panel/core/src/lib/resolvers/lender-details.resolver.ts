import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Lender, LenderService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Injectable({
  providedIn: 'root',
})
export class LenderDetailsResolver implements Resolve<Lender> {
  constructor(private lenderService: LenderService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Lender> {
    return this.lenderService.lenderGetLender();
  }
}
