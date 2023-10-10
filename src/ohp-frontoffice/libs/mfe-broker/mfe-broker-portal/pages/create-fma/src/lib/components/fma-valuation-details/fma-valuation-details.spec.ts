import { ComponentFixture } from '@angular/core/testing';
import { FmaValuationDetailsComponent } from './fma-valuation-details.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import { Dropdown, DropdownItem, DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';
import { CodeTablesService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { BrokerCodeTableOption } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import userEvent from '@testing-library/user-event';
import { NgxIntlTelInputComponent, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PhoneInputComponent } from '@close-front-office/mfe-broker/shared-ui';

const inputText200 =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';

const valuationDetails = {
  additionalInformationForValuer: null,
  applicantId: null,
  companyName: null,
  contactInformation: {
    email: 'a@atest.com',
    homePhone: '+34667310015',
    mobilePhone: '+34667310016',
    preferredContactMethod: 'WORK_PHONE',
    workPhone: '+34667310017',
  },
  contactName: null,
  valuationContact: null,
  valuationType: 'FREE_VALUATION',
  applicationDraftId: 755,
  versionNumber: 27,
};

const applicantDetails = [
  {
    key: 0,
    applicantName: 'John Doe',
    preferredContactMethod: 'WORK_PHONE',
    homePhone: '+34667310015',
    mobilePhone: '+34667310016',
    workPhone: '+346673100167',
    email: 'a@atest.com',
  },
];

const codeTables: { [key: string]: BrokerCodeTableOption[] } = {
  ['cdtb-valuationcontact']: [
    {
      value: 'APPLICANT_1',
      label: 'Applicant 1',
    },
    {
      value: 'APPLICANT_2',
      label: 'Applicant 2',
    },
    {
      value: 'ESTATE_AGENT',
      label: 'Estate agent',
    },
    {
      value: 'SELLER',
      label: 'Seller',
    },
  ],
  ['cdtb-broker-contactmethods']: [
    {
      value: 'PREFER_NO_CONTACT',
      label: 'Prefer no contact',
    },
    {
      value: 'EMAIL',
      label: 'Email',
    },
    {
      value: 'MOBILE_PHONE',
      label: 'Mobile phone',
    },
    {
      value: 'WORK_PHONE',
      label: 'Work phone',
    },
    {
      value: 'HOME_PHONE',
      label: 'Home phone',
    },
    {
      value: 'POSTAL_MAIL',
      label: 'Postal mail',
    },
  ],
};

async function setup(): Promise<ComponentFixture<FmaValuationDetailsComponent>> {
  const { fixture } = await render(FmaValuationDetailsComponent, {
    declarations: [Dropdown, DropdownItem, InputTextarea, NgxIntlTelInputComponent, PhoneInputComponent],
    imports: [
      NoopAnimationsModule,
      TranslateModule,
      ReactiveFormsModule,
      SharedTestingHelperModule,
      NgxIntlTelInputModule,
      DropdownModule,
      FormsModule,
      InputTextareaModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    removeAngularAttributes: true,
    componentProviders: [
      {
        provide: CodeTablesService,
        useValue: {
          getCodeTable(id: string) {
            return codeTables[id];
          },
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              valuationDetailsData: {
                applicantDetails,
                valuationDetails,
              },
            },
          },
        },
      },
    ],
  });
  return fixture;
}

describe('ValuationDetailsComponent', () => {
  test.skip('should render correctly', async () => {
    const fixture = await setup();
    expect(fixture).toBeTruthy();
  });

  test.skip('preferred phone method dropdown should be disabled for applicants', async () => {
    const fixture = await setup();
    const preferredPhoneDropdown = screen.getByLabelText(/createFma.labels.preferredContactPhone */);
    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    valuationContactDropdown.click();
    await userEvent.click(screen.getByText(/John Doe/));

    expect(fixture.componentInstance.valuationDetailsForm.controls.valuationContact?.value).toBe('APPLICANT_1');
    setTimeout(() => expect(preferredPhoneDropdown).toHaveProperty('disabled', true), 300);
  });

  test.skip('preferred phone method dropdown should be enabled in all other cases', async () => {
    const fixture = await setup();
    const preferredPhoneDropdown = screen.getByLabelText(/createFma.labels.preferredContactPhone */);
    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    valuationContactDropdown.click();
    await userEvent.click(screen.getByText(/Seller/));

    expect(fixture.componentInstance.valuationDetailsForm.controls.valuationContact?.value).toBe('SELLER');
    expect(preferredPhoneDropdown).toHaveProperty('disabled', false);
  });

  test.skip('should have three disabled phone input fields for applicants', async () => {
    await setup();
    const workPhoneInput = screen.getByLabelText(/createFma.labels.workPhone/);
    const homePhoneInput = screen.getByLabelText(/createFma.labels.homePhone/);
    const mobilePhoneInput = screen.getByLabelText(/createFma.labels.mobilePhone/);
    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    valuationContactDropdown.click();
    await userEvent.click(screen.getByText(/John Doe/));

    expect(workPhoneInput).toBeDisabled();
    expect(mobilePhoneInput).toBeDisabled();
    expect(homePhoneInput).toBeDisabled();
  });

  test.skip('should have enabled phone input fields for all other cases', async () => {
    await setup();
    const workPhoneInput = screen.getByLabelText(/createFma.labels.workPhone/);
    const homePhoneInput = screen.getByLabelText(/createFma.labels.homePhone/);
    const mobilePhoneInput = screen.getByLabelText(/createFma.labels.mobilePhone/);
    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    valuationContactDropdown.click();
    await userEvent.click(screen.getByText(/Seller/));

    expect(workPhoneInput).toBeEnabled();
    expect(mobilePhoneInput).toBeEnabled();
    expect(homePhoneInput).toBeEnabled();

    valuationContactDropdown.click();
    await userEvent.click(screen.getByText(/Estate agent/));

    expect(mobilePhoneInput).toBeEnabled();
    expect(workPhoneInput).toBeEnabled();
    expect(homePhoneInput).toBeEnabled();
  });

  test.skip('should have a disabled email input for applicants with a known email', async () => {
    await setup();

    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    await valuationContactDropdown.click();
    fireEvent.click(screen.getByText(/John Doe/));

    expect(screen.getByLabelText(/createFma.labels.email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/createFma.labels.email/)).toBeDisabled();
  });

  test.skip('should not have an email input for all other cases', async () => {
    await setup();
    const emailInput = document.getElementById('email');

    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    valuationContactDropdown.click();
    fireEvent.click(screen.getByText(/Seller/));

    expect(emailInput)?.not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Estate agent/));
    expect(emailInput).not.toBeInTheDocument();
  });

  test.skip('should have a title dropdown field for estate agent and seller', async () => {
    await setup();

    const titleDropdown = screen.getByLabelText(/intermediary.labels.title */);
    const valuationContactDropdown = screen.getByText(/createFma.placeholders.selectContact/);

    valuationContactDropdown.click();
    fireEvent.click(screen.getByText(/Seller/));

    expect(titleDropdown).toBeInTheDocument();

    valuationContactDropdown.click();
    fireEvent.click(screen.getByText(/Estate agent/));

    expect(titleDropdown).toBeInTheDocument();
  });

  test.skip('additional information field should allow max 180 characters', async () => {
    const fixture = await setup();

    const additionalInfoInput = screen.getByLabelText(/createFma.labels.additionalInfo/);

    await userEvent.type(additionalInfoInput, inputText200);

    expect(fixture.componentInstance.valuationDetailsForm.get('additionalInformationForValuer')?.value.length).toBe(180);
  });
});
