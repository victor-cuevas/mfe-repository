import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { feeConfig } from '../Models/feeConfig.model';
import { getManageFeeConfigScreenDataResponse } from '../Models/getFeeConfig.model';


@Injectable({
  providedIn: 'root'
})
export class FeeConfigService {

  Url !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'financial') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }



  public GetFeeConfigResponse(): Observable<getManageFeeConfigScreenDataResponse> {
    return this.http.get<getManageFeeConfigScreenDataResponse>(this.Url + "api/ManageFeeConfig/GetManageFeeConfigInitialData");

  }

  public PostFeeConfigResponse(GridData: feeConfig[]) {
    return this.http.post(this.Url + "api/ManageFeeConfig/SaveManageFeeConfigScreenData", GridData);
  }
}
