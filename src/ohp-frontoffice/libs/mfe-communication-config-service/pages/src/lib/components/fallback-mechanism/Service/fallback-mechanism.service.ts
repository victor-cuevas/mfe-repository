import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { FallbackMechanismDto } from '../Models/fallback-mechanismDto.model';

@Injectable({
  providedIn: 'root'
})
export class FallbackMechanismService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getFallBackData(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FallbackMechanism/GetFallBackMechanismScreenData');
  }

  getCommunicationMediumList(){
    return this.http.get(this.envApiUrl+'api/FallbackMechanism/GetCommunicationMediumNameList');
  }

  getFollowUpNameList(){
    return this.http.get(this.envApiUrl+'api/FallbackMechanism/GetFollowUpEventNameList');
  }

  saveFallBackData(fallBackList:FallbackMechanismDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/FallbackMechanism/SaveFallBackMechanismScreenData',fallBackList);
  }
}
