import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { GetRecoveryUserAssociationsResponseDto, RecoveryUserDto, SearchUsersRequestDto } from '../models/recovery-user.model';

@Injectable({
  providedIn: 'root'
})
export class RecoveryUserService {
  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'authorisation') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  // public getUserAssociations(): Observable<GetRecoveryUserAssociationsResponseDto> {
  //   return this.http.get<GetRecoveryUserAssociationsResponseDto>(
  //     this.envApiUrl + 'api/authorisationconfigurator/recoveryuser/userassociations'
  //   );
  // }

  public getLanguageList(){
    return this.http.get(this.envApiUrl+'api/RecoveryUserConfig/GetLanguageList');
  }

  public getUser2UserProfileLimitationTypeList(){
    return this.http.get(this.envApiUrl+'api/RecoveryUserConfig/GetUser2UserProfileLimitationTypeList');
  }

  public getUserProfileList(){
    return this.http.get(this.envApiUrl+'api/RecoveryUserConfig/GetUserProfileList');
  }

  public getActionReceiverList(){
    return this.http.get(this.envApiUrl+'api/RecoveryUserConfig/GetActionReceiverList');
  }

  public getServicingLabelRefList(){
    return this.http.get(this.envApiUrl+'api/RecoveryUserConfig/GetServicingLabelRefList');
  }

  public getUserData(request: SearchUsersRequestDto) {
    return this.http.post(
      this.envApiUrl + 'api/authorisationconfigurator/recoveryuser/search', request
    );
  }

  public saveUserData(request: RecoveryUserDto[]) {
    return this.http.put(
      this.envApiUrl + 'api/authorisationconfigurator/recoveryuser', request
    );
  }
}
