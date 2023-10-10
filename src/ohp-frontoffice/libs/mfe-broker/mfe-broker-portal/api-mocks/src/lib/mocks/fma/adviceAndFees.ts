import {
  AdviceAndFeesResponse,
  AdviceGiven,
  CostPaymentMethod,
  LenderFeeType,
  ValuationType,
  WhenPayable,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loan1, versionNumber } from '../../constants';

export const getFmaAdviceAndFees: AdviceAndFeesResponse = {
  adviceAccepted: true,
  adviceGiven: AdviceGiven.ADVISED,
  intermediaryFees: [
    {
      payableTo: 'ABC',
      refundableAmmount: null,
      whenPayable: WhenPayable.ON_COMPLETION,
      feeAmount: 200.0,
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
      name: ValuationType.BASIC_VALUATION,
      paymentMethod: CostPaymentMethod.DIRECT,
      valuationType: ValuationType.BASIC_VALUATION,
      feeAmount: 715.0,
    },
    {
      feeType: LenderFeeType.COMPLETION_FEE,
      name: LenderFeeType.COMPLETION_FEE,
      paymentMethod: CostPaymentMethod.DIRECT,
      valuationType: null,
      feeAmount: 995.0,
    },
  ],
  loanId: loan1.id,
  versionNumber,
};
