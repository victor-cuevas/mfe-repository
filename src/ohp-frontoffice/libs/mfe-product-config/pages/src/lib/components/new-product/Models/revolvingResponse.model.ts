import { baseModel } from "./baseModel.model"
import { productRevolving } from "./productRevolving.model"

export class revolvingResponse extends baseModel {
  productRevolving!: productRevolving
  isSuccess!: boolean
  businessErrorMessage!: string
}
