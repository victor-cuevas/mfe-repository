import { baseModel } from "./baseModel.model"
import { feeCalculationTypeList } from "./feeCalculationTypeList.model"
import { feeConfig } from "./feeConfig.model"

export class product2FeeConfigList extends baseModel{
  isIncludedInDueDateCalculation!: boolean
  isIncludedInOutstanding!: boolean
  feeAmount!: number|string|null
  feePercentage!: number|string|null
  feeCalculationType?: feeCalculationTypeList|null
  feeConfig?: feeConfig|null
  isFeeAmountVisible!: boolean
  isFeePercentageVisible!: boolean
  gridCheckDisable!: boolean
  isEntered!: boolean
  modifyFeePercentageAndAmount!: string |number
}
