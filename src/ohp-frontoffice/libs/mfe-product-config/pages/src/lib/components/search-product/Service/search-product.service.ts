import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchProductCodeTables } from '../Models/searchproduct-codetable.model';
import { SearchProductCriteriaDto } from '../Models/searchproduct-criteria.model';
import { ResponseSearchProduct } from '../Models/responseSearchProduct.model';
import { ProductRefDto } from '../Models/productref.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
@Injectable({
  providedIn: 'root'
})
export class SearchProductService {

  protected envapiUrl !: string
  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }

  getSearchProduct() {
    this.spinnerService.setIsLoading(true);
    return this.http.get<SearchProductCodeTables>(this.envapiUrl + 'api/SearchProduct/GetSearchProductCodeTables');
  }

  getSearchCriteriaProduct(searchcriteriaData: SearchProductCriteriaDto):Observable<ResponseSearchProduct>{
    return this.http.post<ResponseSearchProduct>(this.envapiUrl +'api/SearchProduct/SearchProduct',searchcriteriaData);
  }

  deleteProduct(productRefData: ProductRefDto){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: productRefData
    };

   return this.http.delete(this.envapiUrl +'api/SearchProduct/DeleteProduct',options)
  }
}
