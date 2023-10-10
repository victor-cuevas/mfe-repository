import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AffordabilityCheckResponse, Journey } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { DataService, GenericStepForm, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AffordabilityCheckComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './fma-affordability-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmaAffordabilityCheckComponent extends GenericStepForm implements AfterViewInit {
  readonly STEP_NAME = this.stepSetupService.affordabilityCheck.automationId;
  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  currentData: AffordabilityCheckResponse = this.route.snapshot.data.affordabilityCheckData || {};

  @ViewChild('affordabilityCheckChild') affordabilityCheckChild!: AffordabilityCheckComponent;

  constructor(private route: ActivatedRoute, private stepSetupService: StepSetupService, private dataService: DataService) {
    super();
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setFormStatus(this.affordabilityCheckChild?.affordabilityCheckForm?.status, this.STEP_NAME);
          this.initialSave();
          this.disableSteps();
          this.onChanges();
        }
      });
  }

  private disableSteps() {
    if (this.affordabilityCheckChild?.affordabilityCheckForm?.status === 'VALID') {
      this.stepSetupService.setDisabledSteps([this.stepSetupService.solicitorDetails.automationId], false);
    } else {
      this.stepSetupService.setDisabledSteps(
        [
          this.stepSetupService.lenderPolicyCheck.automationId,
          this.stepSetupService.uploadStipulations.automationId,
          this.stepSetupService.feePayment.automationId,
        ],
        true,
      );
    }
  }

  private initialSave() {
    if (
      this.dataService.journeyProgress &&
      this.dataService.journeyProgress[this.STEP_NAME] !== 'VALID' &&
      this.affordabilityCheckChild.affordabilityCheckForm.status === 'VALID'
    ) {
      this.saveData().pipe(take(1)).subscribe();
    }
  }

  // should be implemented because of static GenericStepForm component
  getData(): Observable<undefined> {
    return of(undefined);
  }

  get isAffordable() {
    return (this.currentData?.affordabilityRatio && this.currentData.affordabilityRatio < 1) || false;
  }

  hasUnsavedChanges(): boolean {
    return this.affordabilityCheckChild?.affordabilityCheckForm?.dirty;
  }

  mapToDTO(): void {}

  saveData(): Observable<any> {
    return this.dataService.saveProgress(
      Journey.Fma,
      this.appId,
      this.loanId,
      { [this.STEP_NAME]: this.affordabilityCheckChild?.affordabilityCheckForm?.status },
      this.getData(),
    );
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  private onChanges() {
    this.affordabilityCheckChild.affordabilityCheckForm.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.affordabilityCheckChild?.affordabilityCheckForm?.status, this.STEP_NAME);
      this.saveData();
    });

    this.affordabilityCheckChild.affordabilityCheckForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME))
      .subscribe(() => this.saveData().subscribe());
  }
}
