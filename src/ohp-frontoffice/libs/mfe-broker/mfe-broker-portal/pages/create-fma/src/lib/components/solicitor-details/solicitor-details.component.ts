import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AddressFeService,
  DataService,
  FeAddress,
  GenericStepForm,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  Address,
  AddressService,
  AddressSuggestionModel,
  AddressType2,
  Conveyancer,
  FMAService,
  Journey,
  RegisterAddressRequest,
  Solicitor,
  SolicitorDetailsRequest,
  SolicitorDetailsResponse,
  StepStatusEnum,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, finalize, take, takeUntil } from 'rxjs/operators';
import { AddressSearchComponent } from '@close-front-office/mfe-broker/shared-ui';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SolicitorDetailsTableComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { SpinnerService } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'close-front-office-solicitor-details',
  templateUrl: './solicitor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitorDetailsComponent extends GenericStepForm implements OnInit, AfterViewInit, OnDestroy {
  readonly STEP_NAME = this.stepSetupService.solicitorDetails.automationId;

  private appId = this.route.snapshot.data?.fmaJourney?.fmaData?.applicationDraftId;
  private loanId = this.route.snapshot.data?.fmaJourney?.fmaData?.loanId;

  @ViewChild(AddressSearchComponent) addressSearchComponent!: AddressSearchComponent;

  currentData: SolicitorDetailsResponse = this.route.snapshot.data.solicitorDetailsData || {};
  hasConveyancerDetails = false;
  conveyancerDetails: Solicitor | undefined;
  solicitorsTableRef?: DynamicDialogRef;
  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress | null = null;
  hasButtonVisible = true;

  solicitorDetailsForm: FormGroup = this.fb.group({
    validValues: [null],
    hasConveyanceSelected: [false],
    applicantsConsentForSolicitorAssignment: this.currentData.applicantsConsentForSolicitorAssignment,
    conveyancerName: this.currentData.conveyancer?.name,
    conveyancerFirmName: null,
    conveyancerTown: null,
    conveyancerPostcode: null,
    isSeparateRepresentationSelected: [this.currentData.isSeparateRepresentationSelected, Validators.required],
    separateRepresentationName: this.currentData.solicitor?.conveyancerName,
    separateRepresentationFirm: this.currentData.solicitor?.conveyancerFirmName,
    separateRepresentationEmail: this.currentData.solicitor?.email,
    separateRepresentationNumberWork: this.currentData.solicitor?.telephone,
    addressType: AddressType2.Uk,
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private stepSetupService: StepSetupService,
    private fmaService: FMAService,
    public dataService: DataService,
    private cd: ChangeDetectorRef,
    public dialogService: DialogService,
    private addressService: AddressService,
    private spinnerService: SpinnerService,
    private addressFeService: AddressFeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleValidations();
  }

  ngAfterViewInit(): void {
    this.setAddressForm();
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    super.checkSubscription();
    super.onDestroy();
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

  onSelectedAddress(selectedAddress: RegisterAddressRequest) {
    this.spinnerService.setIsLoading(true);
    this.addressService
      .addressPostRegisterAddress(selectedAddress)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(selectedAddress => {
        this.selectedAddress = this.addressFeService.mapAddressToFeAddressModel(selectedAddress);
        this.cd.detectChanges();
      });
  }

  handleValidations() {
    if (this.solicitorDetailsForm.controls.isSeparateRepresentationSelected.value) {
      this.solicitorDetailsForm.controls.separateRepresentationFirm.setValidators(Validators.required);
      this.solicitorDetailsForm.controls.separateRepresentationEmail.setValidators([Validators.required, Validators.email]);
      this.solicitorDetailsForm.controls.separateRepresentationNumberWork.setValidators([Validators.required]);
    } else {
      this.solicitorDetailsForm.controls.separateRepresentationFirm.setValidators(null);
      this.solicitorDetailsForm.controls.separateRepresentationEmail.setValidators(null);
      this.solicitorDetailsForm.controls.separateRepresentationNumberWork.setValidators(null);
    }
    this.solicitorDetailsForm.controls.separateRepresentationFirm.updateValueAndValidity({ emitEvent: false });
    this.solicitorDetailsForm.controls.separateRepresentationEmail.updateValueAndValidity({ emitEvent: false });
    this.solicitorDetailsForm.controls.separateRepresentationNumberWork.updateValueAndValidity({ emitEvent: false });
    if (this.solicitorDetailsForm.controls.separateRepresentationNumberWork.value) {
      this.solicitorDetailsForm.controls.separateRepresentationNumberWork.markAsUntouched();
    }

    if (this.currentData?.hasFreeLegalSolicitor) {
      this.solicitorDetailsForm.get('applicantsConsentForSolicitorAssignment')?.setValidators(Validators.requiredTrue);
    } else {
      this.solicitorDetailsForm.get('applicantsConsentForSolicitorAssignment')?.setValidators(null);
    }
    this.solicitorDetailsForm.get('applicantsConsentForSolicitorAssignment')?.updateValueAndValidity({ emitEvent: false });

    if (this.currentData?.conveyancer && !this.isNullish()) {
      this.hasConveyancerDetails = true;
      this.conveyancerDetails = this.mapConveyancerToSolicitor(this.currentData.conveyancer as Conveyancer);
      this.solicitorDetailsForm.get('validValues')?.setValue(true, { emitEvent: false });
      this.solicitorDetailsForm.get('hasConveyanceSelected')?.setValue(true, { emitEvent: false });
    } else {
      this.solicitorDetailsForm.get('hasConveyanceSelected')?.setValue(false);
    }
    this.solicitorDetailsForm.get('validValues')?.setValidators(Validators.requiredTrue);
    this.solicitorDetailsForm.get('validValues')?.updateValueAndValidity({ emitEvent: false });
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.solicitorDetailsForm)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        } else {
          this.hasButtonVisible = false;
        }
      });
  }

  hasUnsavedChanges(): boolean {
    return this.solicitorDetailsForm.dirty;
  }

  mapToDTO(): SolicitorDetailsRequest {
    const data = this.solicitorDetailsForm.getRawValue();
    const address = data.isSeparateRepresentationSelected
      ? this.addressFeService.mapAddressFEtoBFFAddress(data.address, data.addressType)
      : null;
    return {
      conveyancer: {
        externalReference: this.conveyancerDetails?.externalReference,
      },
      isSeparateRepresentationSelected: data.isSeparateRepresentationSelected,
      solicitor: {
        conveyancerName: data.isSeparateRepresentationSelected ? data.separateRepresentationName : null,
        conveyancerFirmName: data.isSeparateRepresentationSelected ? data.separateRepresentationFirm : null,
        email: data.isSeparateRepresentationSelected ? data.separateRepresentationEmail : null,
        telephone:
          data.isSeparateRepresentationSelected && this.solicitorDetailsForm.controls.separateRepresentationNumberWork.valid
            ? data.separateRepresentationNumberWork?.e164Number
            : null,
        address,
      },
      applicantsConsentForSolicitorAssignment: this.currentData.hasFreeLegalSolicitor ? data.applicantsConsentForSolicitorAssignment : null,
      versionNumber: this.currentData.versionNumber as number,
    };
  }

  getStepStatus(): StepStatusEnum {
    return this.solicitorDetailsForm.status === 'VALID' ? StepStatusEnum.VALID : StepStatusEnum.INVALID;
  }

  saveProgress(): void {
    this.dataService
      .saveProgress(Journey.Fma, this.appId, this.loanId, {
        ...this.stepSetupService.validateFmaChecks(true),
        [this.STEP_NAME]: this.getStepStatus(),
      })
      .subscribe();
  }

  saveData(): Observable<SolicitorDetailsResponse> {
    if (this.isSaving) {
      this.solicitorDetailsForm.markAsDirty();
      return of();
    }
    this.isSaving = true;
    this.solicitorDetailsForm.markAsPristine();
    return this.fmaService.fMAPutSolicitorDetails(this.appId, this.mapToDTO()).pipe(
      map((res: SolicitorDetailsResponse) => {
        this.currentData.versionNumber = res.versionNumber;
        this.isSaving = false;
        this.saveProgress();
        return res;
      }),
    );
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  findConveyancer() {
    this.solicitorsTableRef = this.dialogService.open(SolicitorDetailsTableComponent, {
      data: {
        postcode: this.solicitorDetailsForm.controls.conveyancerPostcode.value,
        firmName: this.solicitorDetailsForm.controls.conveyancerFirmName.value,
        town: this.solicitorDetailsForm.controls.conveyancerTown.value,
      },
      header: 'List of solicitors',
      width: '80%',
    });

    this.solicitorsTableRef.onClose.subscribe((solicitor: Solicitor) => {
      if (solicitor) {
        this.hasConveyancerDetails = true;
        this.conveyancerDetails = solicitor;
        this.solicitorDetailsForm.get('validValues')?.setValue(true);
        this.solicitorDetailsForm.get('hasConveyanceSelected')?.setValue(true);
        this.cd.detectChanges();
        this.saveData().subscribe();
      }
    });
  }

  changeConveyancer() {
    this.solicitorDetailsForm.controls.conveyancerPostcode.setValue(null);
    this.solicitorDetailsForm.controls.conveyancerFirmName.setValue(null);
    this.solicitorDetailsForm.controls.conveyancerTown.setValue(null);
    this.solicitorDetailsForm.get('validValues')?.setValue(false, { emitEvent: false });
    this.conveyancerDetails = {};
    this.hasConveyancerDetails = false;
    this.solicitorDetailsForm.get('hasConveyanceSelected')?.setValue(false);
    this.saveData().subscribe();
    this.cd.detectChanges();
  }

  private onChanges() {
    this.solicitorDetailsForm.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      this.dataService.setFormStatus(this.solicitorDetailsForm.status, this.STEP_NAME);
      if (this.stepSetupService.stepIsValid(this.stepSetupService.lenderPolicyCheck) && this.solicitorDetailsForm.dirty) {
        this.stepSetupService.invalidateStep(this.stepSetupService.lenderPolicyCheck.automationId);
        this.fmaService.fMARegressLoanStage(this.appId, this.loanId).pipe(take(1)).subscribe();
      }
    });

    this.solicitorDetailsForm.controls.isSeparateRepresentationSelected.valueChanges.subscribe(value => {
      if (value) {
        this.solicitorDetailsForm.controls.separateRepresentationFirm.setValidators(Validators.required);
        this.solicitorDetailsForm.controls.separateRepresentationEmail.setValidators([Validators.required, Validators.email]);
        this.solicitorDetailsForm.controls.separateRepresentationNumberWork.setValidators(Validators.required);
      } else {
        this.solicitorDetailsForm.controls.separateRepresentationFirm.setValidators(null);
        this.solicitorDetailsForm.controls.separateRepresentationEmail.setValidators(null);
        this.solicitorDetailsForm.controls.separateRepresentationNumberWork.setValidators(null);
        this.solicitorDetailsForm.get('hasConveyanceSelected')?.setValue(false);
        setTimeout(() => {
          this.solicitorDetailsForm.get('address')?.get('selectedAddressControl')?.setValidators(null);
        });
      }
      this.solicitorDetailsForm.controls.separateRepresentationFirm.updateValueAndValidity({ emitEvent: false });
      this.solicitorDetailsForm.controls.separateRepresentationEmail.updateValueAndValidity({ emitEvent: false });
      this.solicitorDetailsForm.controls.separateRepresentationNumberWork.updateValueAndValidity({ emitEvent: false });
    });

    this.solicitorDetailsForm.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$))
      .subscribe(() => {
        this.saveData().subscribe();
      });
  }

  private mapConveyancerToSolicitor(data: Conveyancer): Solicitor {
    return {
      solicitorName: data.firmName,
      address: data.address,
      externalReference: data.externalReference?.toString(),
    };
  }

  private setAddressForm() {
    const address = this.currentData.solicitor?.address
      ? this.addressFeService.mapAddressBFFToAddressFE(this.currentData.solicitor.address)
      : null;
    this.solicitorDetailsForm.get('address')?.get('selectedAddressControl')?.patchValue(address);
    this.cd.detectChanges();
  }

  private isNullish() {
    return (
      this.currentData?.conveyancer?.address &&
      Object.values(this.currentData?.conveyancer?.address as Address).every(value => {
        return value === null;
      })
    );
  }
}
