import { baseModel } from "./baseModel.model"
import { referenceType } from "./referenceType.model"
import { referenceTypeUsage } from "./referenceTypeUsage.model"

export class defaultReferenceType extends baseModel {
  referenceType!: referenceType
  referenceTypeUsage!: referenceTypeUsage
  isEntered!: boolean;
}
