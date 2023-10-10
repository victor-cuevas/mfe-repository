import { GetStipulationDocumentsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const getStipulations: GetStipulationDocumentsResponse = {
  stipulations: [
    {
      stipulationId: 'stip-1',
      documentName: null,
      status: 'TO_BE_RECEIVED',
      date: null,
      stipulationType: 'CurrentIncome',
      stipulationDescription:
        'Pay slips of most recent 2 consecutive months or 6 consecutive weeks for applicant A Fahey at employer project',
    },
  ],
};
