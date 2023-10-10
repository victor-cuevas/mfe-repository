import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CodeTablesService,
  DataService,
  GenericStepForm,
  getLoanAmount,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AdditionalBorrowingReason,
  AdditionalBorrowingRequest,
  AdditionalBorrowingResponse,
  DIPService,
  Journey,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dip-additional-borrowing',
  templateUrl: './additional-borrowing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalBorrowingComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.additionalBorrowing.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  MODE: typeof Mode = Mode;

  reasonOptions = this.codeTablesService.getCodeTable('cdtb-additionalborrowingreason');

  additionalBorrowingFormArray = this.fb.array([]);

  toBeAllocated = 0;
  totalAmount = 0;
  currentData: AdditionalBorrowingResponse = this.route.snapshot.data?.additionalBorrowingData || {};

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    public stepSetupService: StepSetupService,
    private dipService: DIPService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef,
    private codeTablesService: CodeTablesService,
    private store: Store,
  ) {
    super();
  }

  ngOnInit() {
    this.store.select(getLoanAmount).subscribe(resp => (this.totalAmount = resp as number));
    this.stepSetupService.highlightMissingFields(this.STEP_NAME, this.additionalBorrowingFormArray);
    this.onChanges();
  }

  ngAfterViewInit(): void {
    this.setFormData();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {}

  getData(): Observable<AdditionalBorrowingResponse> {
    return this.dipService.dIPGetAdditionalBorrowing(this.appId, this.loanId);
  }

  hasUnsavedChanges(): boolean {
    return this.additionalBorrowingFormArray.dirty;
  }

  mapToDTO(): AdditionalBorrowingRequest {
    const values = this.additionalBorrowingFormArray.getRawValue();
    const additionalBorrowingReasonsArray: AdditionalBorrowingReason[] = [];

    values.forEach(additionalBorrowing => {
      additionalBorrowingReasonsArray.push({ reason: additionalBorrowing.reason, amount: additionalBorrowing.amount });
    });

    return {
      versionNumber: this.currentData.versionNumber as number,
      additionalBorrowingReasons: additionalBorrowingReasonsArray,
    };
  }

  saveData(): Observable<AdditionalBorrowingResponse> {
    return this.dipService.dIPPutAdditionalBorrowing(this.appId, this.loanId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.additionalBorrowingFormArray.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.additionalBorrowingFormArray.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  onChanges(): void {
    this.additionalBorrowingFormArray.valueChanges.subscribe((value: AdditionalBorrowingReason[]) => {
      let result = 0;

      value.forEach((el: AdditionalBorrowingReason) => {
        result += el?.amount as number;
      });
      this.toBeAllocated = this.currentData?.additionalBorrowingAmountRequired
        ? this.currentData?.additionalBorrowingAmountRequired - result
        : this.totalAmount - result;
    });

    this.additionalBorrowingFormArray.valueChanges.subscribe(() => {
      if (this.additionalBorrowingFormArray.status === 'VALID' && this.toBeAllocated == 0) {
        this.dataService.setFormStatus(this.additionalBorrowingFormArray.status, this.STEP_NAME);
      } else {
        this.dataService.setFormStatus('INVALID', this.STEP_NAME);
      }
    });

    this.additionalBorrowingFormArray.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentData.versionNumber = response.versionNumber;
        });
      });
  }

  addAdditionalBorrowingForm() {
    this.additionalBorrowingFormArray.push(this.createAdditionalBorrowingForm());
  }

  removeAdditionalBorrowingForm(index: number) {
    this.additionalBorrowingFormArray.removeAt(index);
  }

  private setFormData() {
    const additionalBorrowingReasons = this.currentData?.additionalBorrowingReasons;

    if (additionalBorrowingReasons?.length) {
      additionalBorrowingReasons.forEach(value => {
        const form = this.createAdditionalBorrowingForm(value);

        this.additionalBorrowingFormArray.push(form);
      });
    } else {
      const form = this.createAdditionalBorrowingForm();

      this.additionalBorrowingFormArray.push(form);
    }

    this.cd.detectChanges();
  }

  private createAdditionalBorrowingForm(data?: AdditionalBorrowingReason) {
    return this.fb.group({
      reason: [{ value: data?.reason || null, disabled: !this.dataService.activeJourney }, Validators.required],
      amount: [{ value: data?.amount || null, disabled: !this.dataService.activeJourney }, Validators.required],
    });
  }
}
