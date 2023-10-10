import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { defaultReferenceType } from '../Models/defaultReferenceType.model';
import { referenceType } from '../Models/referenceType.model';
import { referenceTypeUsage } from '../Models/referenceTypeUsage.model';

@Injectable({
  providedIn: 'root'
})
export class DefaultReferenceTypeService {

  Url !: string
  constructor(private http: HttpClient, private configService: ConfigContextService) {
    const mfeConfig = this.configService.getConfigContext() && this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.Url = mfeConfig?.apiUrl;
  }

 
  public GetReferenceType(): Observable<referenceType[]> {
    return this.http.get<referenceType[]>(this.Url + "api/DefaultReferenceType/GetReferenceType");

  }

  public GetReferenceTypeUsage(): Observable<referenceTypeUsage[]> {
    return this.http.get<referenceTypeUsage[]>(this.Url + "api/DefaultReferenceType/GetReferenceTypeUsage");

  }
  public GetDefaultReferenceType(): Observable<defaultReferenceType[]> {
    return this.http.get<defaultReferenceType[]>(this.Url + "api/DefaultReferenceType/GetAllDefaultReferenceTypes");

  }

  public SaveDefaultReferenceType(Data: defaultReferenceType[]) {
    return this.http.post(this.Url + "api/DefaultReferenceType/SaveDefaultReferenceTypes", Data);
  }
}
