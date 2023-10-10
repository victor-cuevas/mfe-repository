import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { eventConfigModel } from '../Models/eventConfiguration.model';
import { followUpEventNameModel } from '../Models/followUpEventName.model';
import { serviceActionName } from '../Models/serviceActionName.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class EventConfigurationService {
  Url !: string
  constructor(private http: HttpClient, private processService: ConfigContextService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }
  public GetEventConfigResponse(): Observable<eventConfigModel[]> {
    return this.http.get<eventConfigModel[]>(this.Url + "api/EventConfig/getEventConfigurationScreenData");

  }

  public GetEventNameResponse(): Observable<followUpEventNameModel[]> {
    return this.http.get<followUpEventNameModel[]>(this.Url + "api/EventConfig/getFollowUpEventNameList");

  }

  public GetServiceActionNameResponse(): Observable<serviceActionName[]> {
    return this.http.get<serviceActionName[]>(this.Url + "api/EventConfig/getServiceActionNameList");

  }

  public PostEventConfigResponse(GridData: any[]) {
    return this.http.post(this.Url + "api/EventConfig/SaveEventConfigurationScreenData", GridData);
  }
}
