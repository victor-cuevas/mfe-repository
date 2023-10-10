export interface FullMortage {
  id: number;
  caseRef: string;
  securityAddress: string;
  stage: string;
  applicants: Array<{
    applicant: string;
    employment: string;
    valuation: string;
    feeAmount: number;
    lenderAmount: number;
    payment: string;
    uploaddocs: string;
  }>;
}
