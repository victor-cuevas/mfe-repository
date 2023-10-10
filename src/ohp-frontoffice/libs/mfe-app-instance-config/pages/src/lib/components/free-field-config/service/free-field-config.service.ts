import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { CmFreeFieldConfigDto, GetFreeFieldConfigScreenDto } from '../models/free-field-config.model';

@Injectable({
  providedIn: 'root'
})
export class FreeFieldConfigService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getFreeFieldConfigScreenData(): Observable<GetFreeFieldConfigScreenDto> {
    return this.http.get<GetFreeFieldConfigScreenDto>(this.envApiUrl + 'api/FreeFieldConfig/codetables');
  }

  public getFreeFieldConfig(): Observable<CmFreeFieldConfigDto[]> {
    return this.http.get<CmFreeFieldConfigDto[]>(this.envApiUrl + 'api/FreeFieldConfig');
  }

  public saveFreeFieldConfig(request: CmFreeFieldConfigDto[]): Observable<CmFreeFieldConfigDto[]> {
    return this.http.put<CmFreeFieldConfigDto[]>(this.envApiUrl + 'api/FreeFieldConfig', request);
  }
}
