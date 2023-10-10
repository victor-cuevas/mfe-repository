import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { creditSettings } from '../Models/creditSettings.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';



@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }
  GetCreditSettingResponse(): Observable<creditSettings> {
    return this.http.get<creditSettings>(this.envApiUrl + 'api/ManageCredit/CreditSetting');
  }

  PutCreditSettingResponse(request: creditSettings) {
    return this.http.put(this.envApiUrl + 'api/ManageCredit/CreditSetting', request);
  }
}
