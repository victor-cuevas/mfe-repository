import { feeType } from "./feeType.model"
import { feeTypeList } from "./feeTypeList.model"
import { txElTypeConversionConfig } from "./txElTypeConversionConfig.model"

export class feeConfig {
  feeType!: feeType
  txElTypeConversionConfig!: txElTypeConversionConfig
  isLinkedToProduct!: boolean
  feeTypeList!: feeTypeList[]
}
