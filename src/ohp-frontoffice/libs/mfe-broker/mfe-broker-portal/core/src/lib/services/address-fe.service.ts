import { Injectable } from '@angular/core';
import { Address, AddressAddressType, AddressModel, AddressType2 } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { FeAddress } from '../models';
import { CodeTablesService } from './code-tables.service';
import { SortService } from '@close-front-office/mfe-broker/core';

export interface AddressSearchForm {
  selectedAddressControl?: { [key: string]: any } | null;
  lineOne: string | null;
  lineTwo: string | null;
  lineThree: string | null;
  lineFour: string | null;
  lineFive: string | null;
  postcode: string | null;
  city: string | null;
  country: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AddressFeService {
  constructor(private codeTablesService: CodeTablesService, private sortService: SortService) {}

  countries = this.codeTablesService
    .getCodeTable('cdtb-countrycode')
    .sort((a, b) => this.sortService.sortArrayByLabel(a.label as string, b.label as string));

  countriesWithoutUK = this.codeTablesService
    .getCodeTable('cdtb-countrycode')
    .sort((a, b) => this.sortService.sortArrayByLabel(a.label as string, b.label as string))
    .filter(country => country.value !== 'UK' && country.value !== 'GB');

  mapAddressToFeAddressModel(address: AddressModel): FeAddress {
    return {
      lineOne: address.lineOne || null,
      lineTwo: address.lineTwo || null,
      lineThree: address.lineThree || null,
      lineFour: address.lineFour || null,
      lineFive: address.lineFive || null,
      postcode: address.postalCode || null,
      city: address.location.locality || null,
      country: address.location.countryCode || null,
    };
  }

  mapAddressFEtoBFFAddress(addressFromForm: AddressSearchForm, addressTypeFromForm: AddressAddressType): Address {
    return {
      addressType: addressTypeFromForm,
      addressLine1: addressFromForm?.lineOne,
      addressLine2: addressFromForm?.lineTwo,
      addressLine3: addressFromForm?.lineThree,
      addressLine4: addressFromForm?.lineFour,
      addressLine5: addressTypeFromForm === AddressType2.Bfpo ? addressFromForm.country : addressFromForm?.lineFive,
      city: addressFromForm?.city,
      country: addressTypeFromForm === AddressType2.Bfpo ? 'UK' : addressFromForm?.country,
      zipCode: addressFromForm?.postcode,
    };
  }

  mapAddressBFFToAddressFE(address: Address): FeAddress {
    return {
      lineOne: address?.addressLine1,
      lineTwo: address?.addressLine2,
      lineThree: address?.addressLine3,
      lineFour: address?.addressLine4,
      lineFive: address?.addressLine5,
      postcode: address?.zipCode,
      city: address?.city,
      country: address?.addressType === AddressType2.Bfpo ? address?.addressLine5 : address?.country,
    };
  }
}
