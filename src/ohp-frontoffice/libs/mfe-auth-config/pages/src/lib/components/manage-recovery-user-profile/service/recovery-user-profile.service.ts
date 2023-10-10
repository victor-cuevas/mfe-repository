import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { GetRecoveryUserProfileScreenDto, RecoveryUserProfileDto, RecoveryUserProfileScreenDto } from '../models/recovery-user-profile.model';
@Injectable({
  providedIn: 'root'
})
export class RecoveryUserProfileService {
  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'authorisation') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getUserProfileScreenData(): Observable<GetRecoveryUserProfileScreenDto> {
    return this.http.get<GetRecoveryUserProfileScreenDto>(
      this.envApiUrl + 'api/RecoveryUserConfig/GetRecoveryManageUserProfileScreenDetail'
    );
  }

  public getUserProfiles(): Observable<RecoveryUserProfileDto[]> {
    return this.http.get<RecoveryUserProfileDto[]>(
      this.envApiUrl + 'api/RecoveryUserConfig/GetListOfUserProfileDetail'
    );
  }

  public saveUserProfiles(request: RecoveryUserProfileScreenDto) {
    return this.http.put(
      this.envApiUrl + 'api/authorisationconfigurator/recoveryuserprofile', request
    );
  }

}
