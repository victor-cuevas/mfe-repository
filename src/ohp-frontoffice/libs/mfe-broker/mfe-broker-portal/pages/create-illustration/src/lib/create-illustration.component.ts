import { Component, OnDestroy } from '@angular/core';
import { MenuItem, Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IllustrationJourneyResolver } from './resolvers/illustration-journey.resolver';
import {
  CaseSummaryService,
  DataService,
  loadPersonalDetailsSuccess,
  MortgageTermService,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { IllustrationService, Journey } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { DialogData } from '@close-front-office/mfe-broker/shared-ui';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { switchMap, take } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';

@Component({
  selector: 'mbp-create-illustration',
  templateUrl: './create-illustration.component.html',
})
export class CreateIllustrationComponent implements OnDestroy {
  routePaths: typeof RoutePaths = RoutePaths;
  showConfirmDialog = false;
  steps$ = this.stepSetupService.currentJourney$;
  confirmCiData: DialogData = {
    header: 'Submit illustration',
    content:
      'Your illustration is ready to be submitted. Are you sure you want to proceed?\n' +
      'Once you submit this illustration, you will no longer be able to edit it.',
    type: 'success',
    icon: 'pi-check-circle',
  };
  caseId = this.route.parent?.snapshot.paramMap.get('caseId');
  loanId = this.route.snapshot.paramMap.get('loanId');

  subscription: Subscription;
  breadcrumb: MenuItem[] = [
    { label: this.translate.instant('cases.title'), routerLink: '/' },
    {
      label: this.translate.instant('general.labels.case') + ' ' + this.caseId,
      routerLink: '../../../../',
    },
    { label: this.translate.instant('createIllustration.titles.illustration') },
  ];
  messages: Message[] = [
    {
      severity: 'warn',
      summary: this.translateService.instant('createIllustration.steps.completedIllustrationMsg'),
    },
  ];

  constructor(
    public dataService: DataService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    public stepSetupService: StepSetupService,
    private resolver: IllustrationJourneyResolver,
    private router: Router,
    private mortgageTermService: MortgageTermService,
    private store: Store,
    private illustrationService: IllustrationService,
    private toastService: ToastService,
    private viewportScroller: ViewportScroller,
    private translateService: TranslateService,
    private caseSummaryService: CaseSummaryService,
  ) {
    const regexp = /\/loan\/(\d+)$/g;
    if (regexp.test(router.url)) {
      this.router.navigate([this.stepSetupService.currentJourney[1].routerLink], { relativeTo: this.route });
    }
    if (this.caseId && this.loanId) {
      this.dataService.activeJourney = this.caseSummaryService.canEditIllustration(
        +this.loanId,
        this.route.snapshot.parent?.data?.summary?.illustrationData,
        this.route.snapshot.parent?.data?.summary?.caseData.status,
      );
    }
    // subscription to check if all fields of current step form are filled in
    this.subscription = this.dataService.formStatus$.subscribe(status => {
      this.stepSetupService.validateJourney(status);
      this.stepSetupService.checkConfirmStep(Journey.Illustration);
    });
  }

  get currentStep() {
    return this.stepSetupService.getCurrentStep();
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
    this.viewportScroller.scrollToPosition(this.viewportScroller.getScrollPosition());
  }

  openConfirmDialog() {
    this.showConfirmDialog = true;
  }

  onCancelConfirmDialog() {
    this.showConfirmDialog = false;
  }

  onConfirmDialog() {
    this.spinnerService.setIsLoading(true);
    this.illustrationService
      .illustrationGetLoanDetails(
        this.route.snapshot?.data?.illustrationJourney?.illustrationData?.applicationDraftId,
        this.route.snapshot?.data?.illustrationJourney?.illustrationData?.loanId,
      )
      .pipe(
        switchMap(response =>
          this.illustrationService.illustrationSubmitIllustration(
            this.route.snapshot?.data?.illustrationJourney?.illustrationData?.applicationDraftId,
            this.route.snapshot?.data?.illustrationJourney?.illustrationData?.loanId,
            { versionNumber: (response.versionNumber as number) + 1 },
          ),
        ),
        take(1),
      )
      .subscribe(() => {
        this.router.navigate(['../../../../'], { relativeTo: this.route });
      });
  }
}
