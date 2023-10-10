import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { PeriodicityDto } from '../Models/periodicityDto.model';
import { PeriodicityConfigForAccountingModuleDto } from '../Models/periodicityconfigforaccountingmoduleDto.model';
import { FinancialAmortizationTypeDto } from '../Models/financialamortizationtypeDto.model';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
@Injectable({
  providedIn: 'root'
})
export class PeriodicityService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getPeriodicityScreenData(): Observable<PeriodicityConfigForAccountingModuleDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<PeriodicityConfigForAccountingModuleDto[]>(this.envApiUrl + 'api/PeriodicityConfig/GetPeriodicityConfigForAccountingModule');
  }
  public getPeriodicityNameList(): Observable<PeriodicityDto[]> {
    return this.http.get<PeriodicityDto[]>(this.envApiUrl + 'api/PeriodicityConfig/GetPeriodicity');
  }

  public getFinancialAmortizationTypeList(): Observable<FinancialAmortizationTypeDto[]> {
    return this.http.get<FinancialAmortizationTypeDto[]>(this.envApiUrl + 'api/PeriodicityConfig/GetFinancialAmortizationType');
  }

  public savePeriodicityScreenData(periodicitylist: PeriodicityConfigForAccountingModuleDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/PeriodicityConfig/SavePeriodicityConfigForAccountingModule', periodicitylist);
  }
}
