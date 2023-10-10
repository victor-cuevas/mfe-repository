import { RetirementIncomeDetail } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeRetirementIncomeDetail extends RetirementIncomeDetail {
  isRetired?: boolean | null;
}
