import { GetCaseDocumentsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const getDocumentsSummary: GetCaseDocumentsResponse = {
  caseDocuments: [
    {
      date: '2022-07-28T14:27:16.0491336Z',
      description: 'ESIS illustration document',
      externalReference: '1',
      id: 'ads-esis-1',
      mimeType: 'application/pdf',
      name: 'ESIS illustration 1.pdf',
      size: 42587,
      stage: 'ILLUSTRATION',
      status: 'Completed',
    },
  ],
};
