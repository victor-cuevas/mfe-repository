import { Injectable } from '@angular/core';
import {
  CaseDocument,
  DocumentService,
  DocumentTypeEnum,
  DraftStage,
  LoanStatus,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { FeStipulation } from '../models/fe-stipulation';
import { BehaviorSubject, combineLatest, Subscription, timer } from 'rxjs';
import { CaseSummaryService } from './case-summary.service';
import { FileUpload } from '../models';
import { SeveritiesEnum, ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class StipulationService {
  private subscriptions = new Subscription();
  private updateStipulations$ = new Subscription();
  private updateDocuments$ = new Subscription();

  public loadingStipulations$ = new BehaviorSubject(false);
  public loadingCaseDocuments$ = new BehaviorSubject(false);

  private _stipulations$ = new BehaviorSubject<FeStipulation[] | undefined>(undefined);
  private _caseDocuments$ = new BehaviorSubject<CaseDocument[] | undefined>(undefined);

  public stipulations$ = this._stipulations$.asObservable();
  public caseDocuments$ = this._caseDocuments$.asObservable();

  set stipulations(value: FeStipulation[] | undefined) {
    this._stipulations$.next(value);
  }

  get stipulations(): FeStipulation[] | undefined {
    return this._stipulations$.getValue();
  }

  set caseDocuments(value: CaseDocument[] | undefined) {
    this._caseDocuments$.next(value);
  }

  get caseDocuments(): CaseDocument[] | undefined {
    return this._caseDocuments$.getValue();
  }

  constructor(
    private documentService: DocumentService,
    private caseSummaryService: CaseSummaryService,
    private translateService: TranslateService,
    private toastService: ToastService,
  ) {}

  downloadFile(appId: number, documentId: string, type: DocumentTypeEnum) {
    const downloadFromServer$ =
      type === DocumentTypeEnum.RELATED_DOCUMENT
        ? this.documentService.documentGetRelatedDocumentDownloadLink(appId, documentId)
        : this.documentService.documentGetStipulationDownloadLink(appId, documentId);

    downloadFromServer$.pipe(take(1)).subscribe((url: string) => {
      window.open(url, '_blank');
    });
  }

  setUploadStatus(index: number, status = true) {
    if (this.stipulations) {
      const stipulationCopy = [...this.stipulations];
      stipulationCopy[index].isUploading = status;

      this.stipulations = stipulationCopy;
    }
  }

  fetchStipulations(appId: number) {
    if (this.caseSummaryService.loanStatus === LoanStatus.Assessment) return;
    this.loadingStipulations$.next(true);
    this.subscriptions.add(
      this.documentService.documentGetStipulations(appId).subscribe(
        res => {
          if (res && res.stipulations?.length) {
            this.stipulations = res?.stipulations.map(stipulation => ({
              ...stipulation,
              isUploading: false,
            }));
            this.updateStipulations$.unsubscribe();
            this.loadingStipulations$.next(false);
          }
          if (!this.caseSummaryService.shouldRefreshDocuments()) {
            this.updateStipulations$.unsubscribe();
            this.loadingStipulations$.next(false);
          }
        },
        () => {
          this.updateStipulations$.unsubscribe();
        },
      ),
    );
  }

  fetchDocuments(appId: number) {
    if (this.caseSummaryService.loanStatus === LoanStatus.Assessment) return;
    this.loadingCaseDocuments$.next(true);
    this.subscriptions.add(
      this.documentService.documentGetRelatedDocuments(appId).subscribe(
        res => {
          if (res && res.caseDocuments?.length) {
            this.caseDocuments = res.caseDocuments;
            this.updateDocuments$.unsubscribe();
            this.loadingCaseDocuments$.next(false);
          }
          if (!this.caseSummaryService.shouldRefreshDocuments()) {
            this.updateDocuments$.unsubscribe();
            this.loadingCaseDocuments$.next(false);
          }
        },
        () => {
          this.updateDocuments$.unsubscribe();
        },
      ),
    );
  }

  // function to call that automatically handles updating or setting all documents
  handleDocuments(appId: number): void {
    this.subscriptions = new Subscription();
    const shouldRefresh$ = combineLatest([this.caseSummaryService.draftStage$, this.caseSummaryService.loanStatus$])
      .pipe(
        distinctUntilChanged(),
        map(([draftStage, loanStatus]) => {
          return (
            draftStage === DraftStage.Fma ||
            (draftStage === DraftStage.Dip && loanStatus === LoanStatus.Completed) ||
            (draftStage === DraftStage.Dip && loanStatus === LoanStatus.Referred)
          );
        }),
      )
      .subscribe(shouldRefresh => {
        if (shouldRefresh && appId) {
          this.updateDocuments('stipulations', appId);
          this.updateDocuments('caseDocuments', appId);
        } else {
          this.fetchDocuments(appId);
          this.fetchStipulations(appId);
        }
      });

    this.subscriptions.add(shouldRefresh$);
  }

  updateDocuments(type: 'stipulations' | 'caseDocuments', appId: number, interval: number = 10000) {
    const obs$ = timer(0, interval).subscribe(() => {
      type === 'stipulations' ? this.fetchStipulations(appId) : this.fetchDocuments(appId);
    });

    if (type === 'stipulations') {
      this.updateStipulations$.unsubscribe();
      this.updateStipulations$ = obs$;
    } else {
      this.updateDocuments$.unsubscribe();
      this.updateDocuments$ = obs$;
    }
  }

  uploadStipulation(data: FileUpload, index: number, appId: number): boolean {
    const isCorrectFileSize =
      data.content.files[0]?.type === 'application/pdf' ||
      data.content.files[0]?.type === 'image/png' ||
      data.content.files[0]?.type === 'image/jpeg';

    this.setUploadStatus(index);
    if (data.content.files[0]?.size > 10485760) {
      this.toastService.showMessage({
        summary: this.translateService.instant('general.errors.fileSizeSummary'),
        detail: this.translateService.instant('general.errors.fileSizeDetail'),
        severity: SeveritiesEnum.ERROR,
      });
      this.setUploadStatus(index, false);

      return false;
    }
    if (!isCorrectFileSize) {
      this.toastService.showMessage({
        summary: this.translateService.instant('general.errors.fileTypeSummary'),
        detail: this.translateService.instant('general.errors.fileTypeDetail'),
        severity: SeveritiesEnum.ERROR,
      });
      this.setUploadStatus(index, false);

      return false;
    }

    this.documentService
      .documentUploadStipulationDocument(appId, data.content.files[0], data.id)
      .pipe(take(1))
      .subscribe(() => {
        this.toastService.showMessage({
          summary: this.translateService.instant('caseSummary.labels.uploadSuccess'),
          severity: 'success',
          life: 5000,
        });
        this.fetchStipulations(appId);
      });
    return true;
  }

  resetData() {
    this.subscriptions.unsubscribe();
    this.caseDocuments = undefined;
    this.stipulations = undefined;
  }
}
