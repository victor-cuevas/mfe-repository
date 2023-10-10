import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';

import { DataService, GenericStepForm, RoutePaths, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  DIPService,
  Journey,
  RetirementIncomeDetailsRequest,
  RetirementIncomeDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { RetirementIncomeComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

@Component({
  selector: 'dip-retirement-income',
  templateUrl: './dip-retirement-income.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DipRetirementIncomeComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.retirementIncome.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  routePaths: typeof RoutePaths = RoutePaths;
  initialData: RetirementIncomeDetailsResponse = this.route.snapshot.data?.retirementIncomeData || {};

  @ViewChild('retirementIncomeChild') retirementIncomeChild!: RetirementIncomeComponent;

  constructor(
    private dataService: DataService,
    private dipService: DIPService,
    private route: ActivatedRoute,
    private stepSetupService: StepSetupService,
    private toastService: ToastService,
    private translateService: TranslateService,
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

  saveData(): Observable<RetirementIncomeDetailsResponse> {
    return this.dipService.dIPPutRetirementIncomeDetails(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.retirementIncomeChild?.applicantsForm.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          {
            [this.STEP_NAME]: this.retirementIncomeChild?.applicantsForm.status,
            [this.stepSetupService.retirementIncome.automationId]: this.retirementIncomeChild?.applicantsForm?.status,
          },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<RetirementIncomeDetailsResponse> {
    return this.dipService.dIPGetRetirementIncomeDetails(this.appId);
  }

  mapToDTO(): RetirementIncomeDetailsRequest {
    return this.retirementIncomeChild.mapToDTO();
  }

  private onChanges(): void {
    this.retirementIncomeChild.applicantsForm?.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.retirementIncomeChild.applicantsForm.status, this.STEP_NAME);
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
