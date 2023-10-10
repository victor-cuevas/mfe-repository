import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { TaxCertificateConfigType } from '../Models/taxCertificateConfig.model';

@Injectable({
  providedIn: 'root'
})
export class TaxcertificateCreditProviderService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'taxstatement') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getTaxConfig(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetTaxCertificateConfig')
  }

  getTaxCategory(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetTaxCertificateCategory')
  }

  getTaxConfigType(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetTaxCertificateConfigType')
  }

  getBalanceMovementType(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetBalanceMovementType')
  }

  getConvertedTxType(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetConvertedTxType')
  }

  getTxElType(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetTxElType')
    
  }
  getTaxCertificate(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetTaxCertificateType')
  }

  getTaxCreditProvider(){
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfig/GetCreditProviderName')
  }

  saveTaxCertificateConfig(taxData : TaxCertificateConfigType[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/TaxCertificateConfig/SaveTaxCertificateConfig',taxData)
  }
}
