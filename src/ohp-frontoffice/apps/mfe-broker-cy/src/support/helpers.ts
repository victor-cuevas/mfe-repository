import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const extractAliases = (stubs: IStub[]): string[] => {
  return stubs.map(stub => `@${stub.alias}`);
};
