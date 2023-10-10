import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { PrintDocumentFilterDto } from '../Models/print-document-filterDto.model';

@Injectable({
  providedIn: 'root'
})
export class PrintDocumentFilterService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,private spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'communication') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getPrintDocumentScreen(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envApiUrl+'api/PrintDocumentFilter/GetPrintDocumentFilterConfigScreenInfo');
  }

  savePrintDocument(printDocumentList:PrintDocumentFilterDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl+'api/PrintDocumentFilter/SavePrintDocumentFilters',printDocumentList);
  }
}
