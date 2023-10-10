import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseSummaryService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { CaseStatusEnum, DraftStage, LoanStatus, PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbp-full-mortgage-table',
  templateUrl: './full-mortgage-table.component.html',
})
export class FullMortgageTableComponent {
  caseId = this.route.snapshot.paramMap.get('caseId');
  draftStageEnum = DraftStage;
  loanStatusEnum = LoanStatus;
  caseStatus = CaseStatusEnum;
  draftStage$ = this.caseSummaryService.draftStage$;
  loanStatus$ = this.caseSummaryService.loanStatus$;
  caseStatus$ = this.caseSummaryService.caseStatus$;
  assigneeId = this.route.snapshot.data?.summary?.caseData?.assigneeId || '';
  displayEditDialog = false;
  portalPermissionType = PortalPermissionType;
  fma$ = this.caseSummaryService.fmaSummary$;

  @ViewChild('fullMortgageTable') fullMortgageTable!: Table;

  constructor(private route: ActivatedRoute, private router: Router, public caseSummaryService: CaseSummaryService) {}

  public enterFmaKeyboard(event: KeyboardEvent): void {
    event.stopPropagation();
    event.key === 'Enter' && this.enterFma(event);
  }

  public enterFma(event: MouseEvent | KeyboardEvent): void {
    event.stopPropagation();
    this.router.navigate(['./fma/contact-details'], { relativeTo: this.route });
  }

  public promoteDip() {
    const loan = this.route.snapshot.data?.summary?.dipData.loan;
    const applicationDraftId = this.route.snapshot.data?.summary.applicationDraftId;

    this.caseSummaryService.promoteDip(this.caseId as string, applicationDraftId, loan?.loanId);
  }
}
