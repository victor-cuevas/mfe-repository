import { baseModel } from "./baseModel.model"
import { productName } from "./productName.model"

export class product2ProductNameList extends baseModel {
  productName!: productName |null
  productNameList!: productName[]
  canDelete!: boolean
  isDelete!:boolean
  isRead!: boolean
  nameListDropdownDisable!:boolean
}
