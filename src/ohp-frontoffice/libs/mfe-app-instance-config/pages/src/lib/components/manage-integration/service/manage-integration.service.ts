import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FreeFieldConfigDto, GetManageFreeFieldConfigScreenDataResponseDto } from '../model/manage-integration.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class ManageIntegrationService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getManageIntegrationData(): Observable<GetManageFreeFieldConfigScreenDataResponseDto> {
    return this.http.get<GetManageFreeFieldConfigScreenDataResponseDto>(this.envApiUrl + 'api/ManageIntegrationDataFieldsConfiguration/GetManageFreeFieldConfigInitialData');
  }

  public saveManageIntegration(request: FreeFieldConfigDto[]) {
    return this.http.post(this.envApiUrl + 'api/ManageIntegrationDataFieldsConfiguration/SaveManageFreeFieldConfigData', request);
  }
}
