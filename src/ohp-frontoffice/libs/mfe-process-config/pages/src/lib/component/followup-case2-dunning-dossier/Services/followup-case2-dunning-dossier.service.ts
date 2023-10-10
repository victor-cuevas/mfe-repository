import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { FollowUpCaseStatus2DunningDossierStatusConfigDto } from '../Models/followUp-caseStatus-dunningDossierStatusDto.model';

@Injectable({
  providedIn: 'root'
})
export class FollowupCase2DunningDossierService {

  envApiUrl !:string
  constructor(private http: HttpClient, private processService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getDossierStatus(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FollowUpCaseStatus2DunningDossierStatusConfig/getDossierStatus');
  }

  getFollowUpCaseStatus(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FollowUpCaseStatus2DunningDossierStatusConfig/getFollowUpCaseStatus');
  }

  getFollowUpCaseStatusDunningDossierStatus(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FollowUpCaseStatus2DunningDossierStatusConfig/getFollowUpCaseStatus2DunningDossierStatusConfig');
  }

  saveFollowUpCaseStatusDunningDossierStatus(dunningdossierList: FollowUpCaseStatus2DunningDossierStatusConfigDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/FollowUpCaseStatus2DunningDossierStatusConfig/SaveFollowUpCaseStatus2DunningDossierStatusConfig',dunningdossierList);
  }

}
