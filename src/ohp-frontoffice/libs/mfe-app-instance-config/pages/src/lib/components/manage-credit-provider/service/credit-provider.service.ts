import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { CountryDto, FilterBannedACCriteriaDto, FilterTrustedDomesticAccountCriteriaDto, FilterTrustedIBANCriteriaDto, GetCreditProviderRefCodeData, GetCreditProviderSettingsDto, GetPostalCodeCityRequest, SaveCreditProviderSettingDto, SearchPostalCodeCityRequest } from '../model/credit-provider.model';

@Injectable({
  providedIn: 'root'
})
export class CreditProviderService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getCreditProviderData(): Observable<GetCreditProviderSettingsDto> {
    return this.http.get<GetCreditProviderSettingsDto>(this.envApiUrl + 'api/CreditProviderConfig/GetCreditProviderSetting');
  }

  public searchBannedAccount(request: FilterBannedACCriteriaDto) {
    return this.http.post(this.envApiUrl + 'api/CreditProviderConfig/SearchBannedAccounts', request);
  }

  public searchTrustedDomesticAccount(request: FilterTrustedDomesticAccountCriteriaDto) {
    return this.http.post(this.envApiUrl + 'api/CreditProviderConfig/SearchTrustedDomesticAccounts', request);
  }

  public searchTrustedIBANAccount(request: FilterTrustedIBANCriteriaDto) {
    return this.http.post(this.envApiUrl + 'api/CreditProviderConfig/SearchTrustedIBanAccounts', request);
  }

  public getBICCodes(): Observable<string[]> {
    return this.http.get<string[]>(this.envApiUrl + 'api/CreditProviderConfig/GetBICCodes')
  }

  public getCountryList(): Observable<CountryDto[]> {
    return this.http.get<CountryDto[]>(this.envApiUrl + 'api/CreditProviderConfig/GetCountryList')
  }

  public getPostalCodeCity(request: GetPostalCodeCityRequest) {
    return this.http.post(this.envApiUrl + 'api/CreditProviderConfig/GetPostalCodeCity',request)
  }

  public getCreditProviderRefCodeData(): Observable<GetCreditProviderRefCodeData> {
    return this.http.get<GetCreditProviderRefCodeData>(this.envApiUrl + 'api/CreditProviderConfig/GetCreditProviderRefCodes')
  }

  public searchPostalCodeCity(request: SearchPostalCodeCityRequest) {
    return this.http.post(this.envApiUrl + 'api/CreditProviderConfig/SearchPostalCodeCity',request)
  }

  public saveCreditProviderData(request: SaveCreditProviderSettingDto): Observable<GetCreditProviderSettingsDto> {
    return this.http.put<GetCreditProviderSettingsDto>(this.envApiUrl + 'api/CreditProviderConfig/SaveCreditProviderSetting', request);
  }
}
