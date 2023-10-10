import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { HttpClient } from '@angular/common/http';
import { GetTxEl2BalMoveTypeMappingListDto, TxEl2BalMovTypeMappingDto } from '../model/tx-el2-bal-mov-type-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class TxEl2BalMovTypeService {

  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'runningaccount') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getTxEl2BalMoveTypeList(): Observable<GetTxEl2BalMoveTypeMappingListDto> {
    return this.http.get<GetTxEl2BalMoveTypeMappingListDto>(
      this.envApiUrl + 'api/RunningAccount/TxEl2BalMovTypeMapping'
    );
  }

  public saveTxEl2BalMovType(request: TxEl2BalMovTypeMappingDto[]) {
    return this.http.put(this.envApiUrl + 'api/RunningAccount/TxEl2BalMovTypeMapping', request)
  }
}
