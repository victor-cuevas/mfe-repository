import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { HttpClient } from '@angular/common/http';
import { GetCodeTablesOfRunAccBookingPlanDto, RunnAccBookingPlanDto } from '../models/runn-acc-booking-plan.model';

@Injectable({
  providedIn: 'root'
})
export class RunnAccBookingPlanService {

  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'runningaccount') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getCodeTableData(): Observable<GetCodeTablesOfRunAccBookingPlanDto> {
    return this.http.get<GetCodeTablesOfRunAccBookingPlanDto>(
      this.envApiUrl + 'api/RunningAccount/CodeTables/RunAccBookingPlan'
    );
  }

  public getBookingPlanData(): Observable<RunnAccBookingPlanDto[]> {
    return this.http.get<RunnAccBookingPlanDto[]>(
      this.envApiUrl + 'api/RunningAccount/RunAccBookingPlan'
    );
  }

  public saveBookingPlanData(request: RunnAccBookingPlanDto[]) {
    return this.http.put(this.envApiUrl + 'api/RunningAccount/RunAccBookingPlan', request);
  }
}
