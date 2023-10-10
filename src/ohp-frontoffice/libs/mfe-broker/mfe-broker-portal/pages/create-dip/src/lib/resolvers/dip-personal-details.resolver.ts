import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DIPService, PersonalDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipPersonalDetailsResolver implements Resolve<PersonalDetailsResponse> {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PersonalDetailsResponse> {
    return this.dipService.dIPGetPersonalDetails(route.parent?.data.dipJourney?.dipData?.applicationDraftId);
  }
}
