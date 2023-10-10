import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { getAllCostResponse } from '../Models/getAllCostResponse.model';


@Injectable({
  providedIn: 'root'
})
export class ManageCostService {

  Url !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'financial') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }


  public GetManageCostResponse(): Observable<getAllCostResponse> {
    return this.http.get<getAllCostResponse>(this.Url + "api/ManageCost/GetAllCost");

  }

  public PostManageCostResponse(GridData: getAllCostResponse) {
    return this.http.post(this.Url + "api/ManageCost/SaveCosts", GridData);
  }
}
