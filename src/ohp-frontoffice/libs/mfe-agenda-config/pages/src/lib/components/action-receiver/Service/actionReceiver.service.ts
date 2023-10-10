import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionReceiver } from '../Model/actionReceiver.model';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core'
import { Observable } from 'rxjs';
import { ResponseActionReceiver } from '../Model/responseActionReceiver';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class ActionReceiverService {
  protected Url: string;

  constructor(private http: HttpClient, public commonService: ConfigContextService, public spinnerService:SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'agenda') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }


  public GetResponse():Observable<ResponseActionReceiver> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<ResponseActionReceiver>(this.Url +"api/ActionReceiver/GetActionReceiverScreenData");
  }

  public PostResponse(GridData: ActionReceiver[]) {
    return this.http.post(this.Url + "api/ActionReceiver/SaveActionReceiverScreenData", GridData);
  }
}
