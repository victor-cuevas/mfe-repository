import { GetStipulationDocumentsResponse, StipulationDocument, UploadStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const createFmaStipulations = (
  statusList: UploadStatus[] = [UploadStatus.RECEIVED],
  rejectionReasons?: string[],
): GetStipulationDocumentsResponse => {
  const stipulations = statusList.map<StipulationDocument>((status, index) => {
    return {
      stipulationId: `stipulation-${index}`,
      rejectionReasons,
      documentName: `Document-${index}`,
      status,
      date: '2023-01-01T00:00:00Z',
      stipulationType: 'CurrentIncome',
      stipulationDescription: `Document with status: ${status}`,
    };
  });
  return {
    stipulations,
  };
};
