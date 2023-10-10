import { AuthorizationContextModel as PanelAuthorization } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { AuthorizationContextModel as PortalAuthorization } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { firm1 } from '../../constants';

export const createGetMeResponse = (
  name: string,
  surname: string,
  role: PanelAuthorization['role'] | PortalAuthorization['role'],
): PanelAuthorization | PortalAuthorization => {
  let permission: PanelAuthorization['permission'] | PortalAuthorization['permission'];
  let userType: PanelAuthorization['userType'] | PortalAuthorization['userType'];
  switch (role) {
    case 'LenderAdvisorAdmin':
      permission = {
        assistants: ['others'],
        configuration: ['lender'],
        firms: ['lender'],
        intermediaries: null,
        portal: [],
        profiles: ['lender'],
        submissionRoutes: ['lender'],
        switcher: ['lender'],
        lender: ['admin'],
      };
      userType = 'Lender';
      break;
    case 'SupervisorAndAdvisor':
      permission = {
        assistants: ['others', 'me'],
        case: ['assignee', 'transferAssignee', 'viewer'],
        illustration: ['assignee', 'viewer'],
        dip: ['assignee', 'viewer'],
        fma: ['assignee', 'viewer'],
        switcher: ['firm'],
      };
      userType = 'Intermediary';
      break;
    default:
      break;
  }

  return {
    agreeToTermsAndConditions: true,
    firmId: firm1.id,
    firmName: firm1.firmName,
    firstName: name,
    intermediaryId: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
    lastName: surname,
    permission,
    profilePicture: null,
    role,
    roleMappings: [],
    subordinateIntermediaries: [],
    title: 'mr',
    userType,
  };
};
