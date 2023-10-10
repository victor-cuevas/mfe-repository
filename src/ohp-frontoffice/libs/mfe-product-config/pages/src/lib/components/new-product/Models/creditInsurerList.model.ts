import { baseModel } from "./baseModel.model"
import { name1 } from "./name1.model"

export class creditInsurerList extends baseModel{
  name!: name1
  nbbCode!: string
  ibanAccount!: string
  ibanAccountOut!: string
  domesticAccount!: string
  sortCode!: string
}
