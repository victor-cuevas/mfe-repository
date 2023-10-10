import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CodeTablesService,
  DataService,
  FeFmaContact,
  FmaContactService,
  GenericStepForm,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  BrokerCodeTableOption,
  FMAService,
  Journey,
  PreferredContactMethod,
  ValuationContact,
  ValuationDetailsRequest,
  ValuationDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, concatMap, debounceTime, takeUntil } from 'rxjs/operators';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { TitleCasePipe } from '@angular/common';
import { userTitleOptions } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { GroupValidators } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'close-front-office-fma-valuation-details',
  templateUrl: './fma-valuation-details.component.html',
  providers: [TitleCasePipe],
})
export class FmaValuationDetailsComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.valuationDetails.automationId;

  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;
  titles = userTitleOptions;
  PREFERRED_CONTACT_METHOD = PreferredContactMethod;
  VALUATION_CONTACT = ValuationContact;
  MODE: typeof Mode = Mode;
  contactIsApplicant = false;
  routePaths: typeof RoutePaths = RoutePaths;
  initialData: ValuationDetailsResponse = this.route.snapshot.data?.valuationDetailsData?.valuationDetails || {};
  @Input() applicants: FeFmaContact[] = this.route.snapshot.data?.valuationDetailsData?.applicantDetails;
  valuationDetailsForm: FormGroup = this.fb.group(
    {
      valuationType: [
        {
          value: this.titleCasePipe.transform(this.initialData.valuationType)?.replace('_', ' '),
          disabled: true,
        },
      ],
      valuationContact: [this.initialData.valuationContact, Validators.required],
      title: [this.initialData.contactInformation?.title],
      firstName: [this.initialData.contactInformation?.firstName],
      lastName: [this.initialData.contactInformation?.lastName],
      preferredContactMethod: [this.initialData.contactInformation?.preferredContactMethod, Validators.required],
      mobilePhone: [this.initialData.contactInformation?.mobilePhone],
      workPhone: [this.initialData.contactInformation?.workPhone],
      homePhone: [this.initialData.contactInformation?.homePhone],
      companyName: [this.initialData.companyName],
      additionalInformationForValuer: [this.initialData.additionalInformationForValuer],
    },
    { validators: [GroupValidators.atLeastOneField(['mobilePhone', 'workPhone', 'homePhone'])] },
  );

  valuationContactOptions = this.codeTablesService
    .getCodeTable('cdtb-valuationcontact')
    .reduce((arr: BrokerCodeTableOption[], el: BrokerCodeTableOption) => {
      if (el.value === ValuationContact.APPLICANT_1 && this.applicants[0]?.applicantName) {
        return [...arr, { ...el, label: this.applicants[0].applicantName }] as BrokerCodeTableOption[];
      }
      if (el.value === ValuationContact.APPLICANT_2 && this.applicants[0]?.applicantName) {
        return this.applicants.length === 1
          ? arr
          : ([...arr, { ...el, label: this.applicants[1].applicantName }] as BrokerCodeTableOption[]);
      }
      return [...arr, el] as BrokerCodeTableOption[];
    }, []);

  contactMethodOptions = this.codeTablesService
    .getCodeTable('cdtb-broker-contactmethods')
    ?.filter(
      contactMethod =>
        contactMethod.value !== PreferredContactMethod.NO_CONTACT &&
        contactMethod.value !== PreferredContactMethod.EMAIL &&
        contactMethod.value !== PreferredContactMethod.POSTAL_MAIL,
    );

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private fmaService: FMAService,
    private fmaContactService: FmaContactService,
    private stepSetupService: StepSetupService,
    private dataService: DataService,
    private cd: ChangeDetectorRef,
    private codeTablesService: CodeTablesService,
    private titleCasePipe: TitleCasePipe,
  ) {
    super();
  }

  ngOnInit(): void {
    this.disableContactOptions();
    this.updateContactMethodValues();
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    super.checkSubscription();
    super.onDestroy();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.valuationDetailsForm)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setFormStatus(this.valuationDetailsForm.status, this.STEP_NAME);
          this.onChanges();
        }
      });
  }

  private valuationContactIsApplicant(): FeFmaContact | undefined {
    const valuationContact = this.valuationDetailsForm.get('valuationContact')?.value;

    if (valuationContact === ValuationContact.APPLICANT_1) return this.applicants[0];

    if (valuationContact === ValuationContact.APPLICANT_2) return this.applicants[1];

    return undefined;
  }

  private updateContactMethodValues(): void {
    const applicant = this.valuationContactIsApplicant();

    if (applicant) {
      this.contactIsApplicant = true;
      this.setApplicantValues(applicant);
    } else {
      this.contactIsApplicant = false;
      this.valuationDetailsForm.get('mobilePhone')?.reset({
        value: this.initialData.contactInformation?.mobilePhone,
        disabled: false,
      });
      this.valuationDetailsForm.get('workPhone')?.reset({
        value: this.initialData.contactInformation?.workPhone,
        disabled: false,
      });
      this.valuationDetailsForm.get('homePhone')?.reset({
        value: this.initialData.contactInformation?.homePhone,
        disabled: false,
      });
      this.valuationDetailsForm
        .get('preferredContactMethod')
        ?.reset({ value: this.initialData.contactInformation?.preferredContactMethod, disabled: false });
    }
  }

  private disableContactOptions() {
    this.applicants?.forEach(applicant => {
      if (this.initialData.valuationContact === applicant.applicantName) {
        this.valuationDetailsForm.get('preferredContactMethod')?.disable();
      }
    });
  }

  private setApplicantValues(applicant: FeFmaContact) {
    this.valuationDetailsForm.get('contactName')?.reset('');
    this.valuationDetailsForm.get('companyName')?.reset('');
    this.valuationDetailsForm.get('title')?.reset('');
    this.valuationDetailsForm.get('firstName')?.reset('');
    this.valuationDetailsForm.get('lastName')?.reset('');
    this.valuationDetailsForm.get('mobilePhone')?.reset({ value: applicant.mobilePhone, disabled: true });
    this.valuationDetailsForm.get('workPhone')?.reset({ value: applicant.workPhone, disabled: true });
    this.valuationDetailsForm.get('homePhone')?.reset({ value: applicant.homePhone, disabled: true });
    this.valuationDetailsForm.get('preferredContactMethod')?.setValue(applicant.preferredContactMethod);

    this.valuationDetailsForm.get('preferredContactMethod')?.disable();
  }

  private clearApplicantValues() {
    this.valuationDetailsForm.get('mobilePhone')?.reset({ value: '', disabled: false });
    this.valuationDetailsForm.get('workPhone')?.reset({ value: '', disabled: false });
    this.valuationDetailsForm.get('homePhone')?.reset({ value: '', disabled: false });
    this.valuationDetailsForm.get('preferredContactMethod')?.reset({ value: '', disabled: false });

    this.valuationDetailsForm.get('mobilePhone')?.updateValueAndValidity({ emitEvent: false });
    this.valuationDetailsForm.get('workPhone')?.updateValueAndValidity({ emitEvent: false });
    this.valuationDetailsForm.get('homePhone')?.updateValueAndValidity({ emitEvent: false });
    this.valuationDetailsForm.get('preferredContactMethod')?.updateValueAndValidity({ emitEvent: false });
    this.cd.detectChanges();
  }

  setContactValidator(preferredMethod: string) {
    const controlNamesArray = ['mobilePhone', 'workPhone', 'homePhone'];

    controlNamesArray.forEach(controlName => this.valuationDetailsForm.get(controlName)?.removeValidators(Validators.required));

    this.valuationDetailsForm.get(preferredMethod)?.addValidators([Validators.required]);

    controlNamesArray.forEach(controlName => this.valuationDetailsForm.get(controlName)?.updateValueAndValidity({ emitEvent: false }));
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    return this.valuationDetailsForm.dirty && this.valuationDetailsForm.status !== 'DISABLED';
  }

  saveData(): Observable<ValuationDetailsResponse> {
    return this.fmaService.fMAPutValuationDetails(this.appId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      concatMap(() => {
        this.valuationDetailsForm?.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Fma,
          this.appId,
          this.loanId,
          { [this.STEP_NAME]: this.valuationDetailsForm.status },
          this.getData(),
        );
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getData(): Observable<ValuationDetailsResponse> {
    return this.fmaService.fMAGetValuationDetails(this.appId);
  }

  handleValuationIsNotApplicant(valuationContact: ValuationContact) {
    this.valuationDetailsForm.get('companyName')?.reset('');
    this.valuationDetailsForm.get('title')?.reset('');
    this.valuationDetailsForm.get('firstName')?.reset('');
    this.valuationDetailsForm.get('lastName')?.reset('');

    if (valuationContact === ValuationContact.SELLER || valuationContact === ValuationContact.ESTATE_AGENT) {
      if (valuationContact === ValuationContact.ESTATE_AGENT) {
        this.valuationDetailsForm.get('companyName')?.addValidators(Validators.required);
      } else {
        this.valuationDetailsForm.get('companyName')?.removeValidators(Validators.required);
      }

      this.valuationDetailsForm.get('companyName')?.updateValueAndValidity({ emitEvent: false });

      this.valuationDetailsForm.get('title')?.addValidators(Validators.required);
      this.valuationDetailsForm.get('firstName')?.addValidators(Validators.required);
      this.valuationDetailsForm.get('lastName')?.addValidators(Validators.required);
    } else {
      this.valuationDetailsForm.get('title')?.removeValidators(Validators.required);
      this.valuationDetailsForm.get('firstName')?.removeValidators(Validators.required);
      this.valuationDetailsForm.get('lastName')?.removeValidators(Validators.required);
    }

    this.valuationDetailsForm.get('title')?.updateValueAndValidity({ emitEvent: false });
    this.valuationDetailsForm.get('firstName')?.updateValueAndValidity({ emitEvent: false });
    this.valuationDetailsForm.get('lastName')?.updateValueAndValidity({ emitEvent: false });
  }

  mapToDTO(): ValuationDetailsRequest {
    const formValues = this.valuationDetailsForm.getRawValue();
    return {
      additionalInformationForValuer: formValues.additionalInformationForValuer,
      ...((formValues.valuationContact === ValuationContact.SELLER || formValues.valuationContact === ValuationContact.ESTATE_AGENT) && {
        companyName: formValues.companyName,
      }),
      valuationContact: formValues.valuationContact,
      contactInformation: {
        preferredContactMethod: formValues.preferredContactMethod,
        mobilePhone: formValues.mobilePhone?.e164Number,
        workPhone: formValues.workPhone?.e164Number,
        homePhone: formValues.homePhone?.e164Number,
        ...((formValues.valuationContact === ValuationContact.SELLER || formValues.valuationContact === ValuationContact.ESTATE_AGENT) && {
          firstName: formValues.firstName,
        }),
        ...((formValues.valuationContact === ValuationContact.SELLER || formValues.valuationContact === ValuationContact.ESTATE_AGENT) && {
          lastName: formValues.lastName,
        }),
        ...((formValues.valuationContact === ValuationContact.SELLER || formValues.valuationContact === ValuationContact.ESTATE_AGENT) && {
          title: formValues.title,
        }),
      },
      versionNumber: this.initialData.versionNumber as number,
    };
  }

  private onChanges() {
    // set form status on form input change
    this.valuationDetailsForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.dataService.setFormStatus(this.valuationDetailsForm.status, this.STEP_NAME);
    });

    this.valuationDetailsForm
      .get('preferredContactMethod')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        let mappedValue = '';

        if (value === PreferredContactMethod.HOME_PHONE) mappedValue = 'homePhone';
        if (value === PreferredContactMethod.WORK_PHONE) mappedValue = 'workPhone';
        if (value === PreferredContactMethod.MOBILE_PHONE) mappedValue = 'mobilePhone';
        this.setContactValidator(mappedValue);
      });

    // update preferredContactMethod, company info, contact info and validators
    // if valuationContact is updated
    this.valuationDetailsForm
      .get('valuationContact')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.handleValuationIsNotApplicant(value);
        if (value && value !== ValuationContact.SELLER && value !== ValuationContact.ESTATE_AGENT) {
          this.fmaContactService.applicantFullName = value;
        }
        this.updateContactMethodValues();
        if (value === ValuationContact.SELLER || value === ValuationContact.ESTATE_AGENT) {
          this.clearApplicantValues();
        }
      });

    // handle autosave on change
    this.valuationDetailsForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe(response => {
          this.initialData.versionNumber = response.versionNumber;
        });
      });
  }

  private handleError() {
    this.saveData().subscribe(response => {
      this.initialData.versionNumber = response?.versionNumber as number;
    });
  }
}
