import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { FollowUpEventConfigurationDto } from '../Models/followup-event-configurationDto.model';

@Injectable({
  providedIn: 'root'
})
export class FollowUpEventConfigurationService {

  envApiUrl !:string
  constructor(private http: HttpClient, private processService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getFollowUpEventConfiguration(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FollowUpEventConfiguration/getFollowUpEventConfiguration');
  }

  getFollowUpEvent(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FollowUpEventConfiguration/getFollowUpEventName');
  }

  getEventDateType(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/FollowUpEventConfiguration/getEventDateType');
  }

  saveFollowUpEventConfiguration(followUpEventData:FollowUpEventConfigurationDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/FollowUpEventConfiguration/SaveFollowUpEventConfiguration',followUpEventData);
  }
}
