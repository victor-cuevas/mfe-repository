import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { CommunicationMediumNameDto } from '../Models/communicationMediumNameDto.model';
import { DocumentTemplateTypeDto } from '../Models/documentTemplateTypeDto.model';
import { CommunicationMedium2DocumentTemplateDto } from '../Models/communicationMedium2DocumentTemplateDto.model';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
@Injectable({
  providedIn: 'root'
})
export class CommunicationMediumService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getCommunicationMediumScreenData(): Observable<CommunicationMedium2DocumentTemplateDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<CommunicationMedium2DocumentTemplateDto[]>(this.envApiUrl + 'api/CommunicationMedium2DocumentTemplate/GetCommunicationMedium2DocumentTemplateList');
  }
  public getCommunicationMediumNameList(): Observable<CommunicationMediumNameDto[]> {
    return this.http.get<CommunicationMediumNameDto[]>(this.envApiUrl + 'api/CommunicationMedium2DocumentTemplate/GetCommunicationMediumNameList');
  }
  public getDocumentTemplateTypeList(): Observable<DocumentTemplateTypeDto[]> {
    return this.http.get<DocumentTemplateTypeDto[]>(this.envApiUrl + 'api/CommunicationMedium2DocumentTemplate/GetDocumentTemplateTypeList');
  }
  public saveCommunicationMediumScreenData(CommunicationMediumlist: CommunicationMedium2DocumentTemplateDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/CommunicationMedium2DocumentTemplate/SaveCommunicationMedium2DocumentTemplateList', CommunicationMediumlist);
  }
}
