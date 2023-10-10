import { faker } from '@faker-js/faker';
import { ICredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { createGetMeResponse } from './getMeResponse';

const defaultPassword = 'Test123!';

export const validCredentials: ICredentials = {
  email: 'qaa+super_adv@project.com',
  password: defaultPassword,
  username: 'Advsuperv Qaa',
  getMe: createGetMeResponse('Advsuperv', 'Qaa', 'SupervisorAndAdvisor'),
};

export const invalidCredentials: ICredentials = {
  email: faker.internet.email(),
  password: faker.internet.password(12),
  username: faker.name.findName(),
  getMe: createGetMeResponse('Advsuperv', 'Qaa', 'SupervisorAndAdvisor'),
};

export const panelCredentials: ICredentials = {
  email: 'tester+lender_admin@project.com',
  password: defaultPassword,
  username: 'Lenderadmin Tester',
  getMe: createGetMeResponse('Lenderadmin', 'Tester', 'LenderAdvisorAdmin'),
};
