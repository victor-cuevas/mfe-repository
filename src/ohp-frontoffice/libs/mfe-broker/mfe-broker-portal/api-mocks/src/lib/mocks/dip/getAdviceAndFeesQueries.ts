import {
  AdviceAndFeesRequest,
  AdviceAndFeesResponse,
  AdviceGiven,
  CostPaymentMethod,
  LenderFeeType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loan1, versionNumber } from '../../constants';

export const adviceAndFees: AdviceAndFeesResponse = {
  adviceAccepted: null,
  adviceGiven: null,
  intermediaryFees: [],
  lenderFees: [
    {
      feeType: 'APPLICATION_FEE',
      paymentMethod: 'DIRECT',
      valuationType: null,
      feeAmount: 195.0,
    },
    {
      feeType: 'PRODUCT_FEE',
      paymentMethod: 'DIRECT',
      valuationType: null,
      feeAmount: 995.0,
    },
  ],
  loanId: loan1.id,
  versionNumber,
};

export const dipLtvAdviceAndFees: AdviceAndFeesResponse = {
  adviceAccepted: true,
  adviceGiven: AdviceGiven.ADVISED,
  intermediaryFees: [
    {
      feeAmount: 8000,
      whenPayable: 'ON_COMPLETION',
      payableTo: 'Brock McBroker',
    },
  ],
  lenderFees: [
    {
      feeType: LenderFeeType.APPLICATION_FEE,
      name: LenderFeeType.APPLICATION_FEE,
      paymentMethod: CostPaymentMethod.DIRECT,
      valuationType: null,
      feeAmount: 195.0,
    },
    {
      feeType: LenderFeeType.VALUATION_FEE,
      name: 'BASIC_VALUATION',
      paymentMethod: CostPaymentMethod.DIRECT,
      valuationType: null,
      feeAmount: 995.0,
    },
    {
      feeType: LenderFeeType.COMPLETION_FEE,
      name: 'APRILSTANDARD',
      paymentMethod: null,
      valuationType: null,
      feeAmount: 1000.0,
    },
  ],
  loanId: loan1.id,
  versionNumber,
};

export const putAdviceAndFees: AdviceAndFeesRequest = {
  versionNumber,
  adviceGiven: AdviceGiven.ADVISED,
  adviceAccepted: true,
  intermediaryFees: [
    {
      feeAmount: 8000,
      whenPayable: 'ON_COMPLETION',
      payableTo: 'Brock McBroker',
    },
  ],
  lenderFees: [
    {
      feeType: 'APPLICATION_FEE',
      name: null,
      feeAmount: 195,
      paymentMethod: 'DIRECT',
      valuationType: null,
    },
    {
      feeType: 'PRODUCT_FEE',
      name: null,
      feeAmount: 995,
      paymentMethod: 'DIRECT',
      valuationType: null,
    },
  ],
};
