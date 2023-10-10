import {
  ApplicantsType,
  CaseDataResponse,
  CasePurposeType,
  CaseStatusResponse,
  PropertyPurpose,
  Stage,
  Status,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Case, case1 } from '../../constants/cases';
import { firm1 } from '../../constants/firms';
import { Applicant, applicant1, User, user1 } from '../../constants/people';

const generateStageHistory = (stage: Stage, userId: string): CaseStatusResponse[] => {
  switch (stage) {
    case Stage.New:
      return [
        {
          createdBy: userId,
          stage: Stage.New,
          status: Status.Active,
          statusDate: '2022-11-28T12:57:44.8829904+00:00',
        },
      ];
    case Stage.Draft:
      return [
        {
          createdBy: userId,
          stage: Stage.New,
          status: Status.Active,
          statusDate: '2022-11-28T12:57:44.8829904+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Draft,
          status: Status.Active,
          statusDate: '2022-11-28T13:28:35.2602675+00:00',
        },
      ];
    case Stage.Illustration:
      return [
        {
          createdBy: userId,
          stage: Stage.New,
          status: Status.Active,
          statusDate: '2022-11-28T12:57:44.8829904+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Draft,
          status: Status.Active,
          statusDate: '2022-11-28T13:28:35.2602675+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Illustration,
          status: Status.Active,
          statusDate: '2022-11-28T11:24:46.6779355+00:00',
        },
      ];
    case Stage.Dip:
      return [
        {
          createdBy: userId,
          stage: Stage.New,
          status: Status.Active,
          statusDate: '2022-11-28T12:57:44.8829904+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Draft,
          status: Status.Active,
          statusDate: '2022-11-28T13:28:35.2602675+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Dip,
          status: Status.Active,
          statusDate: '2022-11-25T11:28:53.0726903+00:00',
        },
      ];
    case Stage.Fma:
      return [
        {
          createdBy: userId,
          stage: Stage.New,
          status: Status.Active,
          statusDate: '2022-11-28T12:57:44.8829904+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Draft,
          status: Status.Active,
          statusDate: '2022-11-28T13:28:35.2602675+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Dip,
          status: Status.Active,
          statusDate: '2022-11-25T11:28:53.0726903+00:00',
        },
        {
          createdBy: userId,
          stage: Stage.Fma,
          status: Status.Active,
          statusDate: '2022-11-17T16:32:57.7818202+00:00',
        },
      ];
    case Stage.Underwriting:
      return [];
    default:
      return [];
  }
};

type CreateGetCaseByIdOptions = {
  applicant: Applicant;
  applicationCase: Case;
  status: Status;
  user: User;
};

const defaultOptions: CreateGetCaseByIdOptions = {
  applicant: applicant1,
  applicationCase: case1,
  status: Status.Active,
  user: user1,
};

export const createGetCaseByIdResponse = (stage: Stage, options?: CreateGetCaseByIdOptions): CaseDataResponse => {
  const { applicant, applicationCase, status, user } = Object.assign({}, defaultOptions, options);

  const getCaseByIdResponse: CaseDataResponse = {
    assigneeFullName: user.fullName,
    createdByFullName: user.fullName,
    dossierNumber: null,
    totalLoanAmount: null,
    amount: 0.0,
    assigneeId: user.id,
    caseId: applicationCase.id,
    casePurposeType: CasePurposeType.Purchase,
    contactsInformation: [
      {
        contactInformationId: 1,
        contactType: ApplicantsType.FIRST_TIME_BUYER,
        firstName: applicant.firstName,
        familyName: applicant.familyName,
        dateOfBirth: applicant.birthDate,
        customData: [],
      },
    ],
    created: '2022-07-20T14:35:14.2903522+00:00',
    createdBy: user.id,
    customData: [
      { key: 'PropertyPurpose', value: PropertyPurpose.OWNER_OCCUPATION },
      { key: 'AgreeToDocumentsAndTAndC', value: 'True' },
      { key: 'ConfirmApplicantsPermission', value: 'True' },
      { key: 'ConfirmStatements', value: 'True' },
      { key: 'ApplicantConsentToUseData', value: 'True' },
    ],
    modified: '2022-07-20T14:35:14.2903522+00:00',
    modifiedBy: user.id,
    ownerId: firm1.id,
    stage,
    status,
    statusHistory: generateStageHistory(stage, user.id),
    versionNumber: 0,
  };

  return getCaseByIdResponse;
};
