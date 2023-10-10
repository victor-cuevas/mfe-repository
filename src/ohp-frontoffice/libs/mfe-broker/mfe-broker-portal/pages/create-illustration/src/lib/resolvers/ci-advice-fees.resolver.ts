import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { AdviceAndFeesResponse, IllustrationService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class CiAdviceFeesResolver implements Resolve<AdviceAndFeesResponse> {
  constructor(private illustrationService: IllustrationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AdviceAndFeesResponse> {
    return this.illustrationService.illustrationGetAdviceAndFees(route.parent?.params?.applicationDraftId, route.parent?.params?.loanId);
  }
}
