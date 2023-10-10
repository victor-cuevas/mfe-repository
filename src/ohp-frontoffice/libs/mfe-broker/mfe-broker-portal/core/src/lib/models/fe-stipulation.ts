import { StipulationDocument } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeStipulation extends StipulationDocument {
  isUploading: boolean;
}
