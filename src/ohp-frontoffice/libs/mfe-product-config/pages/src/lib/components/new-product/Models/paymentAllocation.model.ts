import { baseModel } from "./baseModel.model"
import { creditStatusList } from "./creditStatusList.model"
import { paymentAllocationRefList } from "./paymentAllocationRefList.model"

export class paymentAllocation extends baseModel {
  creditStatus!: creditStatusList | null
  paymentAllocation!: paymentAllocationRefList|null
  isDelete!: boolean;
}
