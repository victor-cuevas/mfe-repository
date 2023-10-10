import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { interval, Observable, throwError, timer } from 'rxjs';
import {
  CaseSummaryService,
  DataService,
  GenericStepForm,
  StepSetupService,
  StipulationService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseService,
  DocumentService,
  FMAService,
  FMASummaryResponse,
  Journey,
  LendingPolicyCheckRequest,
  LendingPolicyCheckResponse,
  LoanStatus,
  RejectionReasonResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { catchError, concatMap, debounceTime, distinctUntilChanged, mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'close-front-office-fma-lender-policy-check',
  templateUrl: './fma-lender-policy-check.component.html',
})
export class FmaLenderPolicyCheckComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.lenderPolicyCheck.automationId;
  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  loanStatus: string = this.caseSummaryService.loanStatus as string;
  rejectionReasons: RejectionReasonResponse[] = this.caseSummaryService.rejectionReasons as RejectionReasonResponse[];
  loadingDocuments = false;
  currentData: LendingPolicyCheckResponse = this.route.snapshot.data.lenderPolicyCheckData || {};

  lenderPolicyCheckForm = this.fb.group({
    requiredDocumentsCheck: [
      {
        value: this.currentData.requiredDocumentsCheck || false,
        disabled: true,
      },
      Validators.requiredTrue,
    ],
    consentCheck: [{ value: this.currentData.consentCheck, disabled: true } || false, Validators.requiredTrue],
    idConfirmedCheck: [{ value: this.currentData.idConfirmedCheck, disabled: true } || false, Validators.requiredTrue],
    documentsReady: [undefined, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private fmaService: FMAService,
    private caseService: CaseService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private stipulationService: StipulationService,
    private caseSummaryService: CaseSummaryService,
    private cd: ChangeDetectorRef,
    private stepSetupService: StepSetupService,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.checkSubscription();
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  checkDocuments() {
    this.caseSummaryService.loanStatus$.pipe(takeUntil(this.onDestroy$), distinctUntilChanged()).subscribe(status => {
      if (status === LoanStatus.Accepted || status === LoanStatus.Referred || status === LoanStatus.Documentation) {
        this.loadingDocuments = true;
        const documentsSubscription = timer(0, 5000)
          .pipe(
            mergeMap(() => this.documentService.documentGetRelatedDocuments(this.appId)),
            takeUntil(this.onDestroy$),
          )
          .subscribe(res => {
            if (res?.caseDocuments?.length) {
              this.stipulationService.caseDocuments = res.caseDocuments;
              if (
                res.caseDocuments?.filter(document => document.description === 'ESIS' || document.description === 'Application_Declaration')
                  .length === 2
              ) {
                this.loadingDocuments = false;
                this.lenderPolicyCheckForm.get('requiredDocumentsCheck')?.enable({ emitEvent: false });
                this.lenderPolicyCheckForm.get('documentsReady')?.setValue(true, { emitEvent: false });
                documentsSubscription.unsubscribe();
              }
            }
          });
      } else {
        this.lenderPolicyCheckForm.get('documentsReady')?.setValue(undefined, { emitEvent: false });
        this.lenderPolicyCheckForm.get('idConfirmedCheck')?.setValue(false, { emitEvent: false });
        this.lenderPolicyCheckForm.get('consentCheck')?.setValue(false, { emitEvent: false });
        this.lenderPolicyCheckForm.get('requiredDocumentsCheck')?.setValue(false, { emitEvent: false });
      }
    });
  }

  getData(): Observable<LendingPolicyCheckResponse> {
    return this.fmaService.fMAGetLendingPolicyCheck(this.appId, this.loanId);
  }

  saveData(): Observable<LendingPolicyCheckResponse> {
    return this.getData().pipe(
      take(1),
      switchMap(res => {
        return this.fmaService
          .fMAPutLendingPolicyCheck(this.appId, this.loanId, {
            ...this.mapToDTO(),
            versionNumber: res.versionNumber,
          })
          .pipe(
            concatMap(() => {
              this.lenderPolicyCheckForm.markAsPristine();
              return this.dataService.saveProgress(
                Journey.Fma,
                this.appId,
                this.loanId,
                { [this.STEP_NAME]: this.lenderPolicyCheckForm.status },
                this.getData(),
              );
            }),
            catchError(error => {
              return throwError(error);
            }),
          );
      }),
    );
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.lenderPolicyCheckForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.submitFma();
          this.checkDocuments();
          this.onChanges();
        }
      });
  }

  submitFma() {
    if (this.caseSummaryService.loanStatus === LoanStatus.InProgress) {
      this.fmaService.fMASubmitLoanStage(this.appId, this.loanId).subscribe(res => {
        this.currentData.versionNumber = res.versionNumber;
        this.updateFmaStatus();
      });
    } else {
      this.updateFmaStatus();
    }
  }

  updateFmaStatus() {
    const updateFma = interval(5000)
      .pipe(
        mergeMap(() => this.caseService.caseGetFMASummary(this.route.snapshot.params.caseId)),
        takeUntil(this.onDestroy$),
      )
      .subscribe((res: FMASummaryResponse) => {
        this.loanStatus = res.loan?.status as string;
        this.rejectionReasons = res.loan?.rejectionReasons as RejectionReasonResponse[];
        this.caseSummaryService.updateFmaData(res);
        if (
          res.loan?.status === LoanStatus.Accepted ||
          res.loan?.status === LoanStatus.Rejected ||
          res.loan?.status === LoanStatus.Referred ||
          res.loan?.status === LoanStatus.Documentation
        ) {
          if (res.loan?.status === LoanStatus.Accepted || LoanStatus.Referred || res.loan?.status === LoanStatus.Documentation) {
            this.lenderPolicyCheckForm.get('idConfirmedCheck')?.enable({ emitEvent: false });
            this.lenderPolicyCheckForm.get('consentCheck')?.enable({ emitEvent: false });
          }
          updateFma.unsubscribe();
          this.dataService.setFormStatus(this.lenderPolicyCheckForm.status, this.STEP_NAME);
        }
      });
  }

  downloadDocument(description: string) {
    const id = this.stipulationService.caseDocuments?.filter(document => document.description === description)[0].id || '';

    this.documentService
      .documentGetRelatedDocumentDownloadLink(this.appId, id)
      .pipe(take(1))
      .subscribe((url: string) => {
        window.open(url, '_blank');
      });
  }

  private onChanges() {
    this.lenderPolicyCheckForm.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.lenderPolicyCheckForm.status, this.STEP_NAME);
    });

    this.lenderPolicyCheckForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentData.versionNumber = response.versionNumber;
        });
      });
  }

  hasUnsavedChanges(): boolean {
    return this.lenderPolicyCheckForm.dirty;
  }

  mapToDTO(): LendingPolicyCheckRequest {
    const { idConfirmedCheck, requiredDocumentsCheck, consentCheck } = this.lenderPolicyCheckForm.getRawValue();

    return {
      versionNumber: this.currentData.versionNumber as number,
      idConfirmedCheck: idConfirmedCheck || false,
      requiredDocumentsCheck: requiredDocumentsCheck || false,
      consentCheck: consentCheck || false,
    };
  }
}
