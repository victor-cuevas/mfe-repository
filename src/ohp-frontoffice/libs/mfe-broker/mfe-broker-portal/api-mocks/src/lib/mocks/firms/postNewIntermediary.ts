import {
  IntermediaryFcaDetailsModel,
  IntermediaryRole,
  InviteIntermediaryRequest,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { applicant1, firm1 } from '../../constants';

export const postNewIntermediary: InviteIntermediaryRequest = {
  firmId: firm1.id,
  intermediaryRole: IntermediaryRole.Viewer,
  person: {
    title: '',
    firstName: applicant1.firstName ?? '',
    lastName: applicant1.familyName,
    dateOfBirth: '1990-01-01T00:00:00.000Z',
  },
  tradingAddressId: '170ba5d7',
  email: applicant1.email,
  telephone: {
    mobile: '+441234567890',
  },
  copyCaseNotificationsToAdminAssistants: false,
};

export const getIntermediaryByAdvisorUniqueId: IntermediaryFcaDetailsModel = {
  fullName: 'Test Advisor',
};
