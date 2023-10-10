import { Injectable } from '@angular/core';
import { Address, AddressModel, FirmAddressModel } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { FeAddress } from '../models';
import { SortService } from '@close-front-office/mfe-broker/core';
import { CodeTablesService } from './code-tables.service';

@Injectable({
  providedIn: 'root',
})
export class AddressFeService {
  countries = this.codeTablesService
    .getCodeTable('cdtb-countrycode')
    .sort((a, b) => this.sortService.sortArrayByLabel(a.label as string, b.label as string));

  constructor(private codeTablesService: CodeTablesService, private sortService: SortService) {}

  mapAddressToFeAddressModel(address: AddressModel): FeAddress {
    return {
      lineOne: address.lineOne ?? '',
      lineTwo: address.lineTwo ?? '',
      lineThree: address.lineThree ?? '',
      lineFour: address.lineFour ?? '',
      lineFive: address.lineFive ?? '',
      postcode: address.postalCode,
      city: address.location.locality ?? '',
      country: address.location.countryCode ?? '',
    };
  }

  mapAddressFirmToFeAddress(address: Address): FeAddress {
    return {
      lineOne: `${address?.numberOrBuilding ? address?.numberOrBuilding : ''} ${address?.lineOne ? address?.lineOne : ''}` ?? '',
      lineTwo: address?.lineTwo ?? '',
      lineThree: address?.lineThree ?? '',
      lineFour: address?.lineFour ?? '',
      lineFive: address?.lineFive ?? '',
      postcode: address?.postcode,
      city: address?.city ?? '',
      country: address?.country ?? '',
    };
  }

  mapFirmAddressModelToAddressFE(address: FirmAddressModel): FeAddress {
    return {
      lineOne: address.lineOne,
      lineTwo: address.lineTwo,
      lineThree: address.lineThree,
      lineFour: address.lineFour,
      lineFive: address.lineFive,
      postcode: address.postcode,
      city: address.city,
      country: address.country,
    };
  }
}
