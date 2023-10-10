import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManageIndexationConfigInitialDataDto, SaveManageIndexationConfigDto } from '../models/manage-indexation.model';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class IndexationService {

  protected envApiUrl: string;


  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'asset') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getManageIndexation(): Observable<ManageIndexationConfigInitialDataDto> {
    return this.http.get<ManageIndexationConfigInitialDataDto>(this.envApiUrl + 'api/AssetConfig/manageindexation');
  }

  public saveManageIndexation(request: SaveManageIndexationConfigDto) {
    return this.http.put(this.envApiUrl + 'api/AssetConfig/manageindexation', request);
  }

}
