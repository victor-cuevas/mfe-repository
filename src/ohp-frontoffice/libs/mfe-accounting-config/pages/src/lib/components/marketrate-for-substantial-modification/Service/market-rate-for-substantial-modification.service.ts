import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { marketRateForSubstantialModification } from '../Models/marketRateForSubstantialModification.model';

@Injectable({
  providedIn: 'root'
})
export class MarketRateForSubstantialModificationService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getMarketRate(): Observable<marketRateForSubstantialModification[]> {
    return this.http.get<marketRateForSubstantialModification[]>(this.envApiUrl + 'api/MarketRateForSubstantialModification/GetAllMarketRateForSubstantialModificationList');
  }
 
  public saveMarketRate(MarketRateList: marketRateForSubstantialModification[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/MarketRateForSubstantialModification/SaveMarketRateForSubstantialModificationList', MarketRateList);
  }
}
