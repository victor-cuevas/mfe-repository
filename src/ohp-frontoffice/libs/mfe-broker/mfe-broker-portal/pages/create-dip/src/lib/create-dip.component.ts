import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import {
  CaseSummaryService,
  DataService,
  GenericStepForm,
  loadPersonalDetailsSuccess,
  MortgageTermService,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseStatusEnum,
  FMAService,
  Journey,
  LoanStage,
  LoanStateResponse,
  LoanStatus,
  PortalPermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { DialogData } from '@close-front-office/mfe-broker/shared-ui';

import { DipJourneyResolver } from './resolvers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dip-page',
  templateUrl: './create-dip.component.html',
})
export class CreateDipComponent implements OnInit, OnDestroy {
  childComponent: any | null = null;
  applicationDraftId = this.route.snapshot.data?.summary.applicationDraftId;
  loanId = this.route.snapshot.data?.summary.loanId;
  caseId = this.route.snapshot.paramMap.get('caseId');
  routePaths: typeof RoutePaths = RoutePaths;
  breadcrumb: MenuItem[] = [
    { label: this.translateService.instant('cases.title'), routerLink: '../../' },
    {
      label: this.translateService.instant('general.labels.case') + ' ' + this.caseId?.padStart(8, '0'),
      routerLink: '../',
    },
    { label: this.translateService.instant('createDip.titles.dip') },
  ];

  steps$ = this.stepSetupService.currentJourney$;

  get currentStep() {
    return this.stepSetupService.getCurrentStep();
  }

  formStatus: any = {};
  subscription: Subscription;
  portalPermissionType = PortalPermissionType;
  stageEnum = LoanStage;
  status = LoanStatus;
  caseStatusEnum = CaseStatusEnum;
  assigneeId = this.route.snapshot.data?.summary?.caseData?.assigneeId || '';
  caseStatus$ = this.caseSummaryService.caseStatus$;
  loanStatus$ = this.caseSummaryService.loanStatus$;
  loanStage$ = this.caseSummaryService.loanStage$;
  showEditDip = false;
  editDipDataPopup: DialogData | undefined;

  constructor(
    public stepSetupService: StepSetupService,
    private mortgageTermService: MortgageTermService,
    private translateService: TranslateService,
    private caseSummaryService: CaseSummaryService,
    private dataService: DataService,
    private fmaService: FMAService,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private spinnerService: SpinnerService,
    private resolver: DipJourneyResolver,
  ) {
    const regexp = /\/dip\/\w+/g;
    if (!regexp.test(router.url)) {
      this.router.navigate([this.stepSetupService.currentJourney[1].routerLink], { relativeTo: this.route });
    }
    // subscription to check if all fields of current step form are filled in
    this.subscription = this.dataService.formStatus$.subscribe(status => {
      this.stepSetupService.validateJourney(status);
      this.stepSetupService.checkConfirmStep(Journey.Dip);
    });
  }

  ngOnInit() {
    this.dataService.activeJourney = this.caseSummaryService.canEditDip();
  }

  ngOnDestroy(): void {
    this.mortgageTermService.highestMortgageTerm = 0;
    this.mortgageTermService.maxMortgageTerm = 0;
    this.store.dispatch(loadPersonalDetailsSuccess({ entity: {} }));
    this.dataService.reset();
    this.subscription.unsubscribe();
    this.resolver.onDestroy$.next(true);
  }

  onActivate(component: GenericStepForm): void {
    this.stepSetupService.setCurrentStep(component.STEP_NAME);
    this.childComponent = component;
  }

  public editDip(event: MouseEvent) {
    event.stopPropagation();
    this.showEditDip = true;
    this.editDipDataPopup = {
      type: 'danger',
      icon: 'pi pi-exclamation-triangle',
      header: this.translateService.instant('dialog.editDip'),
    };
  }

  cancelEditDip() {
    this.showEditDip = false;
  }

  confirmEditDip() {
    this.spinnerService.setIsLoading(true);
    this.fmaService
      .fMARollbackLoanStage(this.applicationDraftId, this.loanId)
      .pipe(
        finalize(() => {
          this.spinnerService.setIsLoading(false);
          this.showEditDip = false;
        }),
      )
      .subscribe((response: LoanStateResponse) => {
        this.caseSummaryService.draftStage = response.status;
        this.caseSummaryService.draftStatus = response.status;
        this.caseSummaryService.loanStage = response.stage;
        this.caseSummaryService.loanStatus = response.status;
        this.dataService.activeJourney = this.caseSummaryService.canEditDip();
        this.childComponent?.checkActiveJourney();
      });
  }
}
