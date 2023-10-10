import { FirmDetailsModel } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const getFirmResponse: FirmDetailsModel = {
  firmId: 'MockFirm',
  firmType: 'DirectlyAuthorized',
  firmName: 'Mock Firm',
  fcaReference: 12345,
  email: 'aaa@aaa.com',
  telephone: { mobile: '666666' },
  complaintsWebpage: 'aaa.com',
  isActive: true,
  isInReview: true,
  sendCaseToEmail: false,
  firmAddressId: '014818fd',
  tradingAddressIds: ['170ba5d7', '4fd0836b', '6f8513a2', '714fcc11', 'cac0e5a0', 'e18e65c2', 'e470f505'],
  version: 19,
};
