import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddressService, Lender, LenderService, UpdateLenderRequest } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { AddressSearchComponent } from '@close-front-office/mfe-broker/shared-ui';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { debounceTime, finalize } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { AddressSuggestionModel, RegisterAddressRequest } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { FeAddress } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AddressFeService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Component({
  selector: 'close-front-office-lender-details',
  templateUrl: './lender-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LenderDetailsComponent implements AfterViewInit {
  initialData: Lender = this.route.snapshot.data['lenderDetailsData'];

  @ViewChild(AddressSearchComponent) addressSearchComponent!: AddressSearchComponent;
  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress | null = null;

  lenderDetailsForm = this.fb.group({
    lenderName: [this.initialData?.lenderName, Validators.required],
    reference: [this.initialData?.reference, Validators.required],
    telephone: this.initialData?.telephone?.telephoneWork,
    email: [this.initialData?.email, Validators.email],
    contactPerson: this.initialData?.contactPerson,
    website: this.initialData?.website,
    complaintsWebpage: [this.initialData?.complaintsWebpage, Validators.required],
    addressType: 'UK',
    //sendCaseNotification: null //TODO - Not available yet
    //firmSharedEmail: [null, Validators.email] //TODO - Not available yet
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private lenderService: LenderService,
    private toastService: ToastService,
    private addressService: AddressService,
    public addressFeService: AddressFeService,
  ) {}

  ngAfterViewInit(): void {
    this.lenderDetailsForm.get('address')?.get('selectedAddressControl')?.patchValue(this.initialData.address);
    this.cd.detectChanges();
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

  updateLenderDetails() {
    if (this.lenderDetailsForm.valid) {
      this.spinnerService.setIsLoading(true);
      this.lenderService
        .lenderPutLender(this.mapToDTO())
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe(() =>
          this.toastService.showMessage({
            summary: 'The lender details were updated successfully',
          }),
        );
    }
  }

  private mapToDTO(): UpdateLenderRequest {
    const formValues = this.lenderDetailsForm.getRawValue();
    return {
      lenderName: formValues.lenderName,
      reference: formValues.reference,
      email: formValues.email,
      contactPerson: formValues.contactPerson,
      website: formValues.website,
      complaintsWebpage: formValues.complaintsWebpage,
      telephone: {
        mobile: `${formValues.telephone.e164Number}`, //mandatory field in ADS
        telephoneWork: `${formValues.telephone.e164Number}`,
      },
      address: formValues.address,
      version: this.initialData.version++,
    };
  }
}
