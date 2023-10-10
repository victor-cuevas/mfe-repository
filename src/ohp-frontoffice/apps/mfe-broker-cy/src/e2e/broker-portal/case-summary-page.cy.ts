import {
  applicationDraft,
  case1,
  firm1,
  getDocumentsSummary,
  getIllustrationSummary,
  loan1,
  validCredentials,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  blockedPromoteIllustrationStubs,
  clickResumeDipStubs,
  clickResumeIllustrationStubs,
  clickViewIllustrationStubs,
  completeDipStubs,
  createIllustrationStubs,
  dipStageStubs,
  fmaStageStubs,
  illustrationStageStubs,
  onLoadAditionalStubs,
  onLoadStubs,
  promoteToFmaStubs,
  successPromoteIllustrationStubs,
} from '../../fixtures/cases/caseSummaryPage/caseSummaryStubs';

describe('Case summary page', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([...onLoadStubs, ...onLoadAditionalStubs]);
  });

  describe('NEW', () => {
    it('should display a blank case when the stage is "New"', () => {
      cy.stubRequests([
        {
          method: 'GET',
          endpoint: '/dipsummary$',
          alias: 'getDipSummary',
          stub: {},
          options: { statusCode: 204 },
        },
      ]);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, onLoadStubs);

      // displays the right stage and buttons
      cy.findByLabelText(/stage/i).should('contain.text', 'New');
      cy.findByRole('button', { name: /create dip/i });
      cy.findByRole('button', { name: /create illustration/i });

      // contains empty lists
      cy.findByText(/decision in principle/i).click();
      cy.findByText(/not have (.*) DIP/i);
      cy.findByText(/documents/i).click();
      cy.findByRole('tab', { name: /case documents/i }).should('have.attr', 'aria-selected', 'true');
      cy.findByText(/required documents/i).click();
      cy.findByRole('tab', { name: /required documents/i }).should('have.attr', 'aria-selected', 'true');
      cy.findByText(/illustrations/i).click();
      cy.findByText(/any illustration/i);

      // contains a Create Illustration button
      cy.stubRequests(createIllustrationStubs);

      cy.findByRole('button', { name: /create illustration/i }).click();

      cy.url().should('contain', `/illustration/${applicationDraft.id}/loan/${loan1.id}`);
    });
  });
  describe('Illustration', () => {
    it('should display the pending illustrations when the stage is "Illustration"', () => {
      cy.stubRequests(illustrationStageStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, illustrationStageStubs);

      // displays the right stage and buttons
      cy.findByLabelText(/stage/i).should('contain.text', 'Illustration');
      cy.findByRole('button', { name: /create dip/i });
      cy.findByRole('button', { name: /create illustration/i });

      // contains empty DIP list
      cy.findByText(/decision in principle/i).click();
      cy.findByText(/not have (.*) DIP/i);

      // contains a list of illustration documents
      const documentName = (getDocumentsSummary.caseDocuments && (getDocumentsSummary.caseDocuments[0]?.name as string)) ?? '';
      cy.findByText(/documents/i).click();
      cy.findByRole('row', { name: new RegExp(documentName, 'i') }).findByText(documentName);

      // contains empty required documents list
      cy.findByText(/required documents/i).click();
      cy.findByRole('tabpanel').findByRole('row').should('not.exist');

      // contains a list of illustrations
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [{ loanId: inProgressId }, { loanId: completedId }] = getIllustrationSummary.illustrationSummaries!;

      cy.findByRole('listitem', { name: new RegExp((inProgressId as number).toString(), 'i') }).findByRole('button', { name: /resume/i });
      cy.findByRole('listitem', { name: new RegExp((completedId as number).toString(), 'i') }).findByRole('button', { name: /view/i });
      cy.findByRole('listitem', { name: new RegExp((completedId as number).toString(), 'i') }).findByRole('button', { name: /promote/i });
    });

    it('should allow the user to resume an inProgress illustration', () => {
      cy.stubRequests(illustrationStageStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, illustrationStageStubs);

      // Click on the "resume" button
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [{ loanId: inProgressId }] = getIllustrationSummary.illustrationSummaries!;
      cy.stubRequests(clickResumeIllustrationStubs);

      cy.findByRole('listitem', { name: new RegExp((inProgressId as number).toString(), 'i') })
        .findByRole('button', { name: /resume/i })
        .click();

      cy.url().should('contain', `/illustration/${applicationDraft.id}/loan/${inProgressId}`);
    });

    it('should be able to view or promote a complete illustration to DIP', () => {
      cy.stubRequests(illustrationStageStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, illustrationStageStubs);

      // Click on the "resume" button
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [, { loanId: completedId }] = getIllustrationSummary.illustrationSummaries!;
      cy.stubRequests(clickViewIllustrationStubs);

      // View a complete illustration
      cy.findByRole('listitem', { name: new RegExp((completedId as number).toString(), 'i') })
        .findByRole('button', { name: /view/i })
        .click();

      cy.url().should('contain', `/illustration/${applicationDraft.id}/loan/${completedId}`);

      cy.findByRole('link', { name: /cancel/i }).click();
      cy.url().should('contain', `/broker/${firm1.id}/cases/${case1.id}`);

      cy.stubRequests(successPromoteIllustrationStubs);

      cy.wait('@getDocuments');
      cy.wait('@getStipulations');

      // promote a complete illustration
      cy.findByRole('listitem', { name: new RegExp((completedId as number).toString(), 'i') })
        .findByRole('button', { name: /promote/i })
        .click();
      cy.wait('@promoteIllustration');
      cy.wait('@getDipSummary');

      cy.findByText(/illustration successfully promoted to dip/i);
      cy.findByRole('button', { name: /resume dip/i });
    });

    it('should notify the user and block promoting illustration if the products are unavailable', () => {
      cy.stubRequests(illustrationStageStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, illustrationStageStubs);

      // Click on the "resume" button
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [, { loanId: completedId }] = getIllustrationSummary.illustrationSummaries!;
      cy.stubRequests(blockedPromoteIllustrationStubs);

      // View a complete illustration
      cy.findByRole('listitem', { name: new RegExp((completedId as number).toString(), 'i') })
        .findByRole('button', { name: /promote/i })
        .click();
      cy.wait('@promoteIllustration');

      cy.findByText('Product(s) invalid');
    });
  });

  describe('DIP', () => {
    it('should display the pending dip when the stage is "DIP"', () => {
      cy.stubRequests(dipStageStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, dipStageStubs);

      // displays DIP information
      const productCode = loan1.loanPartSummary[0].productCode ?? '';
      cy.findByRole('row', { name: new RegExp(productCode, 'i') });

      // should navigate to the DIP journey page
      cy.stubRequests(clickResumeDipStubs);
      cy.findByRole('button', { name: /resume dip/i }).click();
      cy.url().should('contain', '/dip/property-and-loan');
    });

    it.only('should be able to promote a complete DIP to FMA', () => {
      cy.stubRequests(completeDipStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, completeDipStubs);

      cy.findByLabelText(/stage/i)
        .findByText(/decision in principle/i)
        .findByText(/complete/i);

      cy.findByRole('button', { name: /view \/ edit dip/i });

      cy.stubRequests(promoteToFmaStubs);
      cy.findByRole('button', { name: /promote to fma/i }).click();
      cy.findByLabelText(/stage/i)
        .findByText(/full mortgage application/i)
        .findByText(/in progress/i);
    });
  });

  describe('stage "FMA"', () => {
    beforeEach(() => {
      cy.stubRequests(fmaStageStubs);
      cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, fmaStageStubs);
    });

    it('should display the right stage and status', () => {
      cy.findByLabelText(/stage/i)
        .findByText(/full mortgage application/i)
        .findByText(/in progress/i);
    });

    it('should display a "Resume FMA button when the case is in progress', () => {
      cy.findByRole('button', { name: /resume fma/i }).click();
      cy.url().should('contain', `/broker/${firm1.id}/cases/${case1.id}/fma/`);
    });
  });
});
