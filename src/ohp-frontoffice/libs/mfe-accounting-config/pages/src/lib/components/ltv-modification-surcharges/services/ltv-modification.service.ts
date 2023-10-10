import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { ltvModification } from '../Models/ltvModification.model';
import { rateAdaptationName } from '../Models/rateAdaptationName.model';

@Injectable({
  providedIn: 'root'
})
export class LtvModificationService {
  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getltvModification(): Observable<ltvModification[]> {
    return this.http.get<ltvModification[]>(this.envApiUrl + 'api/LtvModificationSurcharge/GetLTVModificationSurcharges');
  }
  public getltvRateAdaptation(): Observable<rateAdaptationName[]> {
    return this.http.get<rateAdaptationName[]>(this.envApiUrl + 'api/LtvModificationSurcharge/GetRateAdaptationName');
  }
  public saveltvModification(ltvModificationlist: ltvModification[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/LtvModificationSurcharge/SaveLTVModificationSurcharges', ltvModificationlist);
  }
}
