import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, concatMap, debounceTime, finalize, pairwise, skip, startWith, take, takeUntil } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import {
  AddressFeService,
  AddressSearchForm,
  CodeTablesService,
  DataService,
  FeAddress,
  GenericStepForm,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  Address,
  AddressHistoryItem,
  AddressHistoryRequest,
  AddressHistoryResponse,
  AddressService,
  AddressSuggestionModel,
  AddressType2,
  AddressTypeEnum,
  ApplicantAddressHistoryRequest,
  ApplicantAddressHistoryResponse,
  DIPService,
  Journey,
  RegisterAddressRequest,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { GroupValidators, SpinnerService } from '@close-front-office/mfe-broker/core';
import { Calendar } from 'primeng/calendar';

interface AddressHistoryFormData {
  addressHistoryItemId?: number | null;
  addressType?: AddressType2 | null;
  address?: Address | null;
  moveInDate?: Date | null;
  occupancyType?: string | null;
}

interface ApplicantsFormArrayData {
  applicantId?: number;
  addressesHistory?: AddressHistoryFormData[];
}

@Component({
  selector: 'dip-address-history',
  templateUrl: './address-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressHistoryComponent extends GenericStepForm implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: false }) private calendar: Calendar | undefined;

  readonly STEP_NAME = this.stepSetupService.addressHistory.automationId;
  applicantsFormArray = this.fb.array([]);
  currentData: AddressHistoryResponse = this.route.snapshot.data.addressHistoryData || {};
  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  //Dropdown options
  addressTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-addresstype');
  occupancyOptions = this.codeTablesService.getCodeTable('cdtb-residencesituationtype');
  addressTypeEnum: typeof AddressTypeEnum = AddressTypeEnum;

  //calendar data
  maxDateValue = new Date();
  minYear = new Date().getFullYear();
  maxYear = new Date(1900, 0, 1).getFullYear();

  maxDate = new Date(this.minYear, new Date().getMonth(), new Date().getDate());
  minDate = new Date(this.maxYear, 0, 1);

  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress[][] = [[], []];
  hasButtonVisible = true;
  isCaseRemortgage = this.stepSetupService.isRemortgage;

  addressHistoryFormArray(index: number) {
    return this.applicantsFormArray.at(index).get('addressesHistory') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    public dataService: DataService,
    private dipService: DIPService,
    private stepSetupService: StepSetupService,
    private codeTablesService: CodeTablesService,
    private cd: ChangeDetectorRef,
    private addressService: AddressService,
    private spinnerService: SpinnerService,
    public addressFeService: AddressFeService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.applicantsFormArray.length) this.selectedAddress = new Array(this.applicantsFormArray.length).fill([]);
  }

  ngAfterViewInit(): void {
    this.setFormData(this.currentData.applicantAddressHistories);
    this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
    this.checkActiveJourney();
    this.cd.detectChanges();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME, this.applicantsFormArray)
      .pipe(take(1))
      .subscribe(isActive => {
        if (isActive) {
          this.onChanges();
        } else {
          setTimeout(() => {
            this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
            this.applicantsFormArray.disable({ emitEvent: false });
            this.hasButtonVisible = false;
          });
        }
      });
    this.cd.detectChanges();
  }

  hasUnsavedChanges(): boolean {
    return this.applicantsFormArray.dirty;
  }

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
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

  onSelectedAddress(selectedAddress: RegisterAddressRequest, indexApplicant: number, indexAddressHistory: number) {
    this.spinnerService.setIsLoading(true);
    this.addressService
      .addressPostRegisterAddress(selectedAddress)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(selectedAddress => {
        this.selectedAddress[indexApplicant][indexAddressHistory] = this.addressFeService.mapAddressToFeAddressModel(selectedAddress);
        this.cd.detectChanges();
      });
  }

  saveData(): Observable<AddressHistoryResponse> {
    const dto = this.mapToDTO();
    return this.dipService.dIPPutAddressHistoryItems(this.appId, dto).pipe(
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

  getData(): Observable<AddressHistoryResponse> {
    return this.dipService.dIPGetAddressHistoryItems(this.appId);
  }

  mapToDTO(): AddressHistoryRequest {
    const applicantAddressHistories: ApplicantAddressHistoryRequest[] = [];
    const values = this.applicantsFormArray.getRawValue() as ApplicantsFormArrayData[];
    values.forEach(applicant => {
      const addressHistoryItems: AddressHistoryItem[] = [];
      applicant.addressesHistory?.forEach((addressHistoryFormItem: AddressHistoryFormData) => {
        if (addressHistoryFormItem.addressType) {
          const address = this.addressFeService.mapAddressFEtoBFFAddress(
            addressHistoryFormItem?.address as AddressSearchForm,
            addressHistoryFormItem.addressType,
          );
          addressHistoryItems.push({
            address,
            ...(addressHistoryFormItem.moveInDate && {
              moveInDate: new Date(
                addressHistoryFormItem.moveInDate.getTime() - addressHistoryFormItem.moveInDate.getTimezoneOffset() * 60 * 1000,
              ).toISOString(),
            }),
            occupancyType: addressHistoryFormItem.occupancyType,
            addressHistoryItemId: addressHistoryFormItem.addressHistoryItemId,
          });
        }
      });
      applicantAddressHistories.push({
        applicantId: applicant.applicantId,
        addressHistoryItems,
      });
    });
    return {
      versionNumber: this.currentData.versionNumber as number,
      applicantAddressHistories,
    };
  }

  addAddress(index: number) {
    const addressHistoryForm = this.createAddressesHistoryForm();
    this.showToaster();
    this.addressHistoryFormArray(index).push(addressHistoryForm, { emitEvent: false });
    this.applicantsFormArray.markAsDirty();
    this.applicantsFormArray.updateValueAndValidity();
  }

  deleteAddressHistory(indexApplicant: number, indexAddressHistory: number) {
    this.addressHistoryFormArray(indexApplicant).removeAt(indexAddressHistory);
    this.applicantsFormArray.markAsDirty();
  }

  showPreviousCopy(controls: AbstractControl[]) {
    return controls.some((control, index) => control.valid && index !== 0);
  }

  copyAddress(applicantIndex: number, otherApplicantIndex: number, isCurrent: boolean) {
    const applicantAddressesGroup: FormArray = this.addressHistoryFormArray(applicantIndex);
    const otherApplicantAddressesData: FormArray = this.addressHistoryFormArray(otherApplicantIndex);
    if (isCurrent) {
      const form = applicantAddressesGroup.at(0);
      const data = otherApplicantAddressesData.at(0).value;
      form.patchValue(data);
      this.setSelectedAddressControl(form as FormGroup, data);
      form.markAsDirty();
    } else {
      otherApplicantAddressesData.controls.forEach((item, index) => {
        const data = item.value;
        if (index > 0) {
          if (applicantAddressesGroup.at(index)) {
            if (item.valid) {
              applicantAddressesGroup.at(index).patchValue(item.value);
              this.setSelectedAddressControl(applicantAddressesGroup.at(index) as FormGroup, data);
              applicantAddressesGroup.at(index).markAsDirty();
            } else {
              applicantAddressesGroup.removeAt(index);
            }
          } else if (item.valid) {
            const form = this.fb.group({
              addressHistoryItemId: data.addressHistoryItemId,
              addressType: [data.addressType, Validators.required],
              moveInDate: [data.moveInDate ? new Date(data.moveInDate) : null, Validators.required],
              occupancyType: [data.occupancyType, Validators.required],
            });
            (applicantAddressesGroup as FormArray).push(form, { emitEvent: false });
            this.setSelectedAddressControl(form, data);
            applicantAddressesGroup.at(index).markAsDirty();
          }
          this.applicantsFormArray.updateValueAndValidity();
        }
      });
    }
  }

  copyAddressFromSecurityScreen(applicantIndex: number) {
    const applicantFormArray: FormArray = this.applicantsFormArray.at(applicantIndex).get('addressesHistory') as FormArray;

    this.spinnerService.setIsLoading(true);
    this.dipService.dIPGetSecurityProperty(this.appId).subscribe(resp => {
      if (resp && resp.propertyAddress) {
        const address = this.addressFeService.mapAddressBFFToAddressFE(resp.propertyAddress as Address);
        applicantFormArray.at(0).get('addressType')?.setValue(resp.propertyAddress.addressType);
        setTimeout(() => {
          // workaround otherwise the component does not have the address form control the first time
          applicantFormArray.at(0).get('address')?.get('selectedAddressControl')?.patchValue(address);
          applicantFormArray.markAsDirty();
          this.saveData()
            .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
            .subscribe(response => {
              this.currentData.versionNumber = response.versionNumber;
            });
        }, 0);
      } else {
        this.spinnerService.setIsLoading(false);
      }
    });
  }

  populateYearRange() {
    if (this.calendar) {
      this.calendar.populateYearOptions(this.maxYear, this.minYear);
    }
  }

  private onChanges() {
    this.applicantsFormArray.valueChanges.subscribe(() => {
      this.dataService.setFormStatus(this.applicantsFormArray.status, this.STEP_NAME);
    });

    this.applicantsFormArray.valueChanges
      .pipe(debounceTime(this.dataService.DEBOUNCE_TIME), takeUntil(this.debounceSub$), skip(1))
      .subscribe(() => {
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

  private setFormData(applicantAddressHistories: ApplicantAddressHistoryResponse[] | null | undefined): void {
    if (!applicantAddressHistories) return;

    applicantAddressHistories?.forEach((app: ApplicantAddressHistoryResponse) => {
      const addressHistoryForm = this.fb.group({
        applicantId: app.applicantInfo?.applicantId,
        addressesHistory: this.fb.array([], {
          validators: [GroupValidators.checkYearsAmount(3, 'moveInDate'), GroupValidators.checkOrderedDates('moveInDate')],
        }),
      });

      //Logic for the moveInDate, just in the current Address
      addressHistoryForm.controls.addressesHistory.valueChanges
        .pipe(startWith([]), pairwise())
        .subscribe(([prev, next]: [AddressHistoryFormData[], AddressHistoryFormData[]]) => {
          if ((addressHistoryForm.controls.addressesHistory as FormArray).length === 1) {
            const filteredPrev: Date[] = [];
            const filteredNext: Date[] = [];
            const diff: Date[] = [];

            prev.forEach((item: AddressHistoryFormData) => {
              if (item.moveInDate) {
                filteredPrev.push(item.moveInDate);
              }
            });

            next.forEach((item: AddressHistoryFormData) => {
              if (item.moveInDate) {
                filteredNext.push(item.moveInDate);
              }
            });

            filteredPrev.forEach((pre: Date, index: number) => {
              if (pre !== filteredNext[index] && !filteredNext[index]) {
                diff.push(pre);
              }
            });

            if (JSON.stringify(filteredPrev) !== JSON.stringify(filteredNext) && !diff.length) {
              const threeYearsAgo = this.subThreeYears();
              const dateIndex = next.findIndex((item: AddressHistoryFormData) => {
                return item.moveInDate && item.moveInDate.getTime() < threeYearsAgo;
              });
              if (dateIndex === -1 && this.addressHistoryFormArray.length === 1) {
                const form = this.createAddressesHistoryForm();
                (addressHistoryForm.controls.addressesHistory as FormArray).push(form);
                this.showToaster();
              }
            }
          }
        });

      if (app.addressHistoryItems && app.addressHistoryItems.length) {
        app.addressHistoryItems.forEach((el: AddressHistoryItem) => {
          const form = this.createAddressesHistoryForm(el);
          (addressHistoryForm.controls.addressesHistory as FormArray).push(form, { emitEvent: false });
          setTimeout(() => {
            const address = el.address ? this.addressFeService.mapAddressBFFToAddressFE(el.address) : null;
            form.get('address')?.get('selectedAddressControl')?.patchValue(address);
            this.applicantsFormArray.updateValueAndValidity();
            this.dataService.setFormStatus(this.applicantsFormArray.status, this.stepSetupService.addressHistory.automationId);
          }, 0);
        });
      } else {
        const form = this.createAddressesHistoryForm();
        (addressHistoryForm.controls.addressesHistory as FormArray).push(form);
      }

      this.applicantsFormArray.push(addressHistoryForm);
    });
  }

  private createAddressesHistoryForm(data?: AddressHistoryItem): FormGroup {
    return this.fb.group({
      addressHistoryItemId: data ? data.addressHistoryItemId : null,
      addressType: [data ? data.address?.addressType : null, Validators.required],
      moveInDate: [data && data.moveInDate ? new Date(data.moveInDate) : null, Validators.required],
      occupancyType: [data ? data.occupancyType : null, Validators.required],
    });
  }

  private subThreeYears(): number {
    const threeYearsAgo = new Date();
    return threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  }

  private showToaster() {
    this.toastService.showMessage({
      key: 'address-history',
      summary: 'You must provide at least 3 years of address history',
      severity: this.toastService.SEVERITIES.WARNING,
      sticky: false,
    });
  }

  private setSelectedAddressControl(form: FormGroup, data: AddressHistoryFormData) {
    setTimeout(() => {
      form
        .get('address')
        ?.get('selectedAddressControl')
        ?.patchValue({ ...data.address, addressType: data.addressType });
    }, 0);
  }
}
