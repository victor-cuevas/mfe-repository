import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManageMutationResponse } from '../models/managemutation.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { MutationDataDto } from '../models/mutation-data.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core'

@Injectable({
  providedIn: 'root'
})
export class ManageCredMutationService {

  public envapiUrl!: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }

  getManageMutationData(): Observable<ManageMutationResponse> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<ManageMutationResponse>(this.envapiUrl + 'api/ManageMutation');
  }

  saveManageMutation(mutationData: MutationDataDto) {
    return this.http.put(this.envapiUrl + 'api/ManageMutation', mutationData)
  }
}
