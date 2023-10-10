import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CodeTablesService, DataService, FeApplicant, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { ApplicantsType, CasePurposeType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CustomValidators } from '@close-front-office/mfe-broker/core';
import { Calendar } from 'primeng/calendar';
import { AddApplicantsData } from '../../models/addApplicantsData';

@Component({
  selector: 'mbp-applicants-step',
  templateUrl: './applicants-step.component.html',
})
export class ApplicantsStepComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar', { static: false }) private calendar: Calendar | undefined;

  routePaths: typeof RoutePaths = RoutePaths;
  applicantsType: typeof ApplicantsType = ApplicantsType;
  applicantTypesOptions = this.codeTablesService.getCodeTable('cdtb-broker-applicanttypes');

  subscription: Subscription;
  allFormsValid = false;

  maxYear = new Date().getFullYear() - 80;
  minYear = new Date().getFullYear() - 18;

  maxDate = new Date(this.minYear, 11, 31);
  minDate = new Date(this.maxYear, 0, 1);

  defaultDate = new Date(this.minYear, new Date().getMonth());

  // form initial values
  initialData: AddApplicantsData = this.dataService.getFormData('step2') || {
    applicants: [
      {
        firstName: '',
        familyName: '',
        dateOfBirth: undefined,
        applicantType: '',
        mortgageAccountNumber: null,
      },
    ],
  };

  applicantForm: FormGroup = this.fb.group({
    applicants: this.fb.array([]),
  });

  @HostListener('document:wheel', ['$event.target']) onScroll() {
    const datePicker = document.querySelector('body > div.p-datepicker');
    if (datePicker) {
      this.calendar?.toggle();
    }
  }

  constructor(private fb: FormBuilder, private dataService: DataService, private codeTablesService: CodeTablesService) {
    this.subscription = this.dataService.formStatus$.subscribe(status => {
      this.allFormsValid = status.step1 === 'VALID' && status.step2 === 'VALID';
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialData.applicants.forEach((element: any) => {
        this.addApplicant(element);
      });
    }, 0);
  }

  get applicants(): FormArray {
    return this.applicantForm.controls['applicants'] as FormArray;
  }

  ngOnInit(): void {
    this.onChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChanges(): void {
    this.applicantForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(val, this.applicantForm.status, 'step2');
    });
  }

  checkValidator(control: AbstractControl, val: any) {
    if (val === ApplicantsType.EXISTING_CUSTOMER) {
      control.setValidators(Validators.required);
    } else {
      control.setValidators([]);
    }
    control.reset();
  }

  addApplicant(
    element: FeApplicant = {
      firstName: '',
      familyName: '',
      dateOfBirth: undefined,
      applicantType: '',
      mortgageAccountNumber: null,
    },
  ) {
    const applicant: FormGroup = this.fb.group({
      firstName: [element.firstName, Validators.required],
      familyName: [element.familyName, Validators.required],
      dateOfBirth: [element.dateOfBirth, Validators.compose([Validators.required, CustomValidators.checkAge(18, 80)])],
      applicantType: [element.applicantType, Validators.required],
      mortgageAccountNumber: [element.mortgageAccountNumber],
    });

    const applicationType = this.dataService.getFormData('step1')?.casePurposeType;

    applicant.controls.applicantType.valueChanges.subscribe(val => {
      this.checkValidator(applicant.controls.mortgageAccountNumber, val);
    });

    if (applicationType === CasePurposeType.Remortgage) {
      applicant.controls.applicantType.setValidators(
        Validators.compose([Validators.required, CustomValidators.valueIsNot(ApplicantsType.FIRST_TIME_BUYER)]),
      );
    } else {
      applicant.controls.applicantType.setValidators(Validators.required);
    }
    applicant.controls.applicantType.updateValueAndValidity();

    this.applicants.push(applicant);
  }

  deleteApplicant(i: number) {
    this.applicants.removeAt(i);
  }

  populateYearRange() {
    if (this.calendar) {
      this.calendar.populateYearOptions(this.maxYear, this.minYear);
    }
  }
}
