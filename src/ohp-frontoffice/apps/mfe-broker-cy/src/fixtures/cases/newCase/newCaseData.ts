import { faker } from '@faker-js/faker';

import { validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

export const newCaseData = {
  owner: validCredentials.username,
  casePurposeType: {
    matcher: /application type/i,
    value: 'Purchase',
  },
  tac: [/statements/i, /applicant's permission/i, /consent to use of data/i, /agree to T&C/i],
  applicantType: {
    matcher: /applicant type/i,
    value: 'First time buyer',
  },
  applicant: {
    name: {
      matcher: /first name/i,
      value: faker.name.firstName(),
    },
    surname: {
      matcher: /surname/i,
      value: faker.name.lastName(),
    },
    dateOfBirth: {
      matcher: /date of birth/i,
      value: faker.date.birthdate({ min: 18, max: 40, mode: 'age' }).toLocaleDateString('es'),
    },
  },
};
