import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CaseSummaryService, DataService, Stage2 } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseDataResponse,
  CaseStage,
  CaseStatusEnum,
  ContactInformationResponse,
  KeyValuePairOfStringAndString,
  LoanStatus,
  PortalPermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { PermissionContextService } from '@close-front-office/mfe-broker/core';
import { CaseTransferComponent } from '@close-front-office/mfe-broker/shared-ui';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicantsDialogComponent } from '../applicants-dialog/applicants-dialog.component';

interface DataSet {
  borderWidth: number;
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
}

interface DataDone {
  labels: string[];
  datasets: DataSet[];
}

interface LabelSettings {
  fullWidth: boolean;
  usePointStyle: boolean;
  fontColor: string;
  fontSize: number;
  padding: number;
  fontStyle: string;
  fontFamily: string;
  boxWidth: number;
}

interface Legend {
  onClick: null;
  display: boolean;
  position: string;
  labels: LabelSettings;
}

interface OptionsObject {
  cutoutPercentage: number;
  legend: Legend;
}

@Component({
  selector: 'mbp-case-summary',
  templateUrl: './case-summary.component.html',
})
export class CaseSummaryComponent implements OnInit, OnDestroy {
  portalPermissionType = PortalPermissionType;
  caseData?: CaseDataResponse = this.route.snapshot.data.summary?.caseData;
  loanData = this.route.snapshot.data.summary?.dipData?.loan;
  processStage!: string;
  onDestroy$ = new Subject<boolean>();
  caseStageEnum = CaseStage;
  caseStatusEnum = CaseStatusEnum;
  loanStatusEnum = LoanStatus;
  caseStageToDisplay$ = this.caseSummaryService.caseStage$.pipe(
    map(stage => {
      if (stage === Stage2.Dip) return 'Decision in principle';
      if (stage === Stage2.Fma) return 'Full mortgage application';
      return stage;
    }),
  );
  caseStage$ = this.caseSummaryService.caseStage$;
  caseStatus$ = this.caseSummaryService.caseStatus$;
  loanStatus$ = this.caseSummaryService.loanStatus$;
  rejectionReasons$ = this.caseSummaryService.rejectionReasons$;
  dipExpirationDate$ = this.caseSummaryService.dipExpirationDate$;

  propertyPurpose?: KeyValuePairOfStringAndString = this.caseData?.customData?.find(
    (el: KeyValuePairOfStringAndString) => el.key === 'PropertyPurpose',
  );
  dataForTemplateHeader?: { title: string; icon: string };
  dataForTemplateContent?: ContactInformationResponse[] | null;
  caseId = this.route.snapshot.paramMap.get('caseId');
  showApplicants = false;

  dataDone?: DataDone;
  optionsObject?: OptionsObject;
  displayProgressDialog = false;
  progress = 10;

  ref!: DynamicDialogRef;
  showSuccessfulModal = false;
  firmId = this.route.snapshot?.parent?.parent?.parent?.parent?.parent?.paramMap.get('firmId');
  newAssigneeName = '';
  shouldRedirect = false;

  constructor(
    public dialogService: DialogService,
    public permissionContextService: PermissionContextService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public caseSummaryService: CaseSummaryService,
    public dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.caseStage$.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      this.processStage = this.mappingStage(value);
    });

    //TODO to modify when we know how to do this calculation
    const progressData: number[] = [this.progress, 100 - this.progress];
    this.dataDone = {
      labels: [this.translate.instant('caseSummary.labels.done'), this.translate.instant('caseSummary.labels.missing')],
      datasets: [
        {
          borderWidth: 0,
          data: progressData,
          backgroundColor: ['#219653', '#F7F8FA'],
          hoverBackgroundColor: ['#219653', '#F7F8FA'],
        },
      ],
    };

    this.optionsObject = {
      cutoutPercentage: 80,
      legend: {
        onClick: null,
        display: true,
        position: 'bottom',
        labels: {
          fullWidth: false,
          usePointStyle: true,
          fontColor: '#4F4F4F',
          fontSize: 16,
          padding: 30,
          fontStyle: 'bold',
          fontFamily: 'Arial',
          boxWidth: 10,
        },
      },
    };
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  showCaseDialog() {
    this.dialogService.open(ApplicantsDialogComponent, {
      data: { contactsInformation: this.caseData?.contactsInformation },
      header: `You have ${this.caseData?.contactsInformation?.length} applicants saved in this case`,
      width: '75%',
    });
  }

  closeApplicantsDialog() {
    this.showApplicants = false;
  }

  editAssignee() {
    this.ref = this.dialogService.open(CaseTransferComponent, {
      header: this.translateService.instant('cases.transfer.header'),
      width: '50vw',
      modal: true,
      baseZIndex: 1000,
      styleClass: 'transfer-dialog',
      data: {
        firmId: this.firmId,
        cases: [this.caseData],
      },
    });
    this.ref.onClose.subscribe(data => {
      if (data && this.caseData?.assigneeFullName && this.caseData.assigneeId) {
        this.caseData.assigneeFullName = data.intermediary.fullName;
        this.caseData.assigneeId = data.intermediary.intermediaryId;
        this.newAssigneeName = data.intermediary.fullName;
        this.shouldRedirect = data.shouldRedirect;
        this.showSuccessfulModal = true;
      }
    });
  }

  closeSuccessfulModal() {
    this.showSuccessfulModal = false;
    if (this.shouldRedirect) {
      this.router.navigate(['']);
    }
  }

  private mappingStage(stage: string | null | undefined): string {
    switch (stage) {
      case CaseStage.Fma:
        this.progress = 95;
        return 'Full Mortgage application (in progress) ';
      case CaseStage.Illustration:
        this.progress = 35;
        return 'Illustration';
      case CaseStage.Dip:
        this.progress = 40;
        return 'Decision in Principle (in progress)';
      default:
        this.progress = 10;
        return 'New case';
    }
  }
}
