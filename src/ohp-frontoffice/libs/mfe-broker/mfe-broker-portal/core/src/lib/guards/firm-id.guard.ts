import { Injectable } from '@angular/core';
import { FirmDetailsModel, FirmService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { CaseSummaryService } from '../services/case-summary.service';

@Injectable({
  providedIn: 'root',
})
export class FirmIdGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot) {
    return this.firmService.firmGetFirm(route.paramMap.get('firmId') || '').pipe(
      map((data: FirmDetailsModel) => {
        this.caseSummaryService.fimData = data;
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.router.navigate(['broker/not-found'], { skipLocationChange: true });
        }
        return throwError(error);
      }),
    );
  }

  constructor(private firmService: FirmService, private router: Router, private caseSummaryService: CaseSummaryService) {}
}
