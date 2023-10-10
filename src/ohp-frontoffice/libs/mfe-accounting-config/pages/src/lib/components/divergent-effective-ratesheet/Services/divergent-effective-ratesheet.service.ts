import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { DivergentEffectiveRateSheetDto } from '../Models/divergenteffectiveratesheetDto.model';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
@Injectable({
  providedIn: 'root'
})
export class DivergentEffectiveRateService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getDivergentEffectiveRateScreenData(): Observable<DivergentEffectiveRateSheetDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<DivergentEffectiveRateSheetDto[]>(this.envApiUrl + 'api/DivergentEffectiveRate/GetAllDivergentEffectiveRateSheetList');
  }

  public saveDivergentEffectiveRateScreenData(divergentEffectiveRatelist: DivergentEffectiveRateSheetDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/DivergentEffectiveRate/SaveDivergentEffectiveRateSheet', divergentEffectiveRatelist);
  }
}
