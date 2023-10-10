import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { legislationDto } from '../Models/legislation.model';
import { ResponseListBaseLegislationDto } from '../Models/responseListBaseLegislation.model';
import { responsePagedListBaseOfLegislationDto } from '../Models/responsePagedListBaseLegislationDto.model';
import { SearchLegislationCriteriaDto } from '../Models/searchLegislationCriteriaDto.model';

@Injectable({
  providedIn: 'root'
})
export class ManageLegislationService {

  envapiUrl !: string;
  constructor(private http: HttpClient, private processService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }

  getLegislation(pkeyId:number){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envapiUrl+'api/ManageLegislation/GetLegislation?LegislationPKey='+pkeyId+'')
  }

  getConsumerProduct(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envapiUrl + 'api/ManageLegislation/GetConsumerProductTypeList')
  }

  searchLegislation(searchLegislation:SearchLegislationCriteriaDto):Observable<responsePagedListBaseOfLegislationDto>{
    this.spinnerService.setIsLoading(true);
    return this.http.post<responsePagedListBaseOfLegislationDto>(this.envapiUrl+'api/ManageLegislation/SearchLegislation',searchLegislation)
  }

  saveLegislation(legislationList:legislationDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post<ResponseListBaseLegislationDto>(this.envapiUrl+'api/ManageLegislation/SaveLegislationn',legislationList)
  }

}
