import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { CommunicationOutcome2DossierStatusListDto } from '../Models/communication-outcome2-dossierStatusListDto.model';

@Injectable({
  providedIn: 'root'
})
export class CommunicationOutcomeService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getCommunicationOutcome2DossierStatusList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl + 'api/CommunicationOutcome2DossierStatus/GetCommunicationOutcome2DossierStatusList');
  }

  getDossierStatusList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl + 'api/CommunicationOutcome2DossierStatus/GetDossierStatusList');
  }

  getSubStatusList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl + 'api/CommunicationOutcome2DossierStatus/GetSubStatusList');
  }

  getCommunicationOutcomeList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl + 'api/CommunicationOutcome2DossierStatus/GetCommunicationOutcomeList');
  }

  getDossierPhaseList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl + 'api/CommunicationOutcome2DossierStatus/GetDossierPhaseList');
  }

  saveCommunicationOutcome2DossierStatusList(commOutcomeDossierList:CommunicationOutcome2DossierStatusListDto){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl + 'api/CommunicationOutcome2DossierStatus/SaveCommunicationOutcome2DossierStatusList',commOutcomeDossierList);
  }
}
