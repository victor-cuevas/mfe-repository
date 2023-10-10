import { GenericStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface StyledText {
  label?: string;
  class?: GenericStatus;
  upload?: boolean;
  uploadStatus?: GenericStatus;
}
