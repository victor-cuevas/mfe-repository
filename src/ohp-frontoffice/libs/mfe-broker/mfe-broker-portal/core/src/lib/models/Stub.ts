export interface IStub {
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  endpoint: string;
  alias: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stub?: any;
  options?: {
    statusCode?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectedReqPayload?: any;
  };
}
