import { Injectable } from '@angular/core';
import { ContactDetailsResponse, FMAService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaContactDetailsResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ContactDetailsResponse> {
    return this.fmaService.fMAGetContactDetails(route.parent?.data?.fmaJourney?.fmaData?.applicationDraftId as number);
  }
}
