import { SolicitorDetailsResponse, SolicitorSearchResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicationDraft, versionNumber } from '../../constants';

export const getFmaSolicitorDetails: SolicitorDetailsResponse = {
  applicantsConsentForSolicitorAssignment: null,
  conveyancer: null,
  hasFreeLegalSolicitor: null,
  isSeparateRepresentationSelected: null,
  solicitor: null,
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const getFmaSearchSolicitor: SolicitorSearchResponse = {
  solicitors: [
    {
      address: {
        addressLine1: 'The Old Grammar School',
        addressLine2: 'Church Road',
        addressLine3: null,
        addressLine4: 'Thame',
        addressLine5: 'Oxfordshire',
        addressType: null,
        city: 'Thame',
        country: 'GB',
        region: null,
        state: null,
        zipCode: 'OX9 3AJ',
      },
      externalReference: 'PA1436S/SPO',
      registrationNumber: null,
      solicitorName: 'second test firm',
    },
  ],
};
