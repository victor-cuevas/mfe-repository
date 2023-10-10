import { baseModel } from "./baseModel.model"
import { creditStatusList } from "./creditStatusList.model"
import { valueReductionPrinciple2 } from "./valueReductionPrinciple2.model"

export class valueReductionPrinciple extends baseModel {
  creditStatus!: creditStatusList|null
  valueReductionPrinciple!: valueReductionPrinciple2|null
  isDelete!: boolean;
}
