import { ValuationDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeFmaContact {
  key: number;
  applicantName?: string | null;
  preferredContactMethod?: string | null;
  mobilePhone?: string | null;
  workPhone?: string | null;
  homePhone?: string | null;
  email?: string | null;
}

export interface FeFmaValuationAndContact {
  valuationDetails?: ValuationDetailsResponse;
  applicantDetails?: FeFmaContact[];
}
