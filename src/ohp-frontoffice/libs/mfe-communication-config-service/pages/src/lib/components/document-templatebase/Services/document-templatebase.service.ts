import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { DocGenTypeDto } from '../Models/docGenTypeDto.model';
import { OutputFormatDto } from '../Models/outputFormatDto.model';
import { DocGenDtoNameDto } from '../Models/docGenDtoNameDto.model';
import { DocumentTemplateTypeDto } from '../Models/documentTemplateTypeDto.model';
import { DocumentTemplatesDto } from '../Models/documentTemplatesDto.model';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
@Injectable({
  providedIn: 'root'
})
export class DocumentTemplateBaseService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getDocumentTemplateBaseScreenData(): Observable<DocumentTemplatesDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<DocumentTemplatesDto[]>(this.envApiUrl + 'api/DocumentTemplateBase/GetDocumentTemplateBaseList');
  }
  public getDocGenTypeList(): Observable<DocGenTypeDto[]> {
    return this.http.get<DocGenTypeDto[]>(this.envApiUrl + 'api/DocumentTemplateBase/GetDocGenTypeList');
  }
  public getDocumentTemplateTypesList(): Observable<DocumentTemplateTypeDto[]> {
    return this.http.get<DocumentTemplateTypeDto[]>(this.envApiUrl + 'api/DocumentTemplateBase/GetDocumentTemplateTypeList');
  }
  public getOutputFormatList(): Observable<OutputFormatDto[]> {
    return this.http.get<OutputFormatDto[]>(this.envApiUrl + 'api/DocumentTemplateBase/GetOutputFormatList');
  }
  public getDocGenDtoNameList(): Observable<DocGenDtoNameDto[]> {
    return this.http.get<DocGenDtoNameDto[]>(this.envApiUrl + 'api/DocumentTemplateBase/GetDocGenDtoNameList');
  }
  public saveDocumentTemplateBaseScreenData(DocumentTemplateBaselist: DocumentTemplatesDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/DocumentTemplateBase/SaveDocumentTemplateBaseList', DocumentTemplateBaselist);
  }
}
