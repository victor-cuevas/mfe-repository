import { Injectable } from '@angular/core';
import { DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DipHouseholdExpenditureResolver {
  constructor(private dipService: DIPService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return forkJoin([
      this.dipService.dIPGetExpenditureDetails(route.parent?.data.dipJourney?.dipData?.applicationDraftId),
      this.dipService.dIPGetSecurityProperty(route.parent?.data.dipJourney?.dipData?.applicationDraftId),
    ]).pipe(
      map(allResult => {
        return { householdExpenditureData: allResult[0], securityPropertyData: allResult[1] };
      }),
    );
  }
}
