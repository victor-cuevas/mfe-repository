import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StipulationService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { DocumentService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FmaUploadStipulationsResolver {
  constructor(private documentService: DocumentService, private stipulationService: StipulationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.documentService.documentGetStipulations(route.parent?.data?.fmaJourney?.fmaData?.applicationDraftId as number).pipe(
      map(res => {
        if (res.stipulations?.length) {
          this.stipulationService.stipulations = res.stipulations.map(stipulation => ({
            ...stipulation,
            isUploading: false,
          }));
        }
      }),
    );
  }
}
