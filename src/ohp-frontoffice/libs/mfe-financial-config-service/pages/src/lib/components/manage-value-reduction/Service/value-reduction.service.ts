import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { getValueReductionResponse } from '../Models/getValueReductionResponse.model';
import { valueReduction } from '../Models/valueReduction.model';

@Injectable({
  providedIn: 'root'
})
export class ValueReductionService {

  Url !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'financial') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }


  public GetValueReductionResponse(): Observable<getValueReductionResponse> {
    return this.http.get<getValueReductionResponse>(this.Url + "api/ManageValueReduction/GetValueReductionPrinciples");

  }

  public PostValueReductionResponse(GridData: valueReduction[]) {
    return this.http.post(this.Url + "api/ManageValueReduction/SaveValueReductionPrinciples", GridData);
  }
}
