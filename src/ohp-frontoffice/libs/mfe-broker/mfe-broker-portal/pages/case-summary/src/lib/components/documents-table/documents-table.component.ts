import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CaseSummaryService, FileUpload, Stage2, StipulationService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { CaseStage, CaseStatusEnum, DocumentService, PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AccordionTab } from 'primeng/accordion';
import { FileUploadComponent } from '@close-front-office/mfe-broker/shared-ui';

@Component({
  selector: 'mbp-documents-table',
  templateUrl: './documents-table.component.html',
})
export class DocumentsTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private appId = this.route.snapshot.data?.summary?.applicationDraftId;
  private onDestroy$ = new Subject();
  public updateStipulations$ = new Subscription();
  stipulations$ = this.stipulationService.stipulations$;
  caseDocuments$ = this.stipulationService.caseDocuments$;
  caseStatus$ = this.caseSummaryService.caseStatus$;
  today = new Date();
  stageEnum = Stage2;
  caseStatus = CaseStatusEnum;
  assigneeId = this.route.snapshot.data?.summary?.caseData?.assigneeId || '';
  portalPermissionType = PortalPermissionType;
  draftStage$ = this.caseSummaryService.draftStage$;

  loadingStipulations = false;
  loadingDocuments = false;

  @ViewChild('documentsAccRef') documentsAccRef!: AccordionTab;
  @ViewChildren('uploadComponent') uploadComponents!: QueryList<FileUploadComponent>;
  documentsAccIsClosed!: boolean;

  constructor(
    private documentService: DocumentService,
    private caseSummaryService: CaseSummaryService,
    private route: ActivatedRoute,
    private stipulationService: StipulationService,
  ) {}

  ngOnInit() {
    if (this.caseSummaryService.caseStage !== (CaseStage.New || CaseStage.Draft)) {
      this.stipulationService.handleDocuments(this.appId);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
    this.stipulationService.resetData();
  }

  ngAfterViewInit(): void {
    this.documentsAccIsClosed = !this.documentsAccRef.selected;
    this.documentsAccRef.selectedChange.subscribe(val => (this.documentsAccIsClosed = !val));
  }

  downloadRelatedDocumentKeyboard(event: KeyboardEvent, documentId: string): void {
    event.key === 'Enter' && this.downloadRelatedDocument(documentId);
  }

  downloadRelatedDocument(documentId: string): void {
    this.documentService
      .documentGetRelatedDocumentDownloadLink(this.appId, documentId)
      .pipe(take(1))
      .subscribe((url: string) => {
        window.open(url, '_blank');
      });
  }

  downloadStipulation(documentId: string): void {
    this.documentService
      .documentGetStipulationDownloadLink(this.appId, documentId)
      .pipe(take(1))
      .subscribe((url: string) => {
        window.open(url, '_blank');
      });
  }

  onUploadStipulation(data: FileUpload, index: number): void {
    const uploadedFile = this.stipulationService.uploadStipulation(data, index, this.appId);

    if (!uploadedFile) {
      (document.activeElement as HTMLElement).blur();
      this.uploadComponents.get(index)?.clear();
    }
  }
}
