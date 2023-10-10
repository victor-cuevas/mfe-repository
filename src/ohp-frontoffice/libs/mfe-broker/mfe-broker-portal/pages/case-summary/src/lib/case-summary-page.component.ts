import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { CaseSummaryService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseStage,
  CaseDocument,
  CaseService,
  CaseStatusResponse,
  LoanStage,
  LoanStatus,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Subject, timer } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mbp-case-summary-page',
  templateUrl: './case-summary-page.component.html',
})
export class CaseSummaryPageComponent implements OnInit, OnDestroy {
  breadcrumb: MenuItem[] = [
    { label: 'Case management', routerLink: '../' },
    { label: `Case summary - ${this.route.snapshot.paramMap.get('caseId')?.padStart(8, '0')}` },
  ];
  relatedDocuments: CaseDocument[] = [];

  onDestroy$ = new Subject();
  caseData = this.route.snapshot.data.summary?.caseData;

  constructor(private route: ActivatedRoute, private caseSummaryService: CaseSummaryService, private caseService: CaseService) {}

  ngOnInit() {
    if (this.caseSummaryService.loanStage === LoanStage.Dip && this.caseSummaryService.loanStatus === LoanStatus.Assessment) {
      this.updateDipStatus();
    }
    this.caseSummaryService.getSecondarySummaries(
      {
        [CaseStage.Illustration]: this.caseData.statusHistory?.some((el: CaseStatusResponse) => el.stage === CaseStage.Illustration),
        [CaseStage.Dip]: this.caseData.statusHistory?.some((el: CaseStatusResponse) => el.stage === CaseStage.Dip),
        [CaseStage.Fma]: this.caseData.statusHistory?.some((el: CaseStatusResponse) => el.stage === CaseStage.Fma),
      },
      this.caseData.caseId,
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  updateDipStatus() {
    const updateStatus = timer(0, 10000)
      .pipe(
        mergeMap(() => this.caseService.caseGetDIPSummary(this.route.snapshot.params.caseId)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(response => {
        const loanStatus = response.loan?.status;

        this.caseSummaryService.updateDipData(response);

        if (
          loanStatus === LoanStatus.Completed ||
          loanStatus === LoanStatus.Rejected ||
          loanStatus === LoanStatus.Referred ||
          loanStatus === LoanStatus.Cancelled
        ) {
          updateStatus.unsubscribe();
        }
      });
  }
}
