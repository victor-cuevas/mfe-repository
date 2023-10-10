import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { planConfigInput } from '../Models/planConfigInput.model';
import { planDerivationCriteriaConfigInitialResponse } from '../Models/planDerivationCriteriaConfigInitialResponse.model';
import { reminderPlanConfiguration } from '../Models/reminderPlanConfiguration.model';


@Injectable({
  providedIn: 'root'
})
export class ReminderPlanService {

  Url !: string
  constructor(private http: HttpClient, private configService: ConfigContextService) {
    const mfeConfig = this.configService.getConfigContext() && this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'plan') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }



  public GetPlanDerivationCriteriaConfigInitialResponse(): Observable<planDerivationCriteriaConfigInitialResponse> {
    return this.http.get<planDerivationCriteriaConfigInitialResponse>(this.Url + "api/ManageReminderPlan/GetPlanDerivationCriteriaConfigInitialResponse");

  }
  public GetReminderPlanConfigList(Data: planConfigInput) {
    return this.http.post(this.Url + "api/ManageReminderPlan/GetReminderPlanConfigList", Data);
  }

  public CopyReminderPlan(Data: reminderPlanConfiguration) {
    return this.http.post(this.Url + "api/ManageReminderPlan/CopyReminderPlan", Data);
  }

  public SaveReminderPlan(Data: reminderPlanConfiguration[]) {
    return this.http.post(this.Url + "api/ManageReminderPlan/SaveReminderPlan", Data);
  }
}
