import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetManageUserAssociationsResponseDto, SearchUserRequestDto, UserDto } from '../models/manage-user.model';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {
  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'authorisation') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getUserAssociations(): Observable<GetManageUserAssociationsResponseDto> {
    return this.http.get<GetManageUserAssociationsResponseDto>(
      this.envApiUrl + 'api/authorisationconfigurator/manageuser/userassociations'
    );
  }

  public searchUsers(request?: SearchUserRequestDto) {
    return this.http.get(
      this.envApiUrl +
      'api/authorisationconfigurator/manageuser/search?employeeNr=' +
      request?.employeeNr +
      '&lastName=' +
      request?.lastName +
      '&userName=' +
      request?.userName
    );
  }

  public saveUsers(request: UserDto[]) {
    return this.http.put(this.envApiUrl + 'api/authorisationconfigurator/manageuser', request);
  }
}
