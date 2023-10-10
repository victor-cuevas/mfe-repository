import { HttpClient } from '@angular/common/http';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { interestMediation } from '../Models/interestMediationSurcharge.model';
import { rateAdaptationName } from '../Models/rateAdaptationName.model';

@Injectable({
  providedIn: 'root'
})
export class InterestMediationService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getInterestMediation(): Observable<interestMediation[]> {
    return this.http.get<interestMediation[]>(this.envApiUrl + 'api/InterestMediationSurcharge/GetInterestMediationSurcharge');
  }
  public getRateAdaptation(): Observable<rateAdaptationName[]> {
    return this.http.get<rateAdaptationName[]>(this.envApiUrl + 'api/InterestMediationSurcharge/GetRateAdaptationName');
  }
  public saveInterestMediation(interestMediationlist: interestMediation[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/InterestMediationSurcharge/SaveInterestMediationSurcharge', interestMediationlist);
  }
}
