import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterAgenda } from '../Model/masterAgenda.model';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core'
import { Observable } from 'rxjs';
import { ResponseMasterAgenda } from '../Model/responseMasterAgenda.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class MasterAgendaService {
  protected Url: string;

  constructor(private http: HttpClient, public commonService: ConfigContextService, public spinnerService:SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'agenda') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }

  public GetResponse() :Observable<ResponseMasterAgenda> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<ResponseMasterAgenda>(this.Url +"api/MasterAgenda/GetMasterAgendaScreenData");
  }
  public PostResponse(GridData: MasterAgenda[]) {
    return this.http.post(this.Url + "api/MasterAgenda/SaveMasterAgendaScreenData", GridData);
  }
}
