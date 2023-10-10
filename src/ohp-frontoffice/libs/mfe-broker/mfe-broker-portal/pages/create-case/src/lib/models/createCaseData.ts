import { CasePurposeType, IntermediaryResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface CreateCaseData {
  caseOwner: IntermediaryResponse;
  casePurposeType: CasePurposeType;
  propertyPurpose: string;
  killerQuestions: {
    statementsCorrect: boolean;
    permissionCheck: boolean;
    dataConsent: boolean;
    termsAndConditions: boolean;
  };
}
