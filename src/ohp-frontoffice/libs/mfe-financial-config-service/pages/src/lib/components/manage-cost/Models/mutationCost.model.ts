import { baseModel } from "./baseModel.model";
import { creditProviderRef } from "./creditProvider.model";
import { mutationType } from "./mutationType.model";


export class mutationCost extends baseModel {
  creditProvider!: creditProviderRef;
  mutationType!: mutationType;
  amount!: number;
  startDate!: Date;
  isEntered!: boolean
  modifiedDate!: string | null
  modifiedAmount!:string
}
