import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { CreditProviderNameDto } from '../Models/creditprovidernameDto.model';
import { CreditProviderConfigForAccountingModuleDto } from '../Models/creditproviderconfigforaccountingmoduleDto.model';
import { FinancialAmortizationTypeDto } from '../Models/financialamortizationtypeDto.model';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
@Injectable({
  providedIn: 'root'
})
export class CreditProviderService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getCreditProviderScreenData(): Observable<CreditProviderConfigForAccountingModuleDto[]>{
    this.spinnerService.setIsLoading(true);
    return this.http.get<CreditProviderConfigForAccountingModuleDto[]>(this.envApiUrl + 'api/CreditProviderConfig/GetCreditProviderConfigForAccountingModule');
  }
  public getCreditProviderNameList():Observable<CreditProviderNameDto[]>{
    return this.http.get<CreditProviderNameDto[]>(this.envApiUrl + 'api/CreditProviderConfig/GetCreditProviderName');
  }

  public getFinancialAmortizationTypeList():Observable<FinancialAmortizationTypeDto[]>{
    return this.http.get<FinancialAmortizationTypeDto[]>(this.envApiUrl + 'api/CreditProviderConfig/GetFinancialAmortizationType');
  } 

  public saveCreditProviderScreenData(creditProviderlist:CreditProviderConfigForAccountingModuleDto[]):Observable<boolean>{
    return this.http.post<boolean>(this.envApiUrl + 'api/CreditProviderConfig/SaveCreditProviderConfigForAccountingModule',creditProviderlist);
  }
}
