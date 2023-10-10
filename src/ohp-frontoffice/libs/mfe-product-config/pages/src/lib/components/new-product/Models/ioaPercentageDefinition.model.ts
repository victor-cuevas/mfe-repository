import { baseModel } from "./baseModel.model"
import { calculationMethod } from "./calculationMethod.model"
import { name1 } from "./name1.model"

export class ioaPercentageDefinition extends baseModel {
  name!: name1
  calculationMethod?: calculationMethod|null
}
