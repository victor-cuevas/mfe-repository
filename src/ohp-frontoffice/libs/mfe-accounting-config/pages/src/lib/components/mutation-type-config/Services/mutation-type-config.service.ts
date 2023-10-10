import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { MutationTypeDto } from '../Models/mutationtypeDto.model';
import { MutationTypeConfigForAccountingModuleDto } from '../Models/mutationtypeconfigforaccountingmoduleDto.model';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
@Injectable({
  providedIn: 'root'
})
export class MutationTypeService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService, public spinnerService: SpinnerService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getMutationTypeScreenData(): Observable<MutationTypeConfigForAccountingModuleDto[]> {
    this.spinnerService.setIsLoading(true);
    return this.http.get<MutationTypeConfigForAccountingModuleDto[]>(this.envApiUrl + 'api/MutationTypeConfig/GetMutationTypeConfigForAccountingModule');
  }
  public getMutationTypeNameList(): Observable<MutationTypeDto[]> {
    return this.http.get<MutationTypeDto[]>(this.envApiUrl + 'api/MutationTypeConfig/GetMutationType');
  }
  public saveMutationTypeScreenData(mutationTypelist: MutationTypeConfigForAccountingModuleDto[]): Observable<boolean> {
    return this.http.post<boolean>(this.envApiUrl + 'api/MutationTypeConfig/SaveMutationTypeConfigForAccountingModule', mutationTypelist);
  }
}
