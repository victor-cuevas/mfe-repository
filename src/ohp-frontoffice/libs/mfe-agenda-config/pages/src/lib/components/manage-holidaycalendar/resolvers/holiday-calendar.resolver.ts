import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HolidayCalenderDto } from '../models/holiday-calendar.model';
import { HolidayCalendarService } from '../services/holiday-calendar.service';

@Injectable({ providedIn: 'root' })
export class HolidayCalendarResolver implements Resolve<HolidayCalenderDto[]> {
  constructor(private holidaycalenderservice: HolidayCalendarService,public spinnerService:SpinnerService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.holidaycalenderservice.getManageHolidayCalender().pipe(
      catchError((error) => {
        this.spinnerService.setIsLoading(false)
        return throwError(error);
      })
    );
  }
}
