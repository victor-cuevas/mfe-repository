import { CreateCaseStepComponent } from './create-case-step.component';
import { render, screen } from '@testing-library/angular';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CodeTablesService, getPortalUser } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { BrokerCodeTableOption } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Dropdown, DropdownItem, DropdownModule } from 'primeng/dropdown';
import { provideMockStore } from '@ngrx/store/testing';
import { ComponentFixture } from '@angular/core/testing';
import userEvent from '@testing-library/user-event';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

const mockPortalUser = {
  agreeToTermsAndConditions: true,
  firmId: 'AB1',
  firmName: 'Firm',
  firstName: 'Test',
  intermediaryId: 'asjkdhkjsad-sdalskdjlaskd',
  lastName: 'Tester',
  permission: {
    assistants: ['others', 'support', 'me'],
    case: ['assignee', 'transferAssignee', 'viewer'],
    illustration: ['assignee', 'viewer'],
    dip: ['assignee', 'viewer'],
    fma: ['assignee', 'viewer'],
    switcher: ['firm'],
  },
  profilePicture: null,
  role: 'SupervisorAndAdvisor',
  roleMappings: [],
  subordinateIntermediaries: [],
  title: 'MR',
  userType: 'Intermediary',
};

const codeTables: { [key: string]: BrokerCodeTableOption[] } = {
  ['cdtb-broker-applicationtypes']: [
    { value: 'PURCHASE', label: 'Purchase' },
    {
      value: 'REMORTGAGE',
      label: 'Remortgage',
    },
  ],
  ['cdtb-broker-propertypurpose']: [{ value: 'OWNER_OCCUPATION', label: 'Owner occupation' }],
};

async function setup(): Promise<ComponentFixture<CreateCaseStepComponent>> {
  const { fixture } = await render(CreateCaseStepComponent, {
    declarations: [Dropdown, DropdownItem, Checkbox],
    imports: [ReactiveFormsModule, SharedTestingHelperModule, DropdownModule, FormsModule, CheckboxModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: getPortalUser,
            value: mockPortalUser,
          },
        ],
      }),
      {
        provide: CodeTablesService,
        useValue: {
          getCodeTable(id: string) {
            return codeTables[id];
          },
        },
      },
    ],
  });

  return fixture;
}

describe('CreateCaseStepComponent', () => {
  describe('Component', () => {
    it('should create', async () => {
      await setup();
    });
  });

  describe('Conditions', () => {
    it('should show correctly for PURCHASE cases', async () => {
      await setup();
      const applicationType = await screen.getByText(/createCase.placeholders.selectApplicationType/);

      await userEvent.click(applicationType);
      await userEvent.click(screen.getByText(/Purchase/));

      Object.values(CONFIGURATION_MOCK.CONDITIONS.PURCHASE).forEach(killerQuestion => expect(screen.getByText(killerQuestion)));
    });

    it('should show correctly for REMORTGAGE cases', async () => {
      await setup();
      const applicationType = await screen.getByText(/createCase.placeholders.selectApplicationType/);

      await userEvent.click(applicationType);
      await userEvent.click(screen.getByText(/Remortgage/));

      Object.values(CONFIGURATION_MOCK.CONDITIONS.REMORTGAGE).forEach(killerQuestion => expect(screen.getByText(killerQuestion)));
    });
  });

  describe('Form', () => {
    it('should complete', async () => {
      const fixture = await setup();

      const applicationType = await screen.getByText(/createCase.placeholders.selectApplicationType/);

      await userEvent.click(applicationType);
      await userEvent.click(screen.getByText(/Purchase/));

      await userEvent.click(screen.getByLabelText(CONFIGURATION_MOCK.CONDITIONS.STATEMENTS_CONFIRMATION + ' *'));
      await userEvent.click(screen.getByLabelText(CONFIGURATION_MOCK.CONDITIONS.PERMISSIONS_CONFIRMATION + ' *'));
      await userEvent.click(screen.getByLabelText(CONFIGURATION_MOCK.CONDITIONS.TERMS_AND_CONDITIONS + ' *'));
      await userEvent.click(screen.getByLabelText(CONFIGURATION_MOCK.CONDITIONS.DATA_CONSENT + ' *'));

      const componentFormValues = fixture.componentInstance.createCaseForm.getRawValue();
      expect(componentFormValues.casePurposeType).toBe('PURCHASE');
      expect(componentFormValues.killerQuestions.permissionCheck).toBe(true);
      expect(componentFormValues.killerQuestions.dataConsent).toBe(true);
      expect(componentFormValues.killerQuestions.termsAndConditions).toBe(true);
      expect(componentFormValues.killerQuestions.statementsCorrect).toBe(true);

      expect(fixture.componentInstance.createCaseForm.status).toBe('VALID');
    });
  });
});
