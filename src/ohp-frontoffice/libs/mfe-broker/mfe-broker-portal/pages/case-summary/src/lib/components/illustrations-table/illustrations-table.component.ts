import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import {
  CaseSummaryService,
  FeIllustrationSummary,
  RoutePaths,
  Status2,
  StipulationService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseDocument,
  CaseStage,
  CreateIllustrationResponse,
  DocumentService,
  DraftStatus,
  IllustrationService,
  IllustrationSummary,
  LoanStatus,
  PortalPermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionContextService, SpinnerService } from '@close-front-office/mfe-broker/core';
import { map, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'mbp-illustrations-table',
  templateUrl: './illustrations-table.component.html',
})
export class IllustrationsTableComponent implements OnInit, OnDestroy {
  @ViewChild('illustrationstable') illustrationstable!: Table;

  draftStatusEnum = DraftStatus;
  caseStageEnum = CaseStage;
  portalPermissionType = PortalPermissionType;
  status = Status2;
  routePaths: typeof RoutePaths = RoutePaths;
  caseStage$ = this.caseSummaryService.caseStage$;
  caseStatus$ = this.caseSummaryService.caseStatus$;
  caseId = this.route.snapshot.paramMap.get('caseId') as string;
  applicationDraftId = this.route.snapshot.data?.summary?.applicationDraftId;
  assigneeId = this.permissionContextService.getAssigneeContext() as string;
  illustrations$: Observable<FeIllustrationSummary[]> = this.caseSummaryService.illustrationSummary$.pipe(
    map(illustrationSummary => {
      if (illustrationSummary?.illustrationSummaries?.length) {
        return this.sortIllustrations(illustrationSummary.illustrationSummaries);
      }
      return [];
    }),
  );

  @Input() relatedDocuments?: CaseDocument[] | null;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private illustrationService: IllustrationService,
    private spinnerService: SpinnerService,
    private router: Router,
    private permissionContextService: PermissionContextService,
    private caseSummaryService: CaseSummaryService,
    private documentService: DocumentService,
    private stipulationService: StipulationService,
  ) {}

  ngOnInit() {
    this.updateEsisDocument();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  updateEsisDocument() {
    this.stipulationService.caseDocuments$.pipe(takeUntil(this.onDestroy$)).subscribe(caseDocuments => {
      if (caseDocuments?.length) {
        this.illustrations$ = this.illustrations$.pipe(
          map(illustrations =>
            illustrations.map(illustration => ({
              ...illustration,
              esisDocument: caseDocuments.filter(
                (document: CaseDocument) => +(document.externalReference as string) === illustration.loanId,
              )[0],
            })),
          ),
        );
      }
    });
  }

  sortIllustrations(illustrations: IllustrationSummary[]): IllustrationSummary[] {
    return illustrations
      .sort((a, b) => {
        if (a.date && b.date) {
          if (a.date < b.date) {
            return -1;
          } else {
            return 1;
          }
        }
        return 0;
      })
      .sort((a, b) => {
        if (a.status === LoanStatus.Completed && b.status !== LoanStatus.Completed) {
          return -1;
        }
        if (a.status !== LoanStatus.Completed && b.status === LoanStatus.Completed) {
          return 1;
        }
        return 0;
      });
  }

  createIllustrationKeyboard(event: KeyboardEvent): void {
    event.stopPropagation();
    event.key === 'Enter' && this.createIllustration(event);
  }

  createIllustration(event: MouseEvent | KeyboardEvent): void {
    event.stopPropagation();

    this.spinnerService.setIsLoading(true);
    const caseId = this.caseId ? this.caseId : null;
    this.illustrationService
      .illustrationPostLoan({ caseId: caseId as string })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (response: CreateIllustrationResponse) => {
          this.router.navigate([`./illustration/${response.applicationDraftId}/loan/${response.loanId}/loan-details`], {
            relativeTo: this.route,
          });
        },
        () => this.spinnerService.setIsLoading(false),
      );
  }

  promoteIllustration(loanId: number) {
    this.caseSummaryService.promoteIllustration(this.caseId, this.applicationDraftId, loanId);
  }

  enterIllustration(event: MouseEvent, loanId: number) {
    event.stopPropagation();
    this.spinnerService.setIsLoading(true);
    this.router.navigate([`./illustration/${this.applicationDraftId}/loan/${loanId}/loan-details`], {
      relativeTo: this.route,
    });
  }

  downloadEsisDocument(documentId: string): void {
    this.documentService
      .documentGetRelatedDocumentDownloadLink(this.applicationDraftId, documentId)
      .pipe(take(1))
      .subscribe((url: string) => {
        window.open(url, '_blank');
      });
  }
}
