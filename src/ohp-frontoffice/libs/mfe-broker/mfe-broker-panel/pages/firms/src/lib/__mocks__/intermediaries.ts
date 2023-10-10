import { IntermediarySearchResultPageModel } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

export const mockIntermediaries: IntermediarySearchResultPageModel = {
  items: [
    {
      id: 'INT1',
      firmId: 'FRM1',
      person: {
        firstName: 'TEST',
        dateOfBirth: '28-03-1989',
      },
      advisorUniqueId: 'J0006',
      position: 'Supervisor',
      email: '',
      status: 'Active',
      isInReview: true,
    },
  ],
  page: 1,
  size: 10,
  total: 2,
  totalPages: 1,
};
