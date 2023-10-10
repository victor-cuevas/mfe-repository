import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { Observable } from 'rxjs';
import { RelatedProductTypeDef } from '../Models/related-product.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
@Injectable({
  providedIn: 'root'
})
export class RelatedProductDefinitionService {

  envapiUrl !: string;
  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }

  getCodeTableValues() {
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envapiUrl + 'api/ManageCredit/CodeTables');
  }

  getProductDefinition() {
    return this.http.get(this.envapiUrl + 'api/ManageCredit/RelatedProductTypeDef');
  }

  saveProductDefinition(relatedProductData: any): Observable<RelatedProductTypeDef[]> {
    return this.http.put<RelatedProductTypeDef[]>(this.envapiUrl + 'api/ManageCredit/RelatedProductTypeDef', relatedProductData);
  }

}
