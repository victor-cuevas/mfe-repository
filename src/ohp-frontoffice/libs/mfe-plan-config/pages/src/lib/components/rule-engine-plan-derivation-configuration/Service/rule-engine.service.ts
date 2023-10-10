import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { costPlanRef } from '../../manage-remainder-plan-config/Models/costPlanRef.model';
import { reminderPlanRef } from '../../manage-remainder-plan-config/Models/reminderPlanRef.model';
import { paymentAllocationPlanRef } from '../../manage-treatment-plan-config/Models/paymentAllocationPlanRef.model';
import { ruleEnginePlanDerivationConfig } from '../Models/ruleEnginePlanDerivationConfig.model';
import { treatmentPlanRef } from '../Models/treatmentPlanRef.model';


@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {

  Url !: string
  constructor(private http: HttpClient, private configService: ConfigContextService) {
    const mfeConfig = this.configService.getConfigContext() && this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'plan') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }

  public GetRuleEngineList(): Observable<ruleEnginePlanDerivationConfig[]> {
    return this.http.get<ruleEnginePlanDerivationConfig[]>(this.Url + "api/RuleEnginePlanDerivation/GetRuleEnginePlanDerivationConfigList");

  }
  
  public GetTreatmentPlanList(): Observable<treatmentPlanRef[]> {
    return this.http.get<treatmentPlanRef[]>(this.Url + "api/RuleEnginePlanDerivation/GetTreatmentPlanNameList");

  }

  public GetReminderPlanList(): Observable<reminderPlanRef[]> {
    return this.http.get<reminderPlanRef[]>(this.Url + "api/RuleEnginePlanDerivation/GetReminderPlanNameList");

  }

  public GetCostPlanList(): Observable<costPlanRef[]> {
    return this.http.get<costPlanRef[]>(this.Url + "api/RuleEnginePlanDerivation/GetCostPlanNameList");

  }
  public GetPaymentAllocationPlanList(): Observable<paymentAllocationPlanRef[]> {
    return this.http.get<paymentAllocationPlanRef[]>(this.Url + "api/RuleEnginePlanDerivation/GetPaymentAllocationPlanNameList");

  }

  public SaveRuleEngine(Data: ruleEnginePlanDerivationConfig[]) {
    return this.http.post(this.Url + "api/RuleEnginePlanDerivation/SaveRuleEnginePlanDerivationConfigList", Data);
  }
}
