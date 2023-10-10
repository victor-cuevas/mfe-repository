import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { DepotPurposeProductsDto } from '../Models/depot-purpose-product.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';

@Injectable({
  providedIn: 'root'
})
export class DepotPurposeProductService {

  envapiUrl !: string;
  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }

  getDepotData(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envapiUrl +'api/ManageCredit/DepotPurposeProduct');
  }

  saveDepotData(depotpurposeData:DepotPurposeProductsDto[]) : Observable<DepotPurposeProductsDto[]>{
    return this.http.put<DepotPurposeProductsDto[]>(this.envapiUrl +'api/ManageCredit/DepotPurposeProduct',depotpurposeData);
  }
}
