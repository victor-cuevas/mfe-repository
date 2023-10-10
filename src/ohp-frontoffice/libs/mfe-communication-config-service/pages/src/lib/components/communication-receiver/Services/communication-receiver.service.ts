import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { CommunicationReceiverDto } from '../Models/communicationReceiverDto.model';
import { RoleTypeDto } from '../Models/roleTypeDto.model';
import { CommunicationReceiver2RoleTypeDto } from '../Models/communicationReceiver2RoleTypeDto.model';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
@Injectable({
  providedIn: 'root'
})
export class CommunicationReceiverService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getCommunicationReceiverScreenData(): Observable<CommunicationReceiver2RoleTypeDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<CommunicationReceiver2RoleTypeDto[]>(this.envApiUrl + 'api/CommunicationReceiver2RoleType/GetCommunicationReceiver2RoleTypeList');
  }
  public getCommunicationReceiverList(): Observable<CommunicationReceiverDto[]> {
    return this.http.get<CommunicationReceiverDto[]>(this.envApiUrl + 'api/CommunicationReceiver2RoleType/GetCommunicationReceiverList');
  }
  public getRoleTypeList(): Observable<RoleTypeDto[]> {
    return this.http.get<RoleTypeDto[]>(this.envApiUrl + 'api/CommunicationReceiver2RoleType/GetRoleTypeList');
  }
  public saveCommunicationReceiverScreenData(CommunicationReceiverlist: CommunicationReceiver2RoleTypeDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/CommunicationReceiver2RoleType/SaveCommunicationReceiver2RoleTypeList', CommunicationReceiverlist);
  }
}
