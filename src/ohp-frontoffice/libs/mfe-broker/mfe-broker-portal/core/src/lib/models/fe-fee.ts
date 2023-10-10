import { IntermediaryFee, LenderFee } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeFee extends IntermediaryFee, LenderFee {
  feFeeType?: string;
}
