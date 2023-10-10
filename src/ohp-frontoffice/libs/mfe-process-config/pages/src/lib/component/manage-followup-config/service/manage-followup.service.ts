import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FollowUpConfigScreenDto, FollowUpProcedureDto, FollowUpSearchCriteriaDto, ResponseListBaseOfFollowUpProcedureDto } from '../models/manage-followup.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
@Injectable({
  providedIn: 'root'
})
export class ManageFollowupService {

  protected envApiUrl: string


  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;    
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getFollowUpScreenData(): Observable<FollowUpConfigScreenDto> {
    return this.http.get<FollowUpConfigScreenDto>(this.envApiUrl + 'api/FollowUpConfig/GetFollowUpConfigScreenData');
  }

  public getFollowUpSearchData(request: any): Observable<ResponseListBaseOfFollowUpProcedureDto> {
    return this.http.post<ResponseListBaseOfFollowUpProcedureDto>(this.envApiUrl + 'api/FollowUpConfig/GetFollowupProcedure', request);
  }

  public deleteFollowUpData(request: number) {
    return this.http.delete(this.envApiUrl + 'api/FollowUpConfig/DeleteFollowupProcedure?request=' + request)
  }

  public saveFollowUpData(request: FollowUpProcedureDto) {
    return this.http.post(this.envApiUrl + 'api/FollowUpConfig/SaveFollowupProcedure', request)
  }
}
