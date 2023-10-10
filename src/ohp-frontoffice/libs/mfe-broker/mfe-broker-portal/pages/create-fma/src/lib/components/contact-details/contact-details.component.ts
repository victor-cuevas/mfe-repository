import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressFeService,
  CodeTablesService,
  DataService,
  FeAddress,
  FmaContactService,
  GenericStepForm,
  PortalValidators,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AddressService,
  AddressSuggestionModel,
  AddressType2,
  AddressTypeEnum,
  Applicant2,
  ApplicantContactDetailsRequest,
  ContactDetailsRequest,
  ContactDetailsResponse,
  FMAService,
  Journey,
  PreferredContactMethod,
  RegisterAddressRequest,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, concatMap, debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { SpinnerService } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'close-front-office-contact-details',
  templateUrl: './contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetailsComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.contactDetails.automationId;
  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;
  MODE: typeof Mode = Mode;
  currentData: ContactDetailsResponse = this.route.snapshot.data.contactDetailsData || {};
  //Dropdown value
  contactMethodOptions = this.codeTablesService.getCodeTable('cdtb-preferredcontactmethod').filter(contactMethod => {
    if (this.currentData.applicants?.length && this.currentData.applicants?.length > 1) {
      return contactMethod.value !== PreferredContactMethod.EMAIL && contactMethod.value !== PreferredContactMethod.POSTAL_MAIL;
    } else {
      return (
        contactMethod.value !== PreferredContactMethod.EMAIL &&
        contactMethod.value !== PreferredContactMethod.POSTAL_MAIL &&
        contactMethod.value !== PreferredContactMethod.NO_CONTACT
      );
    }
  });
  //contactTimeOptions = this.codeTablesService.getCodeTable('cdtb-preferredcontacttime'); //TODO comment because is out of scope for phase 1 April
  printedCorrespondenceFormatOptions = this.codeTablesService.getCodeTable('cdtb-preferredprintformat');
  addressTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-addresstype');
  addressTypeEnum: typeof AddressTypeEnum = AddressTypeEnum;
  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress[] = [];
  hasButtonVisible = true;
  preferredContactMethod: typeof PreferredContactMethod = PreferredContactMethod;

  applicantsFormArray = this.fb.array([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private fmaService: FMAService,
    public dataService: DataService,
    private fmaContactService: FmaContactService,
    private stepSetupService: StepSetupService,
    private cd: ChangeDetectorRef,
    private codeTablesService: CodeTablesService,
    private addressService: AddressService,
    private spinnerService: SpinnerService,
    public addressFeService: AddressFeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setFormData();
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.applicantsFormArray)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
          this.onChanges();
        } else {
          this.hasButtonVisible = false;
          this.applicantsFormArray.markAsPristine();
        }
      });
  }

  getSuggestionListFromAutoComplete(query: { originalEvent: Event; query: string }) {
    this.addressService
      .addressPostSearchAddress({ countryCode: 'GBR', maxSuggestions: 25, keyWords: [query.query] })
      .pipe(debounceTime(3000))
      .subscribe(resp => {
        if (resp && resp.suggestions) this.suggestedAddresses = resp.suggestions;
        this.cd.detectChanges();
      });
  }

  onSelectedAddress(selectedAddress: RegisterAddressRequest, indexApplicant: number) {
    this.spinnerService.setIsLoading(true);
    this.addressService
      .addressPostRegisterAddress(selectedAddress)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(selectedAddress => {
        this.selectedAddress[indexApplicant] = this.addressFeService.mapAddressToFeAddressModel(selectedAddress);
        this.cd.detectChanges();
      });
  }

  getData(): Observable<ContactDetailsResponse> {
    return this.fmaService.fMAGetContactDetails(this.appId);
  }

  hasUnsavedChanges(): boolean {
    return this.applicantsFormArray.dirty && this.applicantsFormArray.status !== 'DISABLED';
  }

  mapToDTO(): ContactDetailsRequest {
    const applicants: ApplicantContactDetailsRequest[] = [];
    const formValues = this.applicantsFormArray.getRawValue() as any[];

    formValues.forEach((app: any, index: number) => {
      const address = app.isCorrespondenceAddressDifferentFromCurrentAddress
        ? this.addressFeService.mapAddressFEtoBFFAddress(app.address, app.addressType)
        : null;
      const applicantData: ApplicantContactDetailsRequest = {
        applicantId: this.currentData.applicants ? (this.currentData?.applicants[index]?.applicantInfo?.applicantId as number) : undefined,
        contactDetails: {
          preferredContactMethod: app?.preferredContactMethod,
          //preferredContactTimeslot: app?.preferredContactTimeslot, //TODO comment because is out of scope for phase 1 April
          mobilePhone: app.mobilePhone?.e164Number,
          workPhone: app.workPhone?.e164Number,
          homePhone: app.homePhone?.e164Number,
          email: app?.email,
          printedCorrespondenceFormat: app?.printedCorrespondenceFormat,
          isCorrespondenceAddressDifferentFromCurrentAddress: app?.isCorrespondenceAddressDifferentFromCurrentAddress,
          address,
        },
      };
      applicants.push(applicantData);
    });

    return {
      versionNumber: this.currentData.versionNumber as number,
      applicants,
    };
  }

  saveData(): Observable<ContactDetailsResponse> {
    return this.fmaService.fMAPutContactDetails(this.appId, this.mapToDTO()).pipe(
      takeUntil(this.onDestroy$),
      concatMap(() => {
        this.applicantsFormArray.markAsPristine();
        return this.dataService.saveProgress(
          Journey.Fma,
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

  private onChanges() {
    this.applicantsFormArray.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
    });

    this.applicantsFormArray.valueChanges.pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$)).subscribe(() => {
      this.saveData().subscribe(response => {
        this.currentData.versionNumber = response.versionNumber;
      });
    });
  }

  private handleError() {
    this.saveData().subscribe(response => {
      this.currentData.versionNumber = response?.versionNumber as number;
    });
  }

  private setFormData() {
    this.currentData?.applicants?.forEach((app: Applicant2, index: number) => {
      const contactDetailsForm = this.updateContactDetailForm(app);
      const formControls = (contactDetailsForm as FormGroup).controls;

      formControls.mobilePhone.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        formControls.mobilePhone.updateValueAndValidity({ emitEvent: false });
        this.cd.detectChanges();
        if (formControls.applicantFullName.value === this.fmaContactService.applicantFullName) {
          this.dataService.setFormStatus('INVALID', this.stepSetupService.valuationDetails.automationId);
        }
      });

      formControls.workPhone.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        formControls.workPhone.updateValueAndValidity({ emitEvent: false });
        this.cd.detectChanges();
        if (formControls.applicantFullName.value === this.fmaContactService.applicantFullName) {
          this.dataService.setFormStatus('INVALID', this.stepSetupService.valuationDetails.automationId);
        }
      });

      formControls.homePhone.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        formControls.homePhone.updateValueAndValidity({ emitEvent: false });
        this.cd.detectChanges();
        if (formControls.applicantFullName.value === this.fmaContactService.applicantFullName) {
          this.dataService.setFormStatus('INVALID', this.stepSetupService.valuationDetails.automationId);
        }
      });

      formControls.email.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        if (formControls.applicantFullName.value === this.fmaContactService.applicantFullName) {
          this.dataService.setFormStatus('INVALID', this.stepSetupService.valuationDetails.automationId);
        }
      });

      formControls.preferredContactMethod.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((value: string) => {
        if (formControls.applicantFullName.value === this.fmaContactService.applicantFullName) {
          this.dataService.setFormStatus('INVALID', this.stepSetupService.valuationDetails.automationId);
        }
        this.applicantsFormArray.controls.forEach((group, nestedIndex) => {
          if (nestedIndex !== index) {
            group.get('preferredContactMethod')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
          }
        });

        if (value === this.preferredContactMethod.MOBILE_PHONE) {
          formControls.mobilePhone.setValidators(Validators.required);
          formControls.workPhone.setValidators(null);
          formControls.homePhone.setValidators(null);
        }

        if (value === this.preferredContactMethod.WORK_PHONE) {
          formControls.mobilePhone.setValidators(null);
          formControls.workPhone.setValidators(Validators.required);
          formControls.homePhone.setValidators(null);
        }

        if (value === this.preferredContactMethod.HOME_PHONE) {
          formControls.mobilePhone.setValidators(null);
          formControls.workPhone.setValidators(null);
          formControls.homePhone.setValidators(Validators.required);
        }

        if (value === this.preferredContactMethod.NO_CONTACT) {
          formControls.mobilePhone.setValidators(null);
          formControls.workPhone.setValidators(null);
          formControls.homePhone.setValidators(null);
        }

        //TODO comment because is out of scope for phase 1 April
        /*        if (preferredContactMethod === this.preferredContactMethod.NO_CONTACT) {
          formControls.preferredContactTimeslot.setValue(null);
        }*/

        formControls.mobilePhone.updateValueAndValidity();
        formControls.workPhone.updateValueAndValidity();
        formControls.homePhone.updateValueAndValidity();
      });

      formControls.isCorrespondenceAddressDifferentFromCurrentAddress.valueChanges.subscribe(value => {
        if (!value) {
          setTimeout(() => {
            this.applicantsFormArray.at(index).get('address')?.get('selectedAddressControl')?.setValidators(null);
            this.applicantsFormArray.updateValueAndValidity({ emitEvent: false });
            this.cd.detectChanges();
          }, 0);
        } else {
          setTimeout(() => {
            this.hasButtonVisible = true;
            this.applicantsFormArray.at(index).get('address')?.get('selectedAddressControl')?.reset();
            this.applicantsFormArray.at(index).get('address')?.get('selectedAddressControl')?.setValidators(Validators.required);
            this.applicantsFormArray.at(index).get('address')?.get('selectedAddressControl')?.updateValueAndValidity({ emitEvent: false });
            this.applicantsFormArray.updateValueAndValidity({ emitEvent: false });
            this.cd.detectChanges();
          }, 0);
        }
      });

      this.applicantsFormArray.push(contactDetailsForm as FormGroup);
      this.cd.detectChanges();
      setTimeout(() => {
        if (app.contactDetails?.address?.addressType === AddressType2.Uk) this.hasButtonVisible = true;
        const address = app.contactDetails?.address ? this.addressFeService.mapAddressBFFToAddressFE(app.contactDetails?.address) : null;
        contactDetailsForm.get('address')?.get('selectedAddressControl')?.patchValue(address);
        this.applicantsFormArray.updateValueAndValidity({ emitEvent: false });
        this.cd.detectChanges();
      }, 0);
    });
  }

  private updateContactDetailForm(applicant: Applicant2): FormGroup {
    const { contactDetails, applicantInfo } = applicant;
    return this.fb.group({
      applicantId: applicantInfo?.applicantId,
      applicantFullName: `${applicantInfo?.firstName?.trim()} ${
        applicantInfo?.familyNamePrefix ? applicantInfo?.familyNamePrefix + ' ' + applicantInfo?.familyName : applicantInfo?.familyName
      }`,
      preferredContactMethod: [
        contactDetails?.preferredContactMethod,
        Validators.compose([Validators.required, PortalValidators.atLeastOneContact(this.applicantsFormArray)]),
      ],
      //preferredContactTimeslot: contactDetails?.preferredContactTimeslot, //TODO comment because is out of scope for phase 1 April
      mobilePhone: [
        contactDetails?.mobilePhone,
        contactDetails?.preferredContactMethod === this.preferredContactMethod.MOBILE_PHONE ? Validators.required : null,
      ],
      workPhone: [
        contactDetails?.workPhone,
        contactDetails?.preferredContactMethod === this.preferredContactMethod.WORK_PHONE ? Validators.required : null,
      ],
      homePhone: [
        contactDetails?.homePhone,
        contactDetails?.preferredContactMethod === this.preferredContactMethod.HOME_PHONE ? Validators.required : null,
      ],
      email: [contactDetails?.email, Validators.compose([Validators.email, Validators.required])],
      printedCorrespondenceFormat: contactDetails?.printedCorrespondenceFormat,
      isCorrespondenceAddressDifferentFromCurrentAddress: contactDetails?.isCorrespondenceAddressDifferentFromCurrentAddress,
      addressType: contactDetails?.address?.addressType || AddressType2.Uk,
    });
  }
}
