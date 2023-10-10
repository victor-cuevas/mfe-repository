import { product } from "./product.model"
import { productCodeTables } from "./productCodeTables.model"

export class responseProduct {
  state!: number
  productDto!: product
  productCodeTables!: productCodeTables
  useAPC!: boolean
}
