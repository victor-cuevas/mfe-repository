import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { HttpClient } from '@angular/common/http';
import { CodetableParameterDto } from '../Models/codetableParameterDto.model';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
@Injectable({
  providedIn: 'root'
})
export class CodeTableParameterService {


  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getCodetableParamList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/CodetableParam');
  }

  getCodeTableValues(tblName:string | null){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/CodetableParam/codetablevalue?tblName='+tblName+'');

  }

  getCodetableNameList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/CodetableParam/codetablename');
  }

  saveCodeTableParamList(codeTableParamList:CodetableParameterDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.put(this.envApiUrl+'api/CodetableParam',codeTableParamList);
  }
  
}
