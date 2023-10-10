import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { FirmsService, SubmissionRoutesService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Injectable({
  providedIn: 'root',
})
export class UpdateFirmsResolver {
  constructor(private firmsService: FirmsService, private submissionRouteService: SubmissionRoutesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return forkJoin([
      this.firmsService.firmsGetById(route.paramMap.get('id') || ''),
      this.firmsService.firmsGetFirmAddressesByFirmId(route.paramMap.get('id') || ''),
      this.submissionRouteService.submissionRoutesGetSubmissionRouteAssociationsByFirmId(route.paramMap.get('id') || ''),
    ]).pipe(
      map(allResponses => {
        return {
          firmDetail: allResponses[0],
          firmAddress: allResponses[1],
          associationsDetails: allResponses[2],
        };
      }),
    );
  }
}
