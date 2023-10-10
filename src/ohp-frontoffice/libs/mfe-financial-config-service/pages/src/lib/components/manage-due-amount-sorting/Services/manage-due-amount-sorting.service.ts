import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SpinnerService} from '@close-front-office/mfe-financial-config-service/core'
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { PaymentAllocationDto } from '../Models/paymentAllocationDto.model';

@Injectable({
  providedIn: 'root'
})
export class ManageDueAmountSortingService {

  envApiUrl !: string
  constructor(private http: HttpClient, private manageCostService: ConfigContextService,public spinnerService:SpinnerService) {
    const mfeConfig = this.manageCostService.getConfigContext() && this.manageCostService.getConfigContext().REMOTE_MFES.find(item => item.path === 'financial') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  getPaymentAllocation(){
    this.spinnerService.setIsLoading(true);
   return this.http.get(this.envApiUrl+'api/ManageDueAmtSorting/GetPaymentAllocations')
  }

  savePaymentAllocation(paymentAllocationList : PaymentAllocationDto[]){
    this.spinnerService.setIsLoading(true);
    return this.http.post(this.envApiUrl +'api/ManageDueAmtSorting/SavePaymentAllocations',paymentAllocationList);

  }
}
