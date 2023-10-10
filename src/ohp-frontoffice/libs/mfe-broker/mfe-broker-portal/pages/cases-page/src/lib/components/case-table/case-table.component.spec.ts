import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CaseTableComponent } from './case-table.component';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { CheckPermissionsService, getPortalUser } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { CaseService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { of } from 'rxjs';
import { mockCases } from '../../__mocks__/cases';
import { PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { render, screen } from '@testing-library/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { ColumnFilter, Table, TableBody, TableModule } from 'primeng/table';
import { FilterMenuComponent } from '@close-front-office/mfe-broker/shared-ui';
import { Calendar } from 'primeng/calendar';

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

const caseGetAllSpy = jest.fn().mockImplementation(() => of(mockCases));

async function setup() {
  await render(CaseTableComponent, {
    declarations: [TableBody, Table, FilterMenuComponent, Calendar, ColumnFilter],
    imports: [SharedTestingHelperModule, TableModule],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: getPortalUser,
            value: mockPortalUser,
          },
        ],
      }),
      DialogService,
      {
        provide: PERMISSIONS,
        useClass: CheckPermissionsService,
      },
      {
        provide: CaseService,
        useValue: {
          caseGetAll: caseGetAllSpy,
        },
      },
    ],
  });
}

describe('CaseTable', () => {
  describe('component setup', () => {
    describe('component', () => {
      it('should create', async () => {
        await setup();
      });
    });

    describe('table', () => {
      it('should call the casesService.casesGetAll', async () => {
        await setup();

        expect(caseGetAllSpy).toHaveBeenCalled();
      });

      it('should render all the cases in the table', async () => {
        await setup();

        const caseId = await screen.getByText(/APR09956997/);
        const allCases = await screen.getAllByRole('row');

        expect(caseId).toBeInTheDocument();
        expect(allCases.length).toBe(mockCases.length);
      });
    });
  });
});
