import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { DepotProductsDto, DepotTypeDto, CreditProviderDto } from '../models/depot-product.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core'


@Injectable({
  providedIn: 'root'
})
export class DepotProductService {

  protected envApiUrl: string;
  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getDepotProduct() {
    return this.http.get<DepotProductsDto>(this.envApiUrl + 'api/ManageCredit/DepotProduct');
  }

  saveDepotProduct(request: DepotProductsDto[]) {
    return this.http.put<DepotProductsDto[]>(this.envApiUrl + 'api/ManageCredit/DepotProduct', request);
  }

  getDepotType() {
    return this.http.get<DepotTypeDto[]>(this.envApiUrl + 'api/ManageCredit/DepotType');
  }

  getCreditProvider() {
    return this.http.get<CreditProviderDto[]>(this.envApiUrl + 'api/ManageCredit/CreditProvider');
  }

  deleteDepotProduct(depotProductData: DepotProductsDto[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: depotProductData
    };

    return this.http.delete(this.envApiUrl + 'api/ManageCredit/DepotProduct', options)
  }
}
