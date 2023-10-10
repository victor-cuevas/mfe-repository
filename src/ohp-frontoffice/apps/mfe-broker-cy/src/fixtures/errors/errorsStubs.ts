import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { generateErrorResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

export const throwExceptionStub: (status: number, errorCode: string) => IStub = (status, errorCode) => {
  return {
    method: 'GET',
    endpoint: '/Exception/throw-exception',
    alias: 'throwException',
    stub: generateErrorResponse(status, errorCode),
    options: {
      statusCode: status,
    },
  };
};
