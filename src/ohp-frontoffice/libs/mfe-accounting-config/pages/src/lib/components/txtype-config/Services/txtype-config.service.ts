import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { TxTypeDto } from '../Models/txtypeDto.model';
import { TxTypeConfigDto } from '../Models/txtypeconfigDto.model';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
@Injectable({
  providedIn: 'root'
})
export class TxTypeService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getTxTypeScreenData(): Observable<TxTypeConfigDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<TxTypeConfigDto[]>(this.envApiUrl + 'api/TxTypeConfig/GetTxTypeConfigList');
  }
  public getTxTypeNameList(): Observable<TxTypeDto[]> {
    return this.http.get<TxTypeDto[]>(this.envApiUrl + 'api/TxTypeConfig/GetTxType');
  }
  public saveTxTypeScreenData(TxTypelist: TxTypeConfigDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/TxTypeConfig/SaveTxTypeConfigList', TxTypelist);
  }
}
