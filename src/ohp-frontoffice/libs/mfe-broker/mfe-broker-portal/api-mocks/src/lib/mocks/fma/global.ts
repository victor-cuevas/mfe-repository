import { LoanProgressResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicationDraft, versionNumber } from '../../constants';

export const getFmaProgress = (steps: string[]): LoanProgressResponse => {
  const progress: LoanProgressResponse['progress'] = steps.reduce(
    (obj: LoanProgressResponse['progress'], step: string) => ({ ...obj, [step]: 'VALID' }),
    {},
  );

  return { progress, applicationDraftId: applicationDraft.id, versionNumber };
};
