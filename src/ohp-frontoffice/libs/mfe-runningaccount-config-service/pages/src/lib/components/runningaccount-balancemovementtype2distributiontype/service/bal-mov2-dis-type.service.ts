import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { HttpClient } from '@angular/common/http';
import { BalMovementType2DistTypeDto, GetBalMovementType2DistTypeListDto } from '../models/bal-mov2-dis-type.model';
@Injectable({
  providedIn: 'root'
})
export class BalMov2DisTypeService {

  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'runningaccount') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getBalMov2DisTypeList(): Observable<GetBalMovementType2DistTypeListDto> {
    return this.http.get<GetBalMovementType2DistTypeListDto>(
      this.envApiUrl + 'api/RunningAccount/BalanceMovementType2DistributionType'
    );
  }

  public saveBalMov2DisType(request: BalMovementType2DistTypeDto[]) {
    return this.http.put(this.envApiUrl + 'api/RunningAccount/BalanceMovementType2DistributionType', request)
  }
}
