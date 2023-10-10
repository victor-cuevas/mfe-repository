import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';

import { PermissionContextService } from '@close-front-office/mfe-broker/core';
import {
  CaseDataResponse,
  CaseService,
  CaseStage,
  DipSummaryResponse,
  FMASummaryResponse,
  IllustrationSummaryResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CaseSummaryService } from '../services/case-summary.service';

interface SummaryData {
  caseData: CaseDataResponse;
  dipData?: DipSummaryResponse;
  illustrationData?: IllustrationSummaryResponse;
  fmaData?: FMASummaryResponse;
  applicationDraftId: number;
  loanId: number;
}

interface LoanData {
  loan?: { loanId: number };
}

@Injectable({
  providedIn: 'root',
})
export class CaseSummaryResolver {
  constructor(
    private caseService: CaseService,
    private router: Router,
    private permissionContextService: PermissionContextService,
    private caseSummaryService: CaseSummaryService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SummaryData> | void {
    const caseId = route.paramMap.get('caseId');
    const firmId = this.caseSummaryService.fimData?.firmId;

    if (caseId) {
      return this.caseService.caseGet(caseId, firmId).pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          this.router.navigate(['broker/not-found'], { skipLocationChange: true });
          return throwError(error);
        }),
        concatMap((caseData: CaseDataResponse) => {
          const principalCall: {
            [key: string]: Observable<DipSummaryResponse | IllustrationSummaryResponse | FMASummaryResponse | undefined>;
          } = {
            [CaseStage.Illustration]: this.caseService.caseGetIllustrationSummary(caseId),
            [CaseStage.Dip]: this.caseService.caseGetDIPSummary(caseId),
            [CaseStage.Fma]: this.caseService.caseGetFMASummary(caseId),
            [CaseStage.New]: of(undefined),
            [CaseStage.Draft]: of(undefined),
          };
          this.permissionContextService.setAssigneeContext(caseData.assigneeId || '');
          this.caseSummaryService.resetData();
          this.caseSummaryService.updateCaseData(caseData);

          return principalCall[caseData.stage as string].pipe(
            take(1),
            map(data => {
              caseData.stage === CaseStage.Illustration &&
                this.caseSummaryService.updateIllustrationData(data as IllustrationSummaryResponse);
              caseData.stage === CaseStage.Dip && this.caseSummaryService.updateDipData(data as DipSummaryResponse);
              caseData.stage === CaseStage.Fma && this.caseSummaryService.updateFmaData(data as FMASummaryResponse);

              return {
                caseData,
                illustrationData: caseData.stage === CaseStage.Illustration ? data : undefined,
                dipData: caseData.stage === CaseStage.Dip ? data : undefined,
                fmaData: caseData.stage === CaseStage.Fma ? data : undefined,
                applicationDraftId: data?.applicationDraftId || 0,
                loanId: (data && (data as LoanData).loan?.loanId) || 0,
              };
            }),
          );
        }),
      );
    }
    this.router.navigate(['broker/not-found'], { skipLocationChange: true });
    return;
  }
}
