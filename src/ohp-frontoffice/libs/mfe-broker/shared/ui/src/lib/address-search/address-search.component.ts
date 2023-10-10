import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupValidators } from '@close-front-office/mfe-broker/core';

export interface RegistrerAddressModel {
  globalAddressKey: string;
}

export interface AddressSuggestionModel {
  globalAddressKey: string;
  text: string;
}

export interface BrokerCodeTableOption {
  value?: string | null;
  label?: string | null;
}

export enum AddressTypeEnum {
  UK = 'UK',
  BFPO = 'BFPO',
  OVERSEAS = 'OVERSEAS',
}

export interface FeAddress {
  lineOne?: string | null | undefined;
  lineTwo?: string | null | undefined;
  lineThree?: string | null | undefined;
  lineFour?: string | null | undefined;
  lineFive?: string | null | undefined;
  postcode?: string | null | undefined;
  city?: string | null | undefined;
  country?: string | null | undefined;
}

@Component({
  selector: 'cfo-address-search',
  templateUrl: './address-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressSearchComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() form!: FormGroup;
  @Output() suggestAddresses = new EventEmitter<{ originalEvent: Event; query: string }>();
  @Input() suggestedAddresses: Array<AddressSuggestionModel> = [];
  @Output() selectedAddressEvent = new EventEmitter<RegistrerAddressModel>();
  @Input() selectedAddress: FeAddress | null = null;
  @Input() hasButtonVisible = true;
  @Input() hasAutoSuggestVisible = true;
  @Input() listOfCountries!: BrokerCodeTableOption[];
  @Input() hasNoValidation = false;
  @Input() readOnlyMode = false;

  wasEnterManuallyAddressClicked = false;
  addressTypeEnum: typeof AddressTypeEnum = AddressTypeEnum;

  // TODO: Fix group validations to remove hardcoded 'required' properties from FormItem
  addressForm = this.fb.group(
    {
      selectedAddressControl: null,
      lineOne: null,
      lineTwo: null,
      lineThree: null,
      lineFour: null,
      lineFive: null,
      postcode: null,
      city: null,
      country: null,
    },
    {
      validators: GroupValidators.addressValidation(
        () => this.hasAutoSuggestVisible,
        () => this.form?.value.addressType,
        () => this.hasNoValidation,
      ),
    },
  );

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.form.addControl('address', this.addressForm, { emitEvent: false });

    if (this.form?.getRawValue().addressType !== AddressTypeEnum.UK) this.hasAutoSuggestVisible = false;
    if (this.form?.controls.addressType?.value !== AddressTypeEnum.UK) this.hasButtonVisible = false;

    this.form?.controls.addressType?.valueChanges.subscribe(addressType => {
      addressType === AddressTypeEnum.UK ? (this.hasButtonVisible = true) : (this.hasButtonVisible = false);
      if (addressType === AddressTypeEnum.UK) this.wasEnterManuallyAddressClicked = false;
      this.selectedAddress = null;
      this.addressForm.reset();
      //workaround to enable again the country field when changing from UK to BFPO address type
      this.addressForm.enable();
      this.hasAutoSuggestVisible = addressType === AddressTypeEnum.UK;
      this.cd.detectChanges();
    });
    this.addressForm.get('selectedAddressControl')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'object' && !value.globalAddressKey && !value.text) {
        this.setFormData(value, this.form?.getRawValue().addressType);
      }
      this.cd.detectChanges();
    });
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { selectedAddress } = changes;
    if (selectedAddress) this.addressForm.patchValue(selectedAddress.currentValue);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.form?.get('address')) {
      this.form?.removeControl('address');
    }
  }

  searchAddresses(query: { originalEvent: Event; query: string }) {
    if (query.query.length > 0) {
      this.suggestAddresses.emit(query);
    }
  }

  selectAddress(selectedAddress: RegistrerAddressModel) {
    this.selectedAddressEvent.emit({ globalAddressKey: selectedAddress.globalAddressKey });
    this.cd.detectChanges();
  }

  toggleAddressEntry() {
    this.hasAutoSuggestVisible = !this.hasAutoSuggestVisible;
    this.selectedAddress = null;
    if (this.hasAutoSuggestVisible) {
      this.addressForm.reset();
      this.hasButtonVisible = true;
      this.wasEnterManuallyAddressClicked = false;
    } else {
      this.hasButtonVisible = false;
      this.wasEnterManuallyAddressClicked = true;
    }
    this.cd.detectChanges();
  }

  private setFormData(address: FeAddress, addressType: AddressTypeEnum) {
    this.hasAutoSuggestVisible = addressType === AddressTypeEnum.UK;
    const hasAnyValue = Object.keys(address).some(key => !!address[key as keyof typeof address]);
    this.addressForm.reset(address, { emitEvent: false });
    if (hasAnyValue && this.hasAutoSuggestVisible) {
      this.selectedAddress = address;
      this.addressForm.get('selectedAddressControl')?.reset(
        {
          text: `${address?.lineOne ? address?.lineOne + ' ' : ''}${address?.lineTwo ? address?.lineTwo + ' ' : ''}${
            address?.city ? address?.city + ' ' : ''
          }${address?.postcode ? address?.postcode + ' ' : ''}`,
        },
        { emitEvent: false },
      );
    }
    this.cd.detectChanges();
  }
}
