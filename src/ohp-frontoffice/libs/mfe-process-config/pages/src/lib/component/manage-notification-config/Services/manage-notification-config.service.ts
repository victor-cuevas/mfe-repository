import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService} from '@close-front-office/mfe-process-config/core'
import { Observable } from 'rxjs';
import { NotificationConfigDto } from '../Models/notification-config.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
@Injectable({
  providedIn: 'root'
})
export class ManageNotificationConfigService {

  envapiUrl !: string;
  constructor(private http: HttpClient, private processService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }

  getNotificationData(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envapiUrl+'api/ManageNotificationConfig/getManagenotification')
  }
  saveNotification(notificationList:NotificationConfigDto[]):Observable<NotificationConfigDto[]>{
    return this.http.put<NotificationConfigDto[]>(this.envapiUrl+'api/ManageNotificationConfig/saveManagenotification',notificationList);
  }
}
