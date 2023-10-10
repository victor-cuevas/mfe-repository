import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { FeProductSelectionResolve, MortgageTermService, CaseSummaryService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  FirmService,
  FMAService,
  ProductSelectionResponse,
  SubmissionRouteAssociationModelEx,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FmaProductSelectionResolver implements Resolve<FeProductSelectionResolve> {
  constructor(
    private fmaService: FMAService,
    private mortgageTermService: MortgageTermService,
    private firmService: FirmService,
    private caseSummaryService: CaseSummaryService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FeProductSelectionResolve> {
    return forkJoin([
      this.fmaService.fMAGetProductSelection(
        route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number,
        route.parent?.data.fmaJourney?.fmaData?.loanId as number,
      ),
      this.firmService.firmGetSubmissionRouteAssociatonsByFirmId(route.parent?.data.summary.caseData.ownerId),
    ]).pipe(
      map(([productData, networkData]: [ProductSelectionResponse, SubmissionRouteAssociationModelEx]) => {
        if (productData.loanParts?.length) {
          this.mortgageTermService.updateHighestMortgageTerm(productData.loanParts);
        }

        return { productData, networkData };
      }),
    );
  }
}
