import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  DIPService,
  Journey,
  LenderFee,
  StepStatusEnum,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { AdviceFeesComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { Observable, of } from 'rxjs';
import { debounceTime, map, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dip-advice-fees-step',
  templateUrl: './dip-advice-and-fees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DipAdviceAndFeesComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.adviceFees.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  currentData: AdviceAndFeesResponse = this.route.snapshot.data?.adviceFeesData || {};

  @ViewChild('adviceFeesChild') adviceFeesChild!: AdviceFeesComponent;

  constructor(
    private route: ActivatedRoute,
    private dipService: DIPService,
    private dataService: DataService,
    private stepSetupService: StepSetupService,
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
          this.adviceFeesChild.lenderFees.disable({ emitEvent: false });
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
      .saveProgress(Journey.Dip, this.appId, this.loanId, {
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
    return this.dipService.dIPPutAdviceAndFees(this.appId, this.loanId, this.mapToDTO()).pipe(
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
      lenderFees: formValues.lenderFees.map((el: LenderFee & { feFeeType?: string }): LenderFee => {
        delete el.feFeeType;
        return el;
      }),
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
