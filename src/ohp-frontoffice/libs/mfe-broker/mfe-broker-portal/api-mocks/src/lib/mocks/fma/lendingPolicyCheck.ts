import {
  GetCaseDocumentsResponse,
  LendingPolicyCheckResponse,
  LoanStage,
  LoanStateResponse,
  LoanStatus,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { case1, loan1, user1, versionNumber } from '../../constants';

export const getLendingPolicyCheck: LendingPolicyCheckResponse = {
  consentCheck: false,
  idConfirmedCheck: false,
  requiredDocumentsCheck: false,
  loanId: loan1.id,
  versionNumber,
};

export const putFmaSubmit: LoanStateResponse = {
  createdBy: user1.id,
  documentId: null,
  dossierNumber: case1.id,
  externalReference: null,
  loanId: loan1.id,
  stage: LoanStage.Fma,
  status: LoanStatus.Assessment,
  traceId: null,
  rejectionReasons: [],
};

export const getFmaLendingPolicyCheckDocuments: GetCaseDocumentsResponse = {
  caseDocuments: [
    {
      date: '2022-12-16T12:59:22',
      description: 'DIP_Pack',
      externalReference: 'proldetl-1',
      id: 'reldoc-7e8e5818-7b5e-40ba-a5b2-b73baf2d52c2',
      mimeType: 'application/pdf',
      name: 'DIP_Pack',
      size: 1,
      stage: '',
      status: '',
    },
    {
      date: '2023-01-05T12:47:40',
      description: 'Application_Declaration',
      externalReference: null,
      id: 'reldoc-43836819-d054-43ce-bf39-191626ede53f',
      mimeType: 'application/pdf',
      name: 'Application_Declaration',
      size: null,
      stage: '',
      status: '',
    },
    {
      date: '2023-01-05T12:47:41',
      description: 'ESIS',
      externalReference: null,
      id: 'reldoc-c1a8e04a-4cd9-4c01-b1ca-49d701da4fea',
      mimeType: 'application/pdf',
      name: 'ESIS',
      size: null,
      stage: '',
      status: '',
    },
  ],
};
