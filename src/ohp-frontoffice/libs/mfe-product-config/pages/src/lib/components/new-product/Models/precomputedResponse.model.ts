import { baseModel } from "./baseModel.model"
import { productPrecomputed } from "./productPrecomputed.model"

export class precomputedResponse extends baseModel {
  productPrecomputed!: productPrecomputed
  isSuccess!:boolean
  businessErrorMessage!:string
}
