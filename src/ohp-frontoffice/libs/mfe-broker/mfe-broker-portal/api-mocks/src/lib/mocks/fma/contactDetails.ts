import {
  ContactDetailsResponse,
  PersonalDetailsResponse,
  ValuationDetailsResponse,
  ValuationType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicant1, applicationDraft, versionNumber } from '../../constants';

type CreateContactDetailsOpts = {
  fullDetails: boolean;
};

const defaultOptions: CreateContactDetailsOpts = {
  fullDetails: false,
};

export const createContactDetails: (options?: Partial<CreateContactDetailsOpts>) => ContactDetailsResponse = options => {
  const opts = Object.assign({}, defaultOptions, options ?? {});

  return {
    applicants: [
      {
        applicantInfo: {
          applicantId: applicant1.applicantId,
          familyName: applicant1.familyName,
          familyNamePrefix: applicant1.familyNamePrefix,
          firstName: applicant1.firstName,
        },
        contactDetails: opts.fullDetails
          ? {
              address: null,
              email: applicant1.email,
              firstName: applicant1.firstName,
              homePhone: applicant1.phone,
              isCorrespondenceAddressDifferentFromCurrentAddress: false,
              lastName: applicant1.familyName,
              mobilePhone: applicant1.phone,
              preferredContactMethod: 'MOBILE_PHONE',
              preferredContactTimeslot: null,
              printedCorrespondenceFormat: null,
              title: applicant1.title,
              useRelayUK: null,
              willHomePhoneChange: null,
              workPhone: applicant1.phone,
            }
          : {},
      },
    ],
    applicationDraftId: applicationDraft.id,
    versionNumber,
  };
};

export const getFmaPersonalDetailsResponse: PersonalDetailsResponse = {
  applicantPersonalDetails: [{ ...applicant1 }],
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const getFmaValuationDetails: ValuationDetailsResponse = {
  additionalInformationForValuer: null,
  applicantId: null,
  companyName: null,
  contactInformation: null,
  contactName: null,
  valuationContact: null,
  valuationType: ValuationType.FREE_VALUATION,
  applicationDraftId: applicationDraft.id,
  versionNumber,
};
