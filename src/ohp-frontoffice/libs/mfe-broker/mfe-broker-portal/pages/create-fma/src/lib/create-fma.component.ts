import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import {
  CaseSummaryService,
  DataService,
  loadPersonalDetailsSuccess,
  MortgageTermService,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseStatusEnum,
  FMAService,
  Journey,
  LoanStateResponse,
  PortalPermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { FmaJourneyResolver } from './resolvers/fma-journey.resolver';
import { Store } from '@ngrx/store';
import { DialogData } from '@close-front-office/mfe-broker/shared-ui';
import { finalize, takeUntil } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-broker/core';

@Component({
  templateUrl: './create-fma.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFmaComponent implements OnInit, AfterViewInit, OnDestroy {
  caseId = this.route.snapshot.paramMap.get('caseId');
  routePaths: typeof RoutePaths = RoutePaths;
  applicationDraftId = this.route.snapshot.data?.summary.applicationDraftId;
  loanId = this.route.snapshot.data?.summary.loanId;
  activeJourney$ = this.dataService.activeJourney$;
  portalPermissionType = PortalPermissionType;
  caseStatus$ = this.caseSummaryService.caseStatus$;
  caseStatusEnum = CaseStatusEnum;

  breadcrumb: MenuItem[] = [
    { label: this.translate.instant('cases.title'), routerLink: '../../' },
    {
      label: this.translate.instant('general.labels.case') + ' ' + this.caseId?.padStart(8, '0'),
      routerLink: '../',
    },
    { label: this.translate.instant('createFma.titles.fma') },
  ];
  showEditFma = false;
  editFmaDataPopup: DialogData | undefined;

  get currentStep() {
    return this.stepSetupService.getCurrentStep();
  }

  steps$ = this.stepSetupService.currentJourney$;
  formStatus: any = {};
  subscription!: Subscription;
  formStatus$ = this.dataService.formStatus$;

  constructor(
    private caseSummaryService: CaseSummaryService,
    public stepSetupService: StepSetupService,
    private translate: TranslateService,
    private spinnerService: SpinnerService,
    private fmaService: FMAService,
    private dataService: DataService,
    private mortgageTermService: MortgageTermService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private resolver: FmaJourneyResolver,
  ) {
    const regexp = /\/fma$/g;
    if (regexp.test(router.url)) {
      this.router.navigate([this.stepSetupService.currentJourney[1].routerLink], { relativeTo: this.route });
    }
  }

  ngOnInit(): void {
    // subscription to check if all fields of current step form are filled in
    this.subscription = this.dataService.formStatus$.subscribe(status => {
      this.stepSetupService.validateJourney(status);
      this.stepSetupService.checkConfirmStep(Journey.Fma);
      this.cd.detectChanges();
    });
    this.dataService.activeJourney = this.caseSummaryService.canEditFma();
  }

  ngAfterViewInit(): void {
    this.stepSetupService.currentStep$.pipe(takeUntil(this.resolver.onDestroy$)).subscribe(() => {
      this.dataService.activeJourney = this.caseSummaryService.canEditFma();
    });
  }

  ngOnDestroy(): void {
    this.mortgageTermService.highestMortgageTerm = 0;
    this.mortgageTermService.maxMortgageTerm = 0;
    this.store.dispatch(loadPersonalDetailsSuccess({ entity: {} }));
    this.dataService.reset();
    this.subscription.unsubscribe();
    this.resolver.onDestroy$.next(true);
  }

  onActivate(component: any): void {
    this.stepSetupService.setCurrentStep(component.STEP_NAME);
  }

  public editFma(event: MouseEvent) {
    event.stopPropagation();
    this.showEditFma = true;
    this.editFmaDataPopup = {
      type: 'danger',
      icon: 'pi pi-exclamation-triangle',
      header: this.translate.instant('dialog.editFma'),
    };
  }

  cancelEditFma() {
    this.showEditFma = false;
  }

  confirmEditFma() {
    this.spinnerService.setIsLoading(true);
    this.fmaService
      .fMARegressLoanStage(this.applicationDraftId, this.loanId)
      .pipe(
        finalize(() => {
          this.spinnerService.setIsLoading(false);
          this.showEditFma = false;
          this.cd.detectChanges();
        }),
      )
      .subscribe((response: LoanStateResponse) => {
        this.dataService.activeJourney = true;
        this.caseSummaryService.draftStage = response.status;
        this.caseSummaryService.draftStatus = response.status;
        this.caseSummaryService.loanStage = response.stage;
        this.caseSummaryService.loanStatus = response.status;
      });
  }
}
