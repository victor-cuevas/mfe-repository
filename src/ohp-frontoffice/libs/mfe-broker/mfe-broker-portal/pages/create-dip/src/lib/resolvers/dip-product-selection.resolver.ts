import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeProductSelectionResolve, MortgageTermService, CaseSummaryService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  DIPService,
  FirmService,
  ProductSelectionResponse,
  SubmissionRouteAssociationModelEx,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class DipProductSelectionResolver implements Resolve<FeProductSelectionResolve> {
  constructor(
    private dipService: DIPService,
    private mortgageTermService: MortgageTermService,
    private firmService: FirmService,
    private caseSummaryService: CaseSummaryService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FeProductSelectionResolve> {
    return forkJoin([
      this.dipService.dIPGetProductSelection(
        route.parent?.data.dipJourney?.dipData?.applicationDraftId,
        route.parent?.data.dipJourney?.dipData?.loanId,
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
