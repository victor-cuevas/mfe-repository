import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { TaxCertificateConfigTypeMappingDto } from '../Models/taxcertificateconfig-typemappingDto.model';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
@Injectable({
  providedIn: 'root'
})
export class TaxcertificateTypemappingService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'taxstatement') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getTaxCertificateConfigTypeMapping(){
    this.spinnerService.setIsLoading(true);
   return this.http.get(this.envApiUrl+'api/TaxCertificateConfigTypeMapping/GetTaxCertificateConfigTypeMapping')
  }

  getTaxCertificateConfigTypeList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfigTypeMapping/GetTaxCertificateConfigType')
  }

  getTaxCertificateCategoryList(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/TaxCertificateConfigTypeMapping/GetTaxCertificateCategory')
  }

  saveTaxCertificateConfigTypeMapping(typeMappingList:TaxCertificateConfigTypeMappingDto[]){
    return this.http.post(this.envApiUrl+'api/TaxCertificateConfigTypeMapping/SaveTaxCertificateConfigTypeMapping',typeMappingList)
  }
  
}
