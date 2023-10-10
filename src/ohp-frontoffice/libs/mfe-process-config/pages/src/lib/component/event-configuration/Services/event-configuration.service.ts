import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { EventConfigurationDto } from '../Models/event-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class EventConfigurationService {

  envApiUrl !:string
  constructor(private http: HttpClient, private processService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getEventConfiguration(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/EventConfiguration/getEventConfiguration');
  }
 
  getServiceActionName(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/EventConfiguration/getServiceActionName');
  }

  getFollowUpEventName(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/EventConfiguration/getFollowUpEventName');
  }

  saveEventConfiguration(eventConfigList:EventConfigurationDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/EventConfiguration/SaveEventConfiguration',eventConfigList)
  }
}
