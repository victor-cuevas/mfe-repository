import {
  AddressModel,
  AddressSearchHitModel,
  RegisterAddressRequest,
  SearchAddressRequest,
  SecurityPropertyRequest,
  SecurityPropertyResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicationDraft, case1, england, purchaseValue, versionNumber } from '../../constants';

export const spSecurityProperty: SecurityPropertyResponse = {
  addressType: null,
  applicantsHaveLegalOwnershipOnOtherProperties: null,
  applicantsLiveInTheProperty: true,
  arePeopleOver17NotInTheMortgageLivingInTheProperty: null,
  constructionDetails: null,
  constructionType: null,
  energyRating: null,
  floor: null,
  hasBeenPreviouslyOwnedByLo: null,
  hasCustomerFoundProperty: true,
  hasGarageOrParkingSpace: null,
  hasLift: null,
  hasPropertyGuaranteeScheme: null,
  hasSufferedFromSubsidence: null,
  heritageStatus: null,
  isAtRiskOfCoastalOrRiverErosion: null,
  isFlatAboveCommercialPremises: null,
  isHabitable: null,
  isHmo: null,
  isPlotSizeGreaterThanOneAcre: null,
  isStandardConstruction: null,
  isSTandardRoof: null,
  isToBeUsedForBusinessPurposes: null,
  numberOfBathrooms: null,
  numberOfBedrooms: null,
  numberOfFloors: null,
  numberOfKitchens: null,
  numberOfReceptionrooms: null,
  otherPropertyGuaranteeScheme: null,
  propertyAddress: null,
  propertyGuaranteeScheme: null,
  propertyInformationId: null,
  propertyLocation: england,
  propertyOwnershipType: 'Standard',
  propertyStyle: null,
  propertyType: null,
  purchasePrice: purchaseValue,
  realEstateScenario: null,
  remainingTermOfLeaseInYears: null,
  roofType: null,
  tenure: null,
  yearBuilt: null,
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const spAddressSearchPayload: SearchAddressRequest = {
  countryCode: 'GBR',
  maxSuggestions: 25,
  keyWords: ['Oxford Street Eatery, 46-50 New Oxford Street, London, WC1A 1ES'],
};

export const spAddressSearchResponse: AddressSearchHitModel = {
  moreResultsAvailable: false,
  confidence: 'Verified match',
  suggestions: [
    {
      globalAddressKey: 'uniqueKeyIdentifier',
      text: 'Oxford Street Eatery, 46-50 New Oxford Street, London, WC1A 1ES',
    },
  ],
};

export const spAddressRegisterPayload: RegisterAddressRequest = {
  globalAddressKey: 'uniqueKeyIdentifier',
};

export const spAddressRegisterResponse: AddressModel = {
  postalCode: 'WC1A 1ES',
  location: { addressType: 'UnitedKingdom', locality: 'LONDON', countryCode: 'GB' },
  region: '',
  lineOne: case1.propertyAddress.addressLine1,
  lineTwo: case1.propertyAddress.addressLine2,
  components: {
    language: 'en-GB',
    countryName: 'United Kingdom',
    countryIso3: 'GBR',
    countryIso2: 'GB',
    postalCode: { fullName: 'WC1A 1ES', primary: 'WC1A 1ES' },
    street: { fullName: 'New Oxford Street', name: 'New Oxford', type: 'Street' },
    locality: { town: { name: 'London' } },
    building: { buildingNumber: '46-50' },
    organization: { companyName: 'Oxford Street Eatery' },
  },
};

export const spSubmitSecurityPropertyPayload: SecurityPropertyRequest = {
  addressType: 'UK',
  constructionDetails: null,
  constructionType: 'BRICK_STONE',
  heritageStatus: 'NO',
  numberOfBedrooms: 3,
  propertyAddress: case1.propertyAddress,
  propertyStyle: 'SEMI_DETACHED',
  propertyType: 'SINGLE_FAMILY_HOME',
  realEstateScenario: 'EXISTING_BUILDING',
  remainingTermOfLeaseInYears: 85,
  roofType: 'TILE_SLATE',
  tenure: 'LEASEHOLD',
  versionNumber: 0,
  yearBuilt: 1960,
};

export const spSubmitSecurityPropertyResponse: SecurityPropertyResponse = {
  addressType: null,
  applicantsHaveLegalOwnershipOnOtherProperties: null,
  applicantsLiveInTheProperty: true,
  arePeopleOver17NotInTheMortgageLivingInTheProperty: null,
  constructionDetails: null,
  constructionType: 'BRICK_STONE',
  energyRating: null,
  floor: null,
  hasBeenPreviouslyOwnedByLo: null,
  hasCustomerFoundProperty: true,
  hasGarageOrParkingSpace: null,
  hasLift: null,
  hasPropertyGuaranteeScheme: null,
  hasSufferedFromSubsidence: null,
  heritageStatus: 'NO',
  isAtRiskOfCoastalOrRiverErosion: null,
  isFlatAboveCommercialPremises: null,
  isHabitable: null,
  isHmo: null,
  isPlotSizeGreaterThanOneAcre: null,
  isStandardConstruction: null,
  isSTandardRoof: null,
  isToBeUsedForBusinessPurposes: null,
  numberOfBathrooms: null,
  numberOfBedrooms: null,
  numberOfFloors: null,
  numberOfKitchens: null,
  numberOfReceptionrooms: null,
  otherPropertyGuaranteeScheme: null,
  propertyAddress: case1.propertyAddress,
  propertyGuaranteeScheme: null,
  propertyInformationId: null,
  propertyLocation: england,
  propertyOwnershipType: 'Standard',
  propertyStyle: null,
  propertyType: 'SINGLE_FAMILY_HOME',
  purchasePrice: purchaseValue,
  realEstateScenario: 'EXISTING_BUILDING',
  remainingTermOfLeaseInYears: 5,
  roofType: 'TILE_SLATE',
  tenure: 'LEASEHOLD',
  yearBuilt: 1960,
  applicationDraftId: applicationDraft.id,
  versionNumber,
};
