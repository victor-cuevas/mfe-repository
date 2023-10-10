import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { CmGenericMappingDto } from '../Models/cm-generic-mappingDto.model';

@Injectable({
  providedIn: 'root'
})
export class CmGenericMappingService {
  protected envApiUrl: string

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getGenericMappingCodeTables() {

    return this.http.get(this.envApiUrl + 'api/GenericMapping/codetables');
  } 

  public getcmGenericMapping(){
    return this.http.get(this.envApiUrl + 'api/GenericMapping');
  }

  public savecmGenericMapping(cmgenericmappingdata:CmGenericMappingDto[]){
    return this.http.put(this.envApiUrl + 'api/GenericMapping',cmgenericmappingdata);

  }
}
