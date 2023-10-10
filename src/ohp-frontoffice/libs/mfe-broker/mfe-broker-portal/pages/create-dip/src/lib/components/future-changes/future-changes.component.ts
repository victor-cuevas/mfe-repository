import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CodeTablesService,
  DataService,
  GenericStepForm,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantFutureChangesInIncomeRequest,
  ApplicantFutureChangesInIncomeResponse,
  DIPService,
  FutureChangeInIncome,
  FutureChangesInIncomeRequest,
  FutureChangesInIncomeResponse,
  Journey,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dip-future-changes',
  templateUrl: './future-changes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FutureChangesComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.futureChanges.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  typeOfChangeOptions = this.codeTablesService.getCodeTable('cdtb-futurefinancialchangecategory');
  changeOptions = this.codeTablesService.getCodeTable('cdtb-partyfinancialamountsign');
  reasonOptions = this.codeTablesService.getCodeTable('cdtb-futurefinancialchangereason');
  timeScaleOptions = this.codeTablesService.getCodeTable('cdtb-broker-timescale');

  routePaths: typeof RoutePaths = RoutePaths;
  currentData: FutureChangesInIncomeResponse = this.route.snapshot.data.futureChanges;

  applicantsFormArray = this.fb.array([]);

  futureChangesFormArray(index: number): FormArray {
    return this.applicantsFormArray.at(index).get('futureChangesInIncome') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    private dipService: DIPService,
    private toastService: ToastService,
    private stepSetupService: StepSetupService,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef,
    private codeTablesService: CodeTablesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setFormData();
  }

  ngAfterViewInit(): void {
    this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.applicantsFormArray)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.applicantsFormArray.dirty;
  }

  saveData(): Observable<FutureChangesInIncomeResponse> {
    return this.dipService.dIPPutFutureChangesInIncome(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        this.applicantsFormArray.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.applicantsFormArray.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<FutureChangesInIncomeResponse> {
    return this.dipService.dIPGetFutureChangesInIncome(this.appId);
  }

  mapToDTO(): FutureChangesInIncomeRequest {
    const applicantFutureChangesInIncome: ApplicantFutureChangesInIncomeRequest[] = this.applicantsFormArray
      .getRawValue()
      .map(applicant => ({
        applicantId: applicant.applicantId,
        futureChangesInIncome: applicant.awareOfFutureChanges ? applicant.futureChangesInIncome : [],
        hasFutureChangesIncome: applicant.awareOfFutureChanges,
      })) as Array<ApplicantFutureChangesInIncomeRequest>;

    return {
      versionNumber: this.currentData.versionNumber as number,
      applicantFutureChangesInIncome,
    };
  }

  addFutureChange(index: number) {
    this.futureChangesFormArray(index).push(this.createFutureChangesForm({}));
  }

  removeFutureChanges(indexApplicant: number, indexFutureChanges: number) {
    this.futureChangesFormArray(indexApplicant).removeAt(indexFutureChanges);
    this.applicantsFormArray.markAsDirty();
  }

  private onChanges() {
    this.applicantsFormArray.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
    });

    this.applicantsFormArray.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
      this.saveData().subscribe(response => {
        this.currentData.versionNumber = response.versionNumber;
      });
    });
  }

  private setFormData() {
    this.currentData?.applicantFutureChangesInIncome?.forEach((data: ApplicantFutureChangesInIncomeResponse) => {
      const futureChangesForm = this.fb.group({
        applicantId: data.applicantInfo?.applicantId,
        applicantFullName: `${data.applicantInfo?.firstName} ${data.applicantInfo?.familyName}`,
        awareOfFutureChanges: [data.hasFutureChangesIncome, Validators.required],
        futureChangesInIncome: this.fb.array([]),
      });
      const futureChangesFormArray = futureChangesForm.controls.futureChangesInIncome as FormArray;

      futureChangesForm.get('awareOfFutureChanges')?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          (futureChangesForm.get('futureChangesInIncome') as FormArray)?.push(this.createFutureChangesForm({}));
        } else {
          this.clearFormArray(futureChangesForm.get('futureChangesInIncome') as FormArray);
        }
      });

      if (data.hasFutureChangesIncome) {
        if (data.futureChangesInIncome?.length) {
          data.futureChangesInIncome.forEach((change: FutureChangeInIncome) => {
            futureChangesFormArray.push(this.createFutureChangesForm(change));
          });
        } else {
          futureChangesFormArray.push(this.createFutureChangesForm({}));
        }
      }
      this.applicantsFormArray.push(futureChangesForm);
    });
  }

  private createFutureChangesForm(data: FutureChangeInIncome): FormGroup {
    return this.fb.group({
      typeOfChange: [data.typeOfChange, Validators.required],
      changeType: [data.changeType, Validators.required],
      reason: [data.reason, Validators.required],
      timeScale: [data.timeScale, Validators.required],
      description: [data.description],
    });
  }

  /**
   * Clears a formArray
   *
   * @param formArray
   */
  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
}
