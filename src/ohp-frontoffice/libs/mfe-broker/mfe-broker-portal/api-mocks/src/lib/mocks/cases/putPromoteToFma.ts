import { LoanStateResponse, LoanStatus, Stage } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loan1, user1 } from '../../constants';

export const putPromoteToFmaResponse: LoanStateResponse = {
  changeDate: '2022-12-12T12:12:35.9959481+00:00',
  createdBy: user1.id,
  dossierNumber: '1',
  loanId: loan1.id,
  stage: Stage.Fma,
  status: LoanStatus.InProgress,
  rejectionReasons: [],
};
