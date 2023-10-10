import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-collection-measure-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { CollectionMeasuresConfigDto } from '../Models/collection-measure-configDto.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionMeasureConfigService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,public spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'collection-measure') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getCollectionMeasureType(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl +'api/CollectionMeasureConfig/GetCollectionMeasureType');
  }

  getDossierStatus(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl +'api/CollectionMeasureConfig/GetDossierStatus');
  }

  getFollowUpEventName(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl +'api/CollectionMeasureConfig/GetFollowUpEventName');
  }

  getCollectionMeasureConfig(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl +'api/CollectionMeasureConfig/GetCollectionMeasureConfig');
  }

  saveCollectionMeasureConfig(collectionMeasureData:CollectionMeasuresConfigDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl +'api/CollectionMeasureConfig/SaveCollectionMeasureConfig',collectionMeasureData);
  }

  getCloseMeasureIntervalType(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl +'api/CollectionMeasureConfig/GetCloseMeasureIntervalType');
  }
}
