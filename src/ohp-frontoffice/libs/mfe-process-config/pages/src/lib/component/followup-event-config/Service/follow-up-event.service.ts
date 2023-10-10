import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { eventdateType } from '../Models/eventDateType';
import { followUpEventConfig } from '../Models/followUpEventConfig';
import { followUpEventName } from '../Models/followUpEventName';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class FollowUpEventService {
  
  Url !:string
  constructor(private http: HttpClient, private processService: ConfigContextService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }


  public GetFollowUpEventConfigResponse(): Observable<followUpEventConfig[]> {
    return this.http.get<followUpEventConfig[]>(this.Url + "api/FollowUpEventConfig/getFollowUpEventConfigurationScreenData");

  }

  public GetFollowUpEventNameResponse(): Observable<eventdateType[]>{
    return this.http.get<eventdateType[]>(this.Url + "api/FollowUpEventConfig/getFollowUpEventNameList");

  }

  public GetEventDateTypeResponse(): Observable<followUpEventName[]> {
    return this.http.get<followUpEventName[]>(this.Url + "api/FollowUpEventConfig/getEventDateTypeList");

  }

  public PostFollowUpEventConfigResponse(GridData: any[]) {
    return this.http.post(this.Url + "api/FollowUpEventConfig/SaveFollowUpEventConfigurationScreenData", GridData);
  }
}
