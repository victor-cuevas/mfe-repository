import {
  AddressHistoryRequest,
  AddressHistoryResponse,
  AddressModel,
  AddressSearchHitModel,
  RegisterAddressRequest,
  SearchAddressRequest,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const ahAddressHistory: AddressHistoryResponse = {
  applicantAddressHistories: [
    {
      applicantInfo: {
        applicantId: 1,
        firstName: 'Test',
        familyName: 'McTesterson',
        familyNamePrefix: '',
      },
      addressHistoryItems: [],
    },
  ],
  applicationDraftId: 1,
  versionNumber: 0,
};

export const ahAddressSearchPayload: SearchAddressRequest = {
  countryCode: 'GBR',
  keyWords: ['Buckingham Palace, London, SW1A 1AA'],
  maxSuggestions: 25,
};

export const ahAddressSearchOtherAddressPayload: SearchAddressRequest = {
  countryCode: 'GBR',
  keyWords: ['Museum and art gallery, Bristol, SW1A 1AA'],
  maxSuggestions: 25,
};

export const ahAddressSearchResponse: AddressSearchHitModel = {
  moreResultsAvailable: false,
  confidence: 'Verified match',
  suggestions: [
    {
      globalAddressKey: 'uniqueKeyIdentifier',
      text: 'Buckingham Palace, London, SW1A 1AA',
    },
  ],
};

export const ahAddressSearchOtherAddressResponse: AddressSearchHitModel = {
  moreResultsAvailable: false,
  confidence: 'Verified match',
  suggestions: [
    {
      globalAddressKey: 'uniqueKeyIdentifier',
      text: 'Museum and art gallery, Bristol, SW1A 1AA',
    },
  ],
};

export const ahAddressRegisterPayload: RegisterAddressRequest = {
  globalAddressKey: 'uniqueKeyIdentifier',
};

export const ahAddressRegisterResponse: AddressModel = {
  components: {
    countryIso2: 'GB',
    countryIso3: 'GBR',
    countryName: 'United Kingdom',
    language: 'en-GB',
    locality: {
      town: {
        name: 'London',
      },
    },
    organization: {
      companyName: 'Buckingham Palace',
    },
    postalCode: {
      fullName: 'SW1A 1AA',
      primary: 'SW1A 1AA',
    },
  },
  lineOne: 'Buckingham Palace',
  lineTwo: '',
  location: {
    addressType: 'UnitedKingdom',
    countryCode: 'GB',
    locality: 'LONDON',
  },
  postalCode: 'SW1A 1AA',
  region: '',
};

export const ahAddressRegisterOtherAddressResponse: AddressModel = {
  components: {
    countryIso2: 'GB',
    countryIso3: 'GBR',
    countryName: 'United Kingdom',
    language: 'en-GB',
    locality: {
      town: {
        name: 'Bristol',
      },
    },
    organization: {
      companyName: 'Museum and art gallery',
    },
    postalCode: {
      fullName: 'BS8 1RL',
      primary: 'BS8 1RL',
    },
  },
  lineOne: 'Museum and art gallerY',
  lineTwo: '',
  location: {
    addressType: 'UnitedKingdom',
    countryCode: 'GB',
    locality: 'LONDON',
  },
  postalCode: 'BS8 1RL',
  region: '',
};

export const putAddressHistory: AddressHistoryRequest = {
  versionNumber: 0,
  applicantAddressHistories: [
    {
      applicantId: 1,
      addressHistoryItems: [
        {
          address: {
            addressLine1: 'Buckingham Palace',
            addressLine2: null,
            addressLine3: null,
            addressLine4: null,
            addressLine5: null,
            city: 'LONDON',
            country: 'GB',
            zipCode: 'SW1A 1AA',
            addressType: 'UK',
          },
          moveInDate: '2010-08-01T00:00:00.000Z',
          occupancyType: 'TENANT_PRIVATE',
          addressHistoryItemId: null,
        },
      ],
    },
  ],
};

export const putAddressHistoryTwoApplicants: AddressHistoryRequest = {
  versionNumber: 0,
  applicantAddressHistories: [
    {
      applicantId: 1,
      addressHistoryItems: [
        {
          address: {
            addressLine1: 'Buckingham Palace',
            addressLine2: null,
            addressLine3: null,
            addressLine4: null,
            addressLine5: null,
            city: 'LONDON',
            country: 'GB',
            zipCode: 'SW1A 1AA',
            addressType: 'UK',
          },
          moveInDate: '2010-08-01T00:00:00.000Z',
          occupancyType: 'TENANT_PRIVATE',
          addressHistoryItemId: null,
        },
      ],
    },
    {
      applicantId: 2,
      addressHistoryItems: [
        {
          address: {
            addressLine1: 'Museum and art gallery',
            addressLine2: null,
            addressLine3: null,
            addressLine4: null,
            addressLine5: null,
            city: 'Bristol',
            country: 'GB',
            zipCode: 'SW1A 1AA',
            addressType: 'UK',
          },
          moveInDate: null,
          occupancyType: null,
          addressHistoryItemId: null,
        },
      ],
    },
  ],
};

export const putAddressHistorySecurity: AddressHistoryRequest = {
  versionNumber: 0,
  applicantAddressHistories: [
    {
      applicantId: 1,
      addressHistoryItems: [
        {
          address: {
            addressLine1: 'Oxford Street Eatery',
            addressLine2: '46-50 New Oxford Street',
            addressLine3: null,
            addressLine4: null,
            addressLine5: null,
            addressType: 'UK',
            city: 'LONDON',
            country: 'GB',
            zipCode: 'WC1A 1ES',
          },
          occupancyType: null,
          addressHistoryItemId: null,
        },
      ],
    },
  ],
};

export const ahAddressHistoryTwoApplicants: AddressHistoryResponse = {
  applicantAddressHistories: [
    {
      applicantInfo: {
        applicantId: 1,
        firstName: 'Test',
        familyName: 'McTesterson',
        familyNamePrefix: '',
      },
      addressHistoryItems: [],
    },
    {
      applicantInfo: {
        applicantId: 1,
        firstName: 'TestTwo',
        familyName: 'McTestersonTwo',
        familyNamePrefix: '',
      },
      addressHistoryItems: [],
    },
  ],
  applicationDraftId: 1,
  versionNumber: 0,
};
