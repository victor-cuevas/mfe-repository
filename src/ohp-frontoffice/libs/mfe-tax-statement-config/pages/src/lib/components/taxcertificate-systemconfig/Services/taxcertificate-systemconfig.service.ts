import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { TaxCertificateSystemConfigDto } from '../Models/taxcertificate-systemconfigDto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxcertificateSystemconfigService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'taxstatement') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getTaxCertificateSystemConfig(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/TaxCertificateSystemConfig/GetTaxCertificateSystemConfig')
  }

  getCommunicationMediumList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/TaxCertificateSystemConfig/GetCommunicationMediumName')
  }

  saveTaxCertificateSystemConfig(systemConfigData:TaxCertificateSystemConfigDto):Observable<TaxcertificateSystemconfigService>{
    this.spinnerService.setIsLoading(true);
    return this.http.post<TaxcertificateSystemconfigService>(this.envApiUrl+'api/TaxCertificateSystemConfig/SaveTaxCertificateSystemConfig',systemConfigData)
  }
}
