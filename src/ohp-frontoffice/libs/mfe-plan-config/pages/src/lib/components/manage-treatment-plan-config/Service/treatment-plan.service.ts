import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { planConfigInput } from '../Models/planConfigInput.model';
import { planDerivationCriteriaConfigInitialResponse } from '../Models/planDerivationCriteriaConfigInitialResponse.model';
import { treatmentPlanConfiguration } from '../Models/treatmentPlanConfiguration.model';


@Injectable({
  providedIn: 'root'
})
export class TreatmentPlanService {

  Url !: string
  constructor(private http: HttpClient, private configService: ConfigContextService) {
    const mfeConfig = this.configService.getConfigContext() && this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'plan') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }



  public GetPlanDerivationCriteriaConfigInitialResponse(): Observable<planDerivationCriteriaConfigInitialResponse> {
    return this.http.get<planDerivationCriteriaConfigInitialResponse>(this.Url + "api/ManageTreatmentPlan/GetPlanDerivationCriteriaConfigInitialResponse");

  }
  public GetTreatmentPlanConfigList(Data: planConfigInput) {
    return this.http.post(this.Url + "api/ManageTreatmentPlan/GetTreatmentPlanConfigList", Data);
  }

  public CopyTreatmentPlan(Data: treatmentPlanConfiguration) {
    return this.http.post(this.Url + "api/ManageTreatmentPlan/CopyTreatmentPlan", Data);
  }
  
  public SaveTreatmentPlan(Data: treatmentPlanConfiguration[]) {
    return this.http.post(this.Url + "api/ManageTreatmentPlan/SaveTreatmentPlan", Data);
  }
}
