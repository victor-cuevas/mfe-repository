
import { actualizationTypeList } from "./actualizationTypeList.model";
import { limitReductionPeriodicity } from "./limitReductionPeriodicity.model";
import { product } from "./product.model";
import { reductionOfLimitBorrowerTypeList } from "./reductionOfLimitBorrowerTypeList.model";
import { revolvingDueDateCalculationList } from "./revolvingDueDateCalculationList.model";

export class productRevolving extends product{
  payPercOfLimitDefault!: number;
  payPercOfLimitMax!: number;
  payPercOfLimitMin!: number;
  reductionOfLimitAge!: number|null;
  reductionOfLimitPeriods!: number|null;
  reductionOfLimitBorrowerType!: reductionOfLimitBorrowerTypeList |null;
  reductionOfLimitBlockPayment!: boolean;
  reductionOfLimitModifyRepaymentPerc!: boolean;
  revolvingDueDateCalculation!: revolvingDueDateCalculationList;
  nrOfMonthsBeforeLimitReductionStart!: number|null;
  isLimitReductionApplicable!: boolean;
  limitReductionPeriodicity!: limitReductionPeriodicity|null;
  actualizationType!: actualizationTypeList;
}

