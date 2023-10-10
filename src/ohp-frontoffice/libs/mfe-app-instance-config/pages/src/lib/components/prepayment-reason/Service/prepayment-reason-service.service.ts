import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { prepaymentReasonDef } from '../Models/prepaymentReasonDef';


@Injectable({
  providedIn: 'root'
})
export class PrepaymentReasonService {
  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }
  GetPrePaymentReasonResponse(): Observable<prepaymentReasonDef[]> {
    return this.http.get<prepaymentReasonDef[]>(this.envApiUrl + 'api/ManageCredit/PrepaymentReasonDefinition');
  }

  PutPrePaymentReasonResponse(request: prepaymentReasonDef[]) {
    return this.http.put(this.envApiUrl + 'api/ManageCredit/PrepaymentReasonDefinition', request);
  }
}
