import { LoanProduct2 } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const products: LoanProduct2[] = [
  {
    baseProductCode: 'product',
    productCode: '1',
    productName: 'productname1',
    initialRate: 1,
    termYear: 10,
    productFee: 5,
    earlyRepaymentCharges: [],
    aprc: 1,
    features: ['1'],
    monthlyPayment: 800,
    freeTariffCriterionTypeCdList: [],
    productDetails: {
      prepaymentPenaltyMethod: 'Cash',
    },
  },
  {
    baseProductCode: 'product',
    productCode: '2',
    productName: 'productname2',
    initialRate: 2,
    termYear: 15,
    productFee: 3,
    earlyRepaymentCharges: [],
    aprc: 2,
    features: ['9'],
    monthlyPayment: 950,
    freeTariffCriterionTypeCdList: [],
    productDetails: {
      prepaymentPenaltyMethod: 'Cash',
    },
  },
];
