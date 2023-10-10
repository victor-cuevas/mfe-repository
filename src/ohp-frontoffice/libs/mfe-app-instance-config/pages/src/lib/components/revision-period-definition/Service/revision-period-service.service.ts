import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { revisionPeriodDef } from '../Models/revisionPeriodDef.model';
import { revisionPeriodDefList } from '../Models/revisionPeriodDefList.model';


@Injectable({
  providedIn: 'root'
})
export class RevisionPeriodService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }
  GetRevisionPeriodResponse(): Observable<revisionPeriodDefList> {
    return this.http.get<revisionPeriodDefList>(this.envApiUrl + 'api/ManageCredit/RevisionPeriodDefinition');
  }

  PutRevisionPeriodResponse(request: revisionPeriodDef[]) {
    return this.http.put(this.envApiUrl + 'api/ManageCredit/RevisionPeriodDefinition', request);
  }
}
