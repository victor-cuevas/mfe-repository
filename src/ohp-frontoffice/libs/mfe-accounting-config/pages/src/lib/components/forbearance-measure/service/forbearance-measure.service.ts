import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { ForbearanceMeasureConfigDto, ForbearanceMeasureTypeDto } from '../models/forbearance-measure.model';

@Injectable({
  providedIn: 'root'
})
export class ForbearanceMeasureService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getForbearanceMeasure(): Observable<ForbearanceMeasureConfigDto[]> {
    return this.http.get<ForbearanceMeasureConfigDto[]>(this.envApiUrl + 'api/ForbearanceMeasureConfig/GetAllForbearanceMeasureConfigList');
  }

  public getForbearanceMeasureType(): Observable<ForbearanceMeasureTypeDto[]> {
    return this.http.get<ForbearanceMeasureTypeDto[]>(this.envApiUrl + 'api/ForbearanceMeasureConfig/GetForbearanceMeasureTypeList');
  }

  public saveForbearanceMeasure(request: ForbearanceMeasureConfigDto[]) {
    return this.http.post(this.envApiUrl + 'api/ForbearanceMeasureConfig/SaveForbearanceMeasureConfigList', request);
  }
}
