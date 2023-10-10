import { LoanStatus, UploadStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  case1,
  createFmaSummary,
  firm1,
  getFmaProgress,
  validCredentials,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { TestCallback } from 'mocha';
import {
  caseSummaryStubs,
  contactDetailsStubs,
  globalFmaStubs,
  uploadDocumentsStub,
  uploadDocumentsRejectedStubs,
} from '../../../fixtures/fma/fmaHappyPathStubs';

describe('FMA Upload documents', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([
      ...globalFmaStubs,
      ...caseSummaryStubs,
      ...contactDetailsStubs,
      ...uploadDocumentsStub,
      { method: 'GET', endpoint: '/fmasummary$', alias: 'getFmaSummary', stub: createFmaSummary(LoanStatus.Documentation) },
      {
        method: 'GET',
        endpoint: '/progress$',
        alias: 'getProgress',
        stub: getFmaProgress([
          'addressHistory',
          'adviceFees',
          'affordabilityCheck',
          'bankAccount',
          'contactDetails',
          'currentIncome',
          'depositDetails',
          'financialCommitments',
          'adviceFees',
          'fmaCurrentIncome',
          'fmaSecurityProperty',
          'futureChanges',
          'householdExpenditure',
          'lenderPolicyCheck',
          'personalDetails',
          'productSelection',
          'propertyAndLoan',
          'retirementIncome',
          'securityProperty',
          'solicitorDetails',
          'valuationDetails',
        ]),
      },
    ]);

    cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}/fma/valuation-details`, []);
  });

  const conditions = [
    [UploadStatus.ANALYZED, 'Manual review pending', 'NOT'],
    [UploadStatus.APPROVED, 'Verified', 'NOT'],
    [UploadStatus.CANCELLED, 'Cancelled', 'NOT'],
    [UploadStatus.CLASSIFICATION_AMBIGUOUS, 'Pending', 'NOT'],
    [UploadStatus.CONSISTENCY_REJECTED, 'Manual review pending', 'NOT'],
    [UploadStatus.DEFERRED, 'On hold', 'NOT'],
    [UploadStatus.ERROR, 'Manual review pending', 'NOT'],
    [UploadStatus.MISCLASSIFIED, 'Manual review pending', 'NOT'],
    [UploadStatus.POLICY_APPROVED, 'Manual review pending', 'NOT'],
    [UploadStatus.POLICY_REJECTED, 'Manual review pending', 'NOT'],
    [UploadStatus.PROVISIONALLY_APPROVED, 'Provisionally approved', 'NOT'],
    [UploadStatus.RECEIVED, 'Received', 'NOT'],
    [UploadStatus.TO_BE_ANALYZED, 'Manual review pending', 'NOT'],
    [UploadStatus.TO_BE_CORRECTED, 'Manual review pending', 'NOT'],
    [UploadStatus.TO_BE_RECEIVED, 'Upload required', ''],
    [UploadStatus.TO_BE_REPLACED, 'Replacement document required', ''],
    [UploadStatus.UNKNOWN, 'Manual review pending', 'NOT'],
    [UploadStatus.VALID, 'Manual review pending', 'NOT'],
  ];

  const testCb = (status: UploadStatus, statusText: string, displayButton: string) => {
    const showUploadButton = displayButton !== 'NOT';
    cy.stubRequests(uploadDocumentsRejectedStubs);
    cy.wait('@getFmaSummary');
    cy.wait('@getValuationDetails');
    cy.wait('@getProgress');
    cy.findByText(/upload documents/i).click();
    cy.findByRole('row', { name: new RegExp(` ${status} `) }).findByRole('cell', { name: new RegExp(`^${statusText}$`, 'i') });
    cy.findByRole('row', { name: new RegExp(` ${status} `) })
      .findByRole('cell', { name: /^upload$/i })
      .should(`${showUploadButton ? '' : 'not.'}exist`);
  };

  it.each(conditions)(
    'should show the message "%1" and %2 show the upload button when the document status is %0',
    testCb as TestCallback<unknown>,
  );
});
