import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';

import { DataService, GenericStepForm, RoutePaths, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  FMAService,
  Journey,
  RetirementIncomeDetailsRequest,
  RetirementIncomeDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { RetirementIncomeComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { FormControlStatus } from '@angular/forms';

@Component({
  templateUrl: './fma-retirement-income.component.html',
})
export class FmaRetirementIncomeComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.retirementIncome.automationId;

  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  initialData: RetirementIncomeDetailsResponse = this.route.snapshot.data?.retirementIncomeData || {};

  @ViewChild('retirementIncomeChild') retirementIncomeChild!: RetirementIncomeComponent;

  constructor(
    private stepSetupService: StepSetupService,
    private dataService: DataService,
    private fmaService: FMAService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.retirementIncomeChild.applicantsForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setFormStatus(this.retirementIncomeChild.applicantsForm?.status, this.STEP_NAME);
          this.onChanges();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.retirementIncomeChild.applicantsForm.dirty;
  }

  saveData(progressDataObject?: Record<string, FormControlStatus>): Observable<RetirementIncomeDetailsResponse> {
    return this.fmaService.fMAPutRetirementIncomeDetails(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.retirementIncomeChild.applicantsForm.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Fma,
          this.appId,
          this.loanId,
          {
            ...this.stepSetupService.validateFmaChecks(),
            [this.stepSetupService.retirementIncome.automationId]: this.retirementIncomeChild.applicantsForm.status,
          },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<any> {
    return this.fmaService.fMAGetRetirementIncomeDetails(this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId);
  }

  mapToDTO(): RetirementIncomeDetailsRequest {
    return this.retirementIncomeChild.mapToDTO();
  }

  private handleError() {
    this.saveData().subscribe(response => {
      this.initialData.versionNumber = response?.versionNumber as number;
    });
  }

  private onChanges(): void {
    this.retirementIncomeChild.applicantsForm?.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.retirementIncomeChild.applicantsForm.status, this.STEP_NAME);

      if (
        this.stepSetupService.stepIsValid(this.stepSetupService.affordabilityCheck) &&
        !this.retirementIncomeChild.applicantsForm.pristine
      ) {
        this.stepSetupService.invalidateStep(this.stepSetupService.affordabilityCheck.automationId);
      }
    });

    this.retirementIncomeChild.applicantsForm?.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.initialData.versionNumber = response.versionNumber;
        });
      });
  }
}
