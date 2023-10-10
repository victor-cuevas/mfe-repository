import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { CreditProviderRefDto } from '../Models/credit-providerRedDto.model';
import { GenericMappingDto } from '../Models/generic-mappingDto.model';
import { mappingContextDto } from '../Models/mapping-contextDto.model';
import { mappingDirectionDto } from '../Models/mapping-directionDto.model';

@Injectable({
  providedIn: 'root'
})
export class GenericMappingService {

  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getGenericMappingScreenData():Observable<GenericMappingDto>{
    return this.http.get<GenericMappingDto>(this.envApiUrl + 'api/GenericMapping/GetGenericMappingInitialData');
  }

  public getMappingContextList():Observable<mappingContextDto>{
    return this.http.get<mappingContextDto>(this.envApiUrl + 'api/GenericMapping/GetMappingContextList');
  }

  public getMappingDirectionList():Observable<mappingDirectionDto>{
    return this.http.get<mappingDirectionDto>(this.envApiUrl + 'api/GenericMapping/GetMappingDirectionList');
  } 

  public getCreditProviderNameList():Observable<CreditProviderRefDto>{
    return this.http.get<CreditProviderRefDto>(this.envApiUrl + 'api/GenericMapping/GetCreditProviderNameList');
  }

  public saveGenericMappingScreenData(generMappinglist:GenericMappingDto[]):Observable<boolean>{
    return this.http.post<boolean>(this.envApiUrl + 'api/GenericMapping/SaveGenericMappingScreenData',generMappinglist);
  }
}
