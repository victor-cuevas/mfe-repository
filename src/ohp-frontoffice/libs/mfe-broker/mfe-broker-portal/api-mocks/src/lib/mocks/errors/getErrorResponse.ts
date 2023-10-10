export const generateErrorResponse = (status: number, errorCode: string) => ({
  status,
  errorCode,
  detail: 'An unexpected exception occurred',
  title: 'Internal server error',
  traceId: 'Root=1-63ff83af-3de5985d7f2cecec2d427a20',
});
