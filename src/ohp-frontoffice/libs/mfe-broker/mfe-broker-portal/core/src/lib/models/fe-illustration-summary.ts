import { CaseDocument, IllustrationSummary } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeIllustrationSummary extends IllustrationSummary {
  esisDocument?: CaseDocument;
}
