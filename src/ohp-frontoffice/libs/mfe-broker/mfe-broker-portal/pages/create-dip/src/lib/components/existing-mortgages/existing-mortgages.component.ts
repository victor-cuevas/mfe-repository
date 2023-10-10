import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CaseSummaryService,
  CodeTablesService,
  DataService,
  GenericStepForm,
  loadExistingMortgagesSuccess,
  PortalValidators,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  DIPService,
  ExistingLenderEnum,
  ExistingMortgageResponse,
  Journey,
  OwnerOfTheProperty,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { Store } from '@ngrx/store';
import { isAllChecked } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { CustomValidators, GroupValidators } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'dip-existing-mortgages',
  templateUrl: './existing-mortgages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingMortgagesComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.existingMortgages.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  MODE: typeof Mode = Mode;

  existingLenderOptions = this.codeTablesService.getCodeTable('cdtb-existinglender');

  currentData: ExistingMortgageResponse = this.route.snapshot.data?.existingMortgageData || {};
  applicantsArray: Array<OwnerOfTheProperty> = [];

  existingLenderEnum: typeof ExistingLenderEnum = ExistingLenderEnum;

  get ownersOfThePropertyFormArray() {
    return this.existingMortgagesForm.controls.ownersOfTheProperty as FormArray;
  }

  existingMortgagesForm = this.fb.group({
    isPropertyMortgaged: [this.currentData.isPropertyMortgaged, Validators.required],
    ownersOfTheProperty: this.fb.array([], isAllChecked()),
    anotherParty: null,
    estimatedValueOfTheProperty: [this.currentData.estimatedValueOfTheProperty],
    currentOutstandingBalance: this.currentData.currentOutstandingBalance,
    //monthlyPayment: this.currentData.monthlyPayment, //TODO out of scope for April
    existingLender: this.currentData.existingLender,
    otherLender: this.currentData.otherLender,
    //mortgageAccountNumber: this.currentData.mortgageAccountNumber, //TODO out of scope for April
    isRepaidOnCompletionOfTheApplication: this.currentData.isRepaidOnCompletionOfTheApplication,
    amountToBeRepaid: this.currentData.amountToBeRepaid,
    continuingBalance: this.currentData.continuingBalance,
  });

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    private stepSetupService: StepSetupService,
    private dipService: DIPService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private codeTablesService: CodeTablesService,
    private caseSummaryService: CaseSummaryService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.currentData.applicants?.length) {
      this.currentData.applicants.forEach(el => {
        this.applicantsArray.push(el);
      });
    }
    this.setInitialValidation();
    this.dataService.setFormStatus(this.existingMortgagesForm.status, this.STEP_NAME);
    this.checkActiveJourney();
  }

  ngAfterViewInit(): void {
    this.applicantsArray.forEach(el => {
      this.ownersOfThePropertyFormArray.push(new FormControl(el.isOwner));
    });
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.existingMortgagesForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.existingMortgagesForm.get('estimatedValueOfTheProperty')?.disable();
          this.existingMortgagesForm.get('amountToBeRepaid')?.disable();
          this.existingMortgagesForm.get('continuingBalance')?.disable();
          this.onChanges();
        }
      });
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.existingMortgagesForm.dirty;
  }

  saveData(): Observable<ExistingMortgageResponse> {
    return this.dipService.dIPPutExistingMortgage(this.appId, this.mapToDTO()).pipe(
      concatMap(() => {
        if (!this.existingMortgagesForm.controls.amountToBeRepaid.pristine) {
          this.caseSummaryService.checkProductsAvailability(this.appId, this.loanId);
        }

        this.existingMortgagesForm.markAsDirty();
        return this.dataService.saveProgress(
          Journey.Dip,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.existingMortgagesForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  protected saveOnRedux(item: ExistingMortgageResponse): void {
    this.store.dispatch(loadExistingMortgagesSuccess({ entity: item }));
  }

  getData(): Observable<ExistingMortgageResponse> {
    return this.dipService.dIPGetExistingMortgage(this.appId);
  }

  mapToDTO() {
    const data = this.existingMortgagesForm.getRawValue();

    const selectedOwnersOfProperty: Array<number> = data.ownersOfTheProperty
      .map((checked: boolean, i: number) => (checked ? this.applicantsArray[i].applicantId : null))
      .filter((selectedApplicants: number) => selectedApplicants != null);

    return {
      isPropertyMortgaged: data.isPropertyMortgaged,
      ownersOfTheProperty: selectedOwnersOfProperty,
      estimatedValueOfTheProperty: data.estimatedValueOfTheProperty,
      currentOutstandingBalance: data.isPropertyMortgaged ? data.currentOutstandingBalance : null,
      //monthlyPayment: data.isPropertyMortgaged ? data.monthlyPayment : null, //TODO out of scope for April
      existingLender: data.isPropertyMortgaged ? data.existingLender : null,
      otherLender: data.existingLender === 'other' ? data.otherLender : null,
      //mortgageAccountNumber: data.isPropertyMortgaged ? data.mortgageAccountNumber : null, //TODO out of scope for April
      isRepaidOnCompletionOfTheApplication: data.isPropertyMortgaged ? data.isRepaidOnCompletionOfTheApplication : null,
      amountToBeRepaid: data.isPropertyMortgaged && data.isRepaidOnCompletionOfTheApplication ? data.amountToBeRepaid : null,
      continuingBalance: data.isPropertyMortgaged && data.isRepaidOnCompletionOfTheApplication ? data.continuingBalance : null,
      versionNumber: this.currentData.versionNumber as number,
    };
  }

  onChanges(): void {
    this.existingMortgagesForm.valueChanges.subscribe(val => {
      this.dataService.setFormStatus(this.existingMortgagesForm.status, this.STEP_NAME);
      this.store.dispatch(loadExistingMortgagesSuccess({ entity: this.mapToDTO() }));
    });

    this.existingMortgagesForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.currentData.versionNumber = response.versionNumber;
          this.saveOnRedux(response);
        });
      });

    //Dynamic validation
    const formControls = this.existingMortgagesForm as FormGroup;

    formControls.get('currentOutstandingBalance')?.valueChanges.subscribe(value => {
      formControls.get('amountToBeRepaid')?.setValue(value);
    });

    formControls.get('isPropertyMortgaged')?.valueChanges.subscribe(value => {
      if (value) {
        this.setRequiredValidation(formControls);
      } else {
        this.setValidationToNull(formControls);
      }
      this.updateValidation(formControls);
    });

    formControls.get('existingLender')?.valueChanges.subscribe(value => {
      if (value === ExistingLenderEnum.OTHER && formControls.get('isPropertyMortgaged')?.value) {
        formControls.get('otherLender')?.setValidators(Validators.required);
      } else {
        formControls.get('otherLender')?.setValidators(null);
      }
      formControls.get('otherLender')?.updateValueAndValidity();
    });

    this.continuingBalanceCalculation(formControls);
    this.cd.detectChanges();
  }

  private setInitialValidation() {
    if (this.existingMortgagesForm.get('isPropertyMortgaged')?.value) {
      this.setRequiredValidation(this.existingMortgagesForm);
    } else {
      this.setValidationToNull(this.existingMortgagesForm);
    }
    this.updateValidation(this.existingMortgagesForm);
  }

  private continuingBalanceCalculation(formControls: FormGroup) {
    formControls.get('currentOutstandingBalance')?.valueChanges.subscribe(value => {
      formControls.get('continuingBalance')?.setValue(value - formControls.get('amountToBeRepaid')?.value);
    });

    formControls.get('amountToBeRepaid')?.valueChanges.subscribe(value => {
      formControls.get('continuingBalance')?.setValue(formControls.get('currentOutstandingBalance')?.value - value);
    });
  }

  private updateValidation(formControls: FormGroup) {
    formControls.get('currentOutstandingBalance')?.updateValueAndValidity();
    formControls.get('existingLender')?.updateValueAndValidity();
    formControls.get('otherLender')?.updateValueAndValidity();
    formControls.get('isRepaidOnCompletionOfTheApplication')?.updateValueAndValidity();
    formControls.get('amountToBeRepaid')?.updateValueAndValidity();
    this.existingMortgagesForm.updateValueAndValidity();
  }

  private setValidationToNull(formControls: FormGroup) {
    formControls.get('currentOutstandingBalance')?.setValidators(null);
    formControls.get('existingLender')?.setValidators(null);
    formControls.get('otherLender')?.setValidators(null);
    formControls.get('isRepaidOnCompletionOfTheApplication')?.setValidators(null);
    formControls.get('amountToBeRepaid')?.setValidators(null);
    this.existingMortgagesForm.clearValidators();
  }

  private setRequiredValidation(formControls: FormGroup) {
    formControls.get('currentOutstandingBalance')?.setValidators(Validators.required);
    formControls.get('existingLender')?.setValidators(Validators.compose([Validators.required, PortalValidators.ExistingLenderIsClient()]));
    formControls.get('isRepaidOnCompletionOfTheApplication')?.setValidators([Validators.required, CustomValidators.valueIs(true)]);
    this.existingMortgagesForm.addValidators(GroupValidators.checkOneFieldGreaterThan('amountToBeRepaid', 'currentOutstandingBalance'));
  }
}
