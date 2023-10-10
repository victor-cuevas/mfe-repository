import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { CodetableParameterDto, FollowUpProcedureDto, ReminderFlowConfigScreenDto, ReminderFlowSearchCriteriaDto, ReminderScenarioDto, ResponsePagedListBaseOfFollowUpProcedureDto, ResponsePagedListBaseOfReminderScenarioDto } from '../models/manage-remainder-flow-config.model';
@Injectable({
  providedIn: 'root'
})
export class ManageRemainderFlowConfigService {


  protected envApiUrl: string


  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'plan') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getRemainderFlowScreenData(): Observable<ReminderFlowConfigScreenDto> {
    return this.http.get<ReminderFlowConfigScreenDto>(this.envApiUrl + 'api/ManageReminderFlow/GetReminderFlowConfigScreenData');
  }

  public getCodetableParameterByName(request:string): Observable<CodetableParameterDto> {
    return this.http.get<CodetableParameterDto>(this.envApiUrl + 'api/ManageReminderFlow/GetCodetableParameterByName?parameterName=' + request);
  }

  public getReminderScenarioList(request: ReminderFlowSearchCriteriaDto): Observable<ResponsePagedListBaseOfReminderScenarioDto> {
    return this.http.post<ResponsePagedListBaseOfReminderScenarioDto>(this.envApiUrl + 'api/ManageReminderFlow/GetReminderScenarioList', request);
  }

  public getFollowupProcedureList(request: ReminderFlowSearchCriteriaDto): Observable<ResponsePagedListBaseOfFollowUpProcedureDto> {
    return this.http.post<ResponsePagedListBaseOfFollowUpProcedureDto>(this.envApiUrl + 'api/ManageReminderFlow/GetFollowupProcedureList', request);
  }

  public deleteFollowUpData(request: number) {
    return this.http.delete(this.envApiUrl + 'api/ManageReminderFlow/DeleteFollowupProcedure?request=' + request)
  }

  public deleteRemainderScenarioData(request: number) {
    return this.http.delete(this.envApiUrl + 'api/ManageReminderFlow/DeleteReminderScenario?request=' + request)
  }

  public saveRemainderScenarioData(request: ReminderScenarioDto) {
    return this.http.post(this.envApiUrl + 'api/ManageReminderFlow/SaveReminderScenario' , request)
  }

  public saveFollowUpData(request: FollowUpProcedureDto) {
    return this.http.post(this.envApiUrl + 'api/ManageReminderFlow/SaveFollowupProcedure' , request)
  }
}
