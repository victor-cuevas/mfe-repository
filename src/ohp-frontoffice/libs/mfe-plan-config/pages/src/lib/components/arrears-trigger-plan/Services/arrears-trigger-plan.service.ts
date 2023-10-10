import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { ArrearsTriggerPlanDto } from '../Models/arrears-trigger-planDto.model';

@Injectable({
  providedIn: 'root'
})
export class ArrearsTriggerPlanService {

  envApiUrl !: string
  constructor(private http: HttpClient, private configService: ConfigContextService,public spinnerService: SpinnerService) {
    const mfeConfig = this.configService.getConfigContext() && this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'plan') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getArrearTriggerPlanList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsTriggerPlan/GetArrearsTriggerPlanList');
  }

  getArrearTriggerCalculationTypeList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsTriggerPlan/GetArrearsTriggerCalculationTypeList');
  }

  getArrearsTriggerContextList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsTriggerPlan/GetArrearsTriggerContextList');
  }

  getDebtSourceStatusList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsTriggerPlan/GetDebtSourceStatusList');
  }

  getFollowUpEventNameList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/ArrearsTriggerPlan/GetFollowUpEventNameList');

  }

  saveArrearTriggerPlanList(planData:ArrearsTriggerPlanDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/ArrearsTriggerPlan/SaveArrearsTriggerPlanConfigList',planData);
  }
}
