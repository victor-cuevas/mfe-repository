import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManageUserProfileScreenDto } from '../models/manage-user-profile.model';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'authorisation') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getUserProfileList(): Observable<ManageUserProfileScreenDto> {
    return this.http.get<ManageUserProfileScreenDto>(this.envApiUrl + 'api/authorisationconfigurator/manageuserprofile');
  }

  public saveUserProfile(request: ManageUserProfileScreenDto) {
    return this.http.put(this.envApiUrl + 'api/authorisationconfigurator/manageuserprofile', request);
  }
}
