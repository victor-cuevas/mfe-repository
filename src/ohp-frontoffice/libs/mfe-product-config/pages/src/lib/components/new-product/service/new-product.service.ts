import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { productCodeTables } from '../Models/productCodeTables.model';
import { productPrecomputed } from '../Models/productPrecomputed.model';
import { productRevolving } from '../Models/productRevolving.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
@Injectable({
  providedIn: 'root'
})
export class NewProductService {

  public Url!: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }

  codeTableResponse(): Observable<productCodeTables> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<productCodeTables>(this.Url + "api/Product/GetProdctCodeTablesDetails");
  }
  getPrecomputedresponse(pkey: number): Observable<productPrecomputed>  {
   
    return this.http.get<productPrecomputed>(this.Url + "api/Product/GetProductPrecomputedDetails?productPKey=" + pkey);
  }

  getRevolvingresponse(pkey: number): Observable<productRevolving> {
   
    return this.http.get<productRevolving>(this.Url + "api/Product/GetProductRevolvingDetails?productPKey=" + pkey);
  }

  postPrecomputedResponse(preComputedProductDetails: productPrecomputed) {
    return this.http.post(this.Url + "api/Product/SaveProductPrecomputedDetails", preComputedProductDetails)
  }
  postRevolvingResponse(revolvingProductDetails: productRevolving) {
    return this.http.post(this.Url + "api/Product/SaveProductRevolvingDetails", revolvingProductDetails)

  }
}
