import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { DataService, FileUpload, StepSetupService, StipulationService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  DocumentService,
  Journey,
  StepStatusEnum,
  StipulationDocument,
  UploadStatus,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, mergeMap, take, takeUntil } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { of, Subject } from 'rxjs';
import { FileUploadComponent } from '@close-front-office/mfe-broker/shared-ui';

@Component({
  templateUrl: './fma-upload-stipulations.component.html',
})
export class FmaUploadStipulationsComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.uploadStipulations.automationId;
  private onDestroy$ = new Subject();
  loadingStipulations$ = this.stipulationService.loadingStipulations$;
  stipulations$ = this.stipulationService.stipulations$;
  @ViewChild('stipulationsTable') stipulationsTable!: Table;
  @ViewChildren('uploadComponent') uploadComponents!: QueryList<FileUploadComponent>;
  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;
  private debounceSub$ = new Subject<boolean>();
  private stepStatus$ = new Subject<FormControlStatus>();
  stepIsValid!: StepStatusEnum;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    public stipulationService: StipulationService,
    public dataService: DataService,
    private stepSetupService: StepSetupService,
  ) {}

  ngOnInit() {
    this.stipulationService.fetchStipulations(this.appId);
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
    this.checkSubscription();
    this.stepStatus$.unsubscribe();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        }
      });
  }

  onChanges() {
    this.stipulationService.stipulations$.pipe(takeUntil(this.debounceSub$)).subscribe(stipulations => {
      this.stepIsValid = this.setFormStatus(stipulations);
      this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
      this.stepStatus$.next(this.stepIsValid);
    });
    this.stepStatus$
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.debounceSub$),
        mergeMap(status => this.saveProgress(status)),
      )
      .subscribe();
  }

  getStepStatus(): StepStatusEnum | null {
    if (this.stepIsValid === 'VALID') return StepStatusEnum.VALID;
    if (this.stepIsValid === 'INVALID') return StepStatusEnum.INVALID;
    return null;
  }

  saveProgress(status: FormControlStatus) {
    return this.dataService.saveProgress(Journey.Fma, this.appId, this.loanId, { [this.STEP_NAME]: status }, of(undefined));
  }

  onUploadStipulation(data: FileUpload, index: number) {
    const uploadedFile = this.stipulationService.uploadStipulation(data, index, this.appId);

    if (!uploadedFile) {
      (document.activeElement as HTMLElement).blur();
      this.uploadComponents.get(index)?.clear();
    }
  }

  downloadStipulation(documentId: string): void {
    this.documentService
      .documentGetStipulationDownloadLink(this.appId, documentId)
      .pipe(take(1))
      .subscribe((url: string) => {
        window.open(url, '_blank');
      });
  }

  private setFormStatus(stipulations?: StipulationDocument[] | null): StepStatusEnum {
    const validStatus = [
      UploadStatus.TO_BE_ANALYZED,
      UploadStatus.ANALYZED,
      UploadStatus.RECEIVED,
      UploadStatus.TO_BE_CORRECTED,
      UploadStatus.VALID,
      UploadStatus.MISCLASSIFIED,
      UploadStatus.CLASSIFICATION_AMBIGUOUS,
      UploadStatus.POLICY_APPROVED,
      UploadStatus.PROVISIONALLY_APPROVED,
      UploadStatus.APPROVED,
      UploadStatus.POLICY_REJECTED,
      UploadStatus.CONSISTENCY_REJECTED,
      UploadStatus.DEFERRED,
      UploadStatus.CANCELLED,
      UploadStatus.ERROR,
      UploadStatus.UNKNOWN,
    ];
    const allStipulationsValid = stipulations?.every(stipulation => validStatus.includes(stipulation.status as UploadStatus));
    return allStipulationsValid ? StepStatusEnum.VALID : StepStatusEnum.INVALID;
  }

  private checkSubscription() {
    if (this.debounceSub$ && !this.debounceSub$.isStopped) {
      this.debounceSub$.next(true);
      this.debounceSub$.unsubscribe();
    }
  }
}
