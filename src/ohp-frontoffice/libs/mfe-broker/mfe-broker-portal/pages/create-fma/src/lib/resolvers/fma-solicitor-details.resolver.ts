import { Injectable } from '@angular/core';
import { FMAService, SolicitorDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaSolicitorDetailsResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SolicitorDetailsResponse> {
    return this.fmaService.fMAGetSolicitorDetails(route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number);
  }
}
