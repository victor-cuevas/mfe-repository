import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { Observable } from 'rxjs';

import { HolidayCalenderDto } from '../models/holiday-calendar.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({ providedIn: 'root' })
export class HolidayCalendarService {

  protected envApiUrl:string;

  constructor(private http: HttpClient,private commonService: ConfigContextService, private spinnerService:SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'agenda') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getManageHolidayCalender(): Observable<HolidayCalenderDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<HolidayCalenderDto[]>(this.envApiUrl + 'api/HolidayCalender/GetManageHolidayCalendarScreenData');
  }

  saveManageHolidayCalender(request: any): Observable<HolidayCalenderDto[]> {

    return this.http.post<HolidayCalenderDto[]>(this.envApiUrl + 'api/HolidayCalender/SaveManageHolidayCalendarScreenData', request);
  }
}
