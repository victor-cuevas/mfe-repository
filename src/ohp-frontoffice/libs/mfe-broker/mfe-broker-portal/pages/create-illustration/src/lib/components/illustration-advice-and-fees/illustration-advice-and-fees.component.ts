import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, debounceTime, take, takeUntil } from 'rxjs/operators';
import {
  DataService,
  GenericStepForm,
  RoutePaths,
  StepSetupService,
  CaseSummaryService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AdviceAndFeesRequest,
  AdviceAndFeesResponse,
  IllustrationService,
  Journey,
  StepStatusEnum,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { AdviceFeesComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

@Component({
  selector: 'mbp-advice-and-fees-step',
  templateUrl: './illustration-advice-and-fees.component.html',
})
export class IllustrationAdviceAndFeesComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.adviceFees.automationId;

  private appId = this.route.snapshot.parent?.data.illustrationJourney?.illustrationData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.illustrationJourney?.illustrationData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  currentData: AdviceAndFeesResponse = this.route.snapshot.data?.adviceFeesData || {};

  @ViewChild('adviceFeesChild') adviceFeesChild!: AdviceFeesComponent;

  constructor(
    private dataService: DataService,
    private stepSetupService: StepSetupService,
    private route: ActivatedRoute,
    private illustrationService: IllustrationService,
    private caseSummaryService: CaseSummaryService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
    super.onDestroy();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.adviceFeesChild.adviceFeesForm)
      .pipe(take(1))
      .subscribe(isActive => {
        this.currentData.lenderFees?.forEach(lenderFee => this.adviceFeesChild.addLenderFee(lenderFee));
        this.adviceFeesChild.adviceFeesForm.controls.adviceGiven.disable();
        if (isActive) {
          this.updateStepStatus();
          this.onChanges();
        } else {
          this.adviceFeesChild.lenderFees.disable();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.adviceFeesChild.adviceFeesForm.dirty;
  }

  updateStepStatus(): void {
    this.dataService.setStepStatus(this.getStepStatus(), this.STEP_NAME);
  }

  getStepStatus(): StepStatusEnum {
    return this.adviceFeesChild.adviceFeesForm.status === 'VALID' ? StepStatusEnum.VALID : StepStatusEnum.INVALID;
  }

  saveProgress(): void {
    this.dataService
      .saveProgress(Journey.Illustration, this.appId, this.loanId, {
        [this.STEP_NAME]: this.getStepStatus(),
      })
      .subscribe();
  }

  saveData(): Observable<AdviceAndFeesResponse> {
    if (this.isSaving) {
      this.adviceFeesChild?.adviceFeesForm?.markAsDirty();
      return of();
    }
    this.isSaving = true;
    this.adviceFeesChild?.adviceFeesForm?.markAsPristine();
    return this.illustrationService.illustrationPutAdviceAndFees(this.appId, this.loanId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      map((res: AdviceAndFeesResponse) => {
        this.currentData.versionNumber = res.versionNumber;
        this.caseSummaryService.checkProductsAvailability(this.appId, this.loanId);
        this.isSaving = false;
        this.saveProgress();
        return res;
      }),
    );
  }

  mapToDTO(): AdviceAndFeesRequest {
    const formValues = this.adviceFeesChild.adviceFeesForm.getRawValue();

    return {
      versionNumber: this.currentData.versionNumber as number,
      adviceGiven: formValues.adviceGiven.value,
      adviceAccepted: formValues.adviceAccepted,
      intermediaryFees: formValues.intermediaryFees,
      lenderFees: formValues.lenderFees,
    };
  }

  private onChanges() {
    this.adviceFeesChild.adviceFeesForm?.valueChanges.subscribe(() => {
      this.updateStepStatus();
    });

    this.adviceFeesChild.adviceFeesForm?.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe();
      });
  }
}
