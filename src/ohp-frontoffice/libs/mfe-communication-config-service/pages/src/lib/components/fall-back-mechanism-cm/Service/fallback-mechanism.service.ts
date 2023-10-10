import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { FallbackMechanismDto } from '../Models/fallback-mechanism-dto.model'

@Injectable({
  providedIn: 'root'
})
export class CmFallbackMechanismService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService, private spinnerService: SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getFallBackData() {
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl + 'api/CMFallbackMechanism/GetFallBackMechanismScreenData');
  }

  getCommunicationMediumList() {
    return this.http.get(this.envApiUrl + 'api/CMFallbackMechanism/GetCommunicationMediumNameList');
  }

  getFollowUpNameList() {
    return this.http.get(this.envApiUrl + 'api/CMFallbackMechanism/GetFollowUpEventNameList');
  }

  saveFallBackData(fallBackList: FallbackMechanismDto[]) {
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl + 'api/CMFallbackMechanism/SaveFallBackMechanismScreenData', fallBackList);
  }
}
