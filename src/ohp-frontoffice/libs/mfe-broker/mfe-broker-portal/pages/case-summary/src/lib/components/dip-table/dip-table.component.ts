import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { take } from 'rxjs/operators';
import { CaseSummaryService, Status2, StepSetupService, StipulationService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseDocument,
  DocumentService,
  LoanPartSummary,
  LoanStage,
  LoanStatus,
  PortalPermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mbp-dip-table',
  templateUrl: './dip-table.component.html',
})
export class DipTableComponent implements OnInit {
  caseId = this.route.snapshot.paramMap.get('caseId');
  loanStageEnum = LoanStage;
  loanStatusEnum = LoanStatus;
  status = Status2;
  assigneeId = this.route.snapshot.data?.summary?.caseData?.assigneeId || '';
  applicationDraftId = this.route.snapshot.data?.summary?.applicationDraftId || '';
  loanId = this.route.snapshot.data?.summary?.dipData?.loan?.loanId || '';
  today = new Date(); // Now
  expirationDateTime = this.route.snapshot.data?.summary?.dipData?.expirationDateTime;
  journeyStepUrl: string;
  dipData$ = this.caseSummaryService.dipSummary$;
  caseStage$ = this.caseSummaryService.caseStage$;
  caseStatus$ = this.caseSummaryService.caseStatus$;
  loanStatus$ = this.caseSummaryService.loanStatus$;
  loanStage$ = this.caseSummaryService.loanStage$;
  totalLoanAmount!: number | null;
  portalPermissionType = PortalPermissionType;
  dipCertificate?: CaseDocument | null;

  @ViewChild('diptable') diptable!: Table;

  constructor(
    public caseSummaryService: CaseSummaryService,
    private route: ActivatedRoute,
    private router: Router,
    private stepSetupService: StepSetupService,
    private documentService: DocumentService,
    private stipulationService: StipulationService,
  ) {
    const currentJourney = this.stepSetupService.getJourneyByCaseTypes(this.route.snapshot.data);
    this.journeyStepUrl = currentJourney[1]?.routerLink.replace('./', '');
  }

  ngOnInit() {
    this.dipData$.subscribe(dipData => {
      this.totalLoanAmount = this.getTotalLoanAmount(dipData?.loan?.loanPartSummary);
    });
    this.stipulationService.caseDocuments$.subscribe(documents => {
      if (documents?.length) {
        this.dipCertificate = documents.filter((document: CaseDocument) => document.description === 'DIP_Pack')[0];
      }
    });
  }

  public enterDipKeyboard(event: KeyboardEvent): void {
    event.stopPropagation();
    event.key === 'Enter' && this.enterDip(event);
  }

  public enterDip(event: MouseEvent | KeyboardEvent): void {
    event.stopPropagation();
    this.router.navigate([`./dip/${this.journeyStepUrl}`], { relativeTo: this.route });
  }

  public promoteDip(event: MouseEvent) {
    event.stopPropagation();
    this.caseSummaryService.promoteDip(this.caseId as string, this.applicationDraftId, this.loanId);
  }

  getTotalLoanAmount(loanPartSummary: LoanPartSummary[] | null | undefined): number | null {
    return loanPartSummary
      ? loanPartSummary.reduce((previousValue, currentValue) => previousValue + (currentValue.loanAmount || 0), 0)
      : null;
  }

  downloadDipCertificate(): void {
    if (this.dipCertificate?.id) {
      this.documentService
        .documentGetRelatedDocumentDownloadLink(this.applicationDraftId, this.dipCertificate.id)
        .pipe(take(1))
        .subscribe((url: string) => {
          window.open(url, '_blank');
        });
    }
  }
}
