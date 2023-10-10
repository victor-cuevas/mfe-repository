import { baseModel } from "./baseModel.model";
import { creditProviderRef } from "./creditProvider.model";
import { productRef } from "./productRef.model";


export class reminderCost extends baseModel {
  creditProvider!: creditProviderRef;
  productNr!: number | null;
  product!: productRef;
  amount!: number;
  startDate!: Date;
  isEntered!: boolean
  modifiedDate!: string | null
  modifiedAmount!: string

}
