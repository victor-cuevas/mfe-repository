import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductMock } from '../models/product-mock';
import { HttpClient } from '@angular/common/http';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root',
})
export class ProductMockService {
  private mfeConfig = this.configService.getConfigContext()?.REMOTE_MFES.find(item => item.path === 'panel') as MfeModel;
  private productUrl = this.mfeConfig?.remoteUrl + '/assets/mock-data/products.json';

  constructor(private http: HttpClient, private configService: ConfigContextService) {}

  // GET products from server
  getProducts(): Observable<ProductMock[]> {
    return this.http.get<ProductMock[]>(this.productUrl);
  }

  getSelectedProducts(): Observable<ProductMock[]> {
    return this.http.get<ProductMock[]>(this.productUrl).pipe(map(x => x.slice(0, 2)));
  }
}
