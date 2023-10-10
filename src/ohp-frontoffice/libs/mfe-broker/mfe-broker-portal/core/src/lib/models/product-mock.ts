export interface ProductMock {
  id: string;
  initialRate: number;
  productFee: number;
  monthlyPayment: number;
  earlyRepaymentCharge: { interest: number; until: string }[];
  annualPercentageRateOfCharge: number;
  repaymentType: string;
  interestRateType: string;
  term: number;
  features: string[];
}
