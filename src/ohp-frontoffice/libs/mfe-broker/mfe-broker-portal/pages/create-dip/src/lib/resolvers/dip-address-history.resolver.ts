import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AddressHistoryResponse, DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipAddressHistoryResolver implements Resolve<AddressHistoryResponse> {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AddressHistoryResponse> {
    return this.dipService.dIPGetAddressHistoryItems(route.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }
}
