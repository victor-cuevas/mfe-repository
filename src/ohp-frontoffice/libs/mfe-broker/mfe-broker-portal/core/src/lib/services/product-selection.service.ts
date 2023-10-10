import { Injectable } from '@angular/core';
import {
  DIPService,
  FMAService,
  IllustrationService,
  Journey,
  ProductSelectionRequest,
  ProductSelectionResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable } from 'rxjs';

/**
 * Façade service for product selection API operations to inject in the shared product selection component
 * */
@Injectable({
  providedIn: 'root',
})
export class ProductSelectionService {
  constructor(private dipService: DIPService, private fmaService: FMAService, private illustrationService: IllustrationService) {}

  putProductSelection(
    journey: Journey,
    appId: number,
    loanId: number,
    body: ProductSelectionRequest,
  ): Observable<ProductSelectionResponse> {
    const postApis: Record<string, Observable<ProductSelectionResponse>> = {
      ILLUSTRATION: this.illustrationService.illustrationPutProductSelection(appId, loanId, body),
      DIP: this.dipService.dIPPutProductSelection(appId, loanId, body),
      FMA: this.fmaService.fMAPutProductSelection(appId, loanId, body),
    };
    return postApis[journey];
  }

  getProductSelection(journey: Journey, appId: number, loanId: number): Observable<ProductSelectionResponse> {
    const getApis: Record<string, Observable<ProductSelectionResponse>> = {
      ILLUSTRATION: this.illustrationService.illustrationGetProductSelection(appId, loanId),
      DIP: this.dipService.dIPGetProductSelection(appId, loanId),
      FMA: this.fmaService.fMAGetProductSelection(appId, loanId),
    };
    return getApis[journey];
  }
}
