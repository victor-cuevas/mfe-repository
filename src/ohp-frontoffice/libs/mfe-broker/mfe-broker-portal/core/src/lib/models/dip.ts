export interface Dip {
  id: number;
  caseRef: string;
  decision: string;
  stage: string;
  certificate: string;
  dips: Array<{
    loanAmount: number;
    applicants: Array<{ name: string }>;
    employmentStatus: Array<{ status: string }>;
    netMonthlyIncome: Array<{ income: number }>;
    product: Array<{ title: string }>;
    term: Array<{ length: string }>;
    type: Array<{ description: string }>;
  }>;
}
