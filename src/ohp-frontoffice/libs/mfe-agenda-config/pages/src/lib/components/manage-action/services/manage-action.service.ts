import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AllActionDto } from '../models/manage-action.model';
import { ActionDto } from '../models/action.model';
import { SpinnerService} from '@close-front-office/mfe-agenda-config/core'
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class ManageActionService {
  protected envApiUrl : string


  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService:SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'agenda') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getManageActions(): Observable<AllActionDto> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<AllActionDto>( this.envApiUrl+ 'api/ManageAction/GetManageActionScreenData');
  }

  saveManageAction(request: any): Observable<ActionDto[]> {
    return this.http.post<ActionDto[]>(this.envApiUrl+ 'api/ManageAction/SaveManageActionScreenData', request);
  }
}
