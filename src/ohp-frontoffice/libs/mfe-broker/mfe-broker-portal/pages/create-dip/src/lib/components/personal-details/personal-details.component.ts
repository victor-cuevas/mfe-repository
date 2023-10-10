import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Calendar } from 'primeng/calendar';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, take, takeUntil } from 'rxjs/operators';

//Local imports
import {
  CodeTablesService,
  countriesOptions,
  DataService,
  GenericStepForm,
  loadPersonalDetailsSuccess,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ApplicantPersonalDetails,
  DIPService,
  Journey,
  PersonalDetailsRequest,
  PersonalDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';
import { TitleCasePipe } from '@angular/common';

function countriesOptionsUkOnTop() {
  const array = [...countriesOptions];
  const initialIndex = countriesOptions.findIndex(el => el.value === 'GB');

  array.splice(0, 0, array.splice(initialIndex, 1)[0]);
  return array;
}

@Component({
  selector: 'dip-personal-details',
  templateUrl: './personal-details.component.html',
})
export class PersonalDetailsComponent extends GenericStepForm implements OnInit, OnDestroy {
  @ViewChild('calendar', { static: false }) private calendar: Calendar | undefined;
  readonly STEP_NAME = this.stepSetupService.personalDetail.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  maxRetirementAge = CONFIGURATION_MOCK.MAX_RETIREMENT_AGE;

  shouldSaveOnRedux = true;

  titleOptions = this.codeTablesService.getCodeTable('cdtb-persontitle');
  maritalStatusOption = this.codeTablesService.getCodeTable('cdtb-ads-civilstate');
  nationalityOptions = countriesOptionsUkOnTop();
  vulnerabilityOptions = this.codeTablesService.getCodeTable('cdtb-vulnerabilitytype');

  currentData = this.route.snapshot.data.personalDetails;

  applicantsFormArray = this.fb.array([]);

  //Range calendar
  minYear = new Date().getFullYear() - 18;
  maxYear = new Date().getFullYear() - 80;

  maxDate = new Date(this.minYear, 11, 31);
  minDate = new Date(this.maxYear, 0, 1);

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    private dipService: DIPService,
    public stepSetupService: StepSetupService,
    private store: Store,
    private codeTablesService: CodeTablesService,
    private titleCasePipe: TitleCasePipe,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setFormData();
    this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
    this.checkActiveJourney();
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

  saveData(): Observable<PersonalDetailsResponse> {
    return this.dipService.dIPPutPersonalDetails(this.appId, this.mapToDTO()).pipe(
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

  getData(): Observable<PersonalDetailsResponse> {
    return this.dipService.dIPGetPersonalDetails(this.appId);
  }

  mapToDTO(): PersonalDetailsRequest {
    const formValues = this.applicantsFormArray.getRawValue();
    const applicantPersonalDetails = formValues.map(el => {
      const mappedFormValues = {
        ...el,
        firstName: this.titleCasePipe.transform(el.firstName),
        familyName: this.titleCasePipe.transform(el.familyName),
        secondName: this.titleCasePipe.transform(el.secondName),
        birthDate: el.birthDate ? new Date(el.birthDate.getTime() - el.birthDate.getTimezoneOffset() * 60 * 1000).toISOString() : null,
        previousNameDetails: el.previousNameApplicable
          ? {
              title: el.previousTitle,
              firstName: this.titleCasePipe.transform(el.previousFirstName),
              secondName: this.titleCasePipe.transform(el.previousSecondName),
              familyName: this.titleCasePipe.transform(el.previousFamilyName),
            }
          : null,
        expectedRetirementAge: !el.isApplicantRetired ? el.expectedRetirementAge : null,
        hasPermanentRightToResideInTheUK: el.nationality && el.nationality !== 'GB' ? el.hasPermanentRightToResideInTheUK : null,
        secondNationality: el.dualNationalityApplicable ? el.secondNationality : null,
        natureOfVulnerability: el.vulnerableCustomerApplicable ? el.natureOfVulnerability : null,
        details: el.vulnerableCustomerApplicable ? el.details : null,
        gender: 'UNKNOWN',
        isApplicantPermanentResident: true, // TODO remove when field is visible again
      };

      // remove unnecessary properties
      delete mappedFormValues.applicantFullName;
      delete mappedFormValues.previousFamilyName;
      delete mappedFormValues.previousSecondName;
      delete mappedFormValues.previousFirstName;
      delete mappedFormValues.previousTitle;

      return mappedFormValues;
    });

    return {
      versionNumber: this.currentData.versionNumber,
      applicantPersonalDetails,
    };
  }

  populateYearRange() {
    if (this.calendar) {
      this.calendar.populateYearOptions(this.maxYear, this.minYear);
    }
  }

  protected saveOnRedux(item: PersonalDetailsResponse): void {
    this.store.dispatch(loadPersonalDetailsSuccess({ entity: item }));
  }

  private onChanges() {
    this.applicantsFormArray.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
      this.store.dispatch(loadPersonalDetailsSuccess({ entity: this.mapToDTO() }));
    });

    this.applicantsFormArray.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
      this.saveData().subscribe(response => {
        this.store.dispatch(loadPersonalDetailsSuccess({ entity: response }));
        this.currentData.versionNumber = response.versionNumber;
      });
    });
  }

  private setFormData() {
    this.currentData?.applicantPersonalDetails?.forEach((data: ApplicantPersonalDetails) => {
      const personalDetailsForm = this.fb.group({
        applicantId: data.applicantId,
        applicantFullName: `${data.firstName} ${data.familyName}`,
        title: [data.title, Validators.required],
        firstName: [data.firstName, Validators.required],
        secondName: [data.secondName],
        familyName: [data.familyName, Validators.required],
        previousNameApplicable: [data.previousNameApplicable, Validators.required],
        previousTitle: [data.previousNameDetails?.title],
        previousFirstName: [data.previousNameDetails?.firstName],
        previousSecondName: [data.previousNameDetails?.secondName],
        previousFamilyName: [data.previousNameDetails?.familyName],
        birthDate: [new Date(data.birthDate as string), Validators.required],
        maritalStateType: [data.maritalStateType, Validators.required],
        isApplicantRetired: [data.isApplicantRetired, Validators.required],
        expectedRetirementAge: [data.expectedRetirementAge, [Validators.required]],
        nationality: [data.nationality, Validators.required],
        dualNationalityApplicable: [data.dualNationalityApplicable, Validators.required],
        secondNationality: [data.secondNationality, Validators.required],
        // TODO restore required validator when field is displayed again
        // isApplicantPermanentResident: [data.isApplicantPermanentResident, Validators.required],
        isApplicantPermanentResident: [data.isApplicantPermanentResident],
        hasPermanentRightToResideInTheUK: [data.hasPermanentRightToResideInTheUK],
        vulnerableCustomerApplicable: [data.vulnerableCustomerApplicable, Validators.required],
        natureOfVulnerability: [data.natureOfVulnerability, Validators.required],
        details: [data.details],
      });

      const personalDetailsControls = personalDetailsForm.controls;

      personalDetailsControls.previousNameApplicable.valueChanges.subscribe((val: boolean) => {
        if (!val) {
          this.addHasDifferentNameFieldsValidators(personalDetailsControls, []);
        } else {
          this.addHasDifferentNameFieldsValidators(personalDetailsControls, Validators.required);
        }
        this.updateHasDifferentNameFieldValidators(personalDetailsControls);
      });
      personalDetailsControls.previousNameApplicable.reset(data.previousNameApplicable);

      personalDetailsControls.isApplicantRetired.valueChanges.subscribe((val: boolean) => {
        if (val) {
          personalDetailsControls.expectedRetirementAge.setValidators([]);
        } else {
          personalDetailsControls.expectedRetirementAge.setValidators([Validators.required]);
        }
        personalDetailsControls.expectedRetirementAge.updateValueAndValidity();
      });
      personalDetailsControls.isApplicantRetired.reset(data.isApplicantRetired);

      personalDetailsControls.nationality.valueChanges.subscribe((val: string) => {
        if (val === 'GB') {
          personalDetailsControls.hasPermanentRightToResideInTheUK.setValidators([]);
        } else {
          personalDetailsControls.hasPermanentRightToResideInTheUK.setValidators(Validators.required);
        }
        personalDetailsControls.hasPermanentRightToResideInTheUK.updateValueAndValidity();
      });
      personalDetailsControls.nationality.reset(data.nationality);

      personalDetailsControls.dualNationalityApplicable.valueChanges.subscribe((val: boolean) => {
        if (val) {
          personalDetailsControls.secondNationality.setValidators(Validators.required);
        } else {
          personalDetailsControls.secondNationality.setValidators([]);
        }
        personalDetailsControls.secondNationality.updateValueAndValidity();
      });
      personalDetailsControls.dualNationalityApplicable.reset(data.dualNationalityApplicable);

      personalDetailsControls.vulnerableCustomerApplicable.valueChanges.subscribe((val: boolean) => {
        if (val) {
          personalDetailsControls.natureOfVulnerability.setValidators(Validators.required);
        } else {
          personalDetailsControls.natureOfVulnerability.setValidators([]);
        }
        personalDetailsControls.natureOfVulnerability.updateValueAndValidity();
      });
      personalDetailsControls.vulnerableCustomerApplicable.reset(data.vulnerableCustomerApplicable);

      this.applicantsFormArray.push(personalDetailsForm);
    });
  }

  private addHasDifferentNameFieldsValidators(form: { [key: string]: AbstractControl }, validators: ValidatorFn | ValidatorFn[]) {
    form.previousTitle.setValidators(validators);
    form.previousFirstName.setValidators(validators);
    form.previousFamilyName.setValidators(validators);
  }

  private updateHasDifferentNameFieldValidators(form: { [key: string]: AbstractControl }) {
    form.previousTitle.updateValueAndValidity({ emitEvent: false });
    form.previousFirstName.updateValueAndValidity({ emitEvent: false });
    form.previousSecondName.updateValueAndValidity({ emitEvent: false });
    form.previousFamilyName.updateValueAndValidity({ emitEvent: false });
  }
}
