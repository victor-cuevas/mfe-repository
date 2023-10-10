import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { ArrearsConfigurationDto } from '../Models/arrears-configurationDto.model';

@Injectable({
  providedIn: 'root'
})
export class ArrearsConfigurationService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getArrearsConfigurationList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsConfiguration/GetArrearsConfigurationList');
  }

  getTxElTypeList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsConfiguration/GetTxElTypeList')
  }

  SaveArrearsConfigurationList(arrearConfigList:ArrearsConfigurationDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/ArrearsConfiguration/SaveArrearsConfigurationList',arrearConfigList)
  }
}
