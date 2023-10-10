import { amortizationRecalculationTypeList } from "./amortizationRecalculationTypeList.model";
import { dueTransferMethod } from "./dueTransferMethod.model";
import { highestRevisionPeriodMethod } from "./highestRevisionPeriodMethod.model";
import { mutationTypeConfig } from "./mutationTypeConfig.model";
import { prePaymentCalculation } from "./prePaymentCalculation.model";
import { prepaymentPenaltyMethodList } from "./prepaymentPenaltyMethodList.model";
import { product } from "./product.model";
import { reservationCommission } from "./reservationCommission.model";

export class productPrecomputed extends product {
  durationMaxInMonths!: number;
  durationMinInMonths!: number;
  prepaymentCalculation!: prePaymentCalculation;
  highestRevisionPeriodMethod!: highestRevisionPeriodMethod
  dueTransferMethod!: dueTransferMethod
  reservationCommissionList: reservationCommission[]=[];
  prepaymentPenaltyMethod!: prepaymentPenaltyMethodList;
  prepaymentPenaltyExemptionPercentage!: number;
  rewithdrawable!: boolean;
  capitalizeInterestAllowed!: boolean;
  penaltyFreePeriodBeforeRevisionDateInMonths!: number;
  penaltyFreePeriodAfterRevisionDateInMonths!: number;
  mutationTypeConfigList: mutationTypeConfig[]=[];
  blockSTPPrepayment!: boolean;
  amortizationRecalculationType!: amortizationRecalculationTypeList;
  prepaymentPenaltyPercentage!: number |null;
}

