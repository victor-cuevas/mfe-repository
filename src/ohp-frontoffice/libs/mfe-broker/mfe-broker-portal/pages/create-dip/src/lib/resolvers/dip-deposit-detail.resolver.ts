import { Injectable } from '@angular/core';
import { CaseSummaryService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { CaseService, DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DipDepositDetailsResolver {
  constructor(private dipService: DIPService, private caseService: CaseService, private caseSummaryService: CaseSummaryService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return forkJoin([
      this.dipService.dIPGetDepositDetails(
        route.parent?.data.dipJourney?.dipData?.applicationDraftId,
        route.parent?.data.dipJourney?.dipData?.loanId,
      ),
      this.caseService.caseGet(route.params?.caseId),
    ]).pipe(
      map(([depositDetailsData, caseData]) => {
        this.caseSummaryService.updateCaseData(caseData);

        return {
          depositDetailsData,
          caseData,
        };
      }),
    );
  }
}
