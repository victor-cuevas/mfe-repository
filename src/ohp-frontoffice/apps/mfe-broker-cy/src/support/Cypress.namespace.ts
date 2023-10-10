/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-namespace */

import { FormData, IInputDetails, IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { ICredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      fillForm(formData: FormData[]): void;

      isStepComplete(step: string, options?: { expectedCheck: boolean }): void;

      goToNextStep(): void;

      lg(msg: string): void;

      login(credentials: ICredentials): void;

      stubRequests(stubs: IStub[]): void;

      useCheckbox(details: IInputDetails<null>): void;

      useDateInput(details: IInputDetails<string>): void;

      useDropdown(details: IInputDetails<string | RegExp>): void;

      useInput(details: IInputDetails<string | number>): void;

      useRadio(details: IInputDetails<string | RegExp>): void;

      visitAndWaitRequests(url: string, aliases: string[] | IStub[]): void;
    }
  }
}
