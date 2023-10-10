import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { cmRoleType2PartyQuality } from '../Models/cmRoleType2PartyQuality.model';
import { cmRoleType2PartyQualityCodeTables } from '../Models/cmRoleType2PartyQualityCodeTables.model';


@Injectable({
  providedIn: 'root'
})
export class RoleTypeService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }
  GetCodeTableResponse(): Observable<cmRoleType2PartyQualityCodeTables> {
    return this.http.get<cmRoleType2PartyQualityCodeTables>(this.envApiUrl + 'api/RoleType2PartyConfig/codetables');
  }

  GetRoleTypeListResponse(): Observable<cmRoleType2PartyQuality[]> {
    return this.http.get<cmRoleType2PartyQuality[]>(this.envApiUrl + 'api/RoleType2PartyConfig');
  }

  PutRoleTypeList(request: cmRoleType2PartyQuality[]) {
    return this.http.put(this.envApiUrl + 'api/RoleType2PartyConfig', request);
  }
}
