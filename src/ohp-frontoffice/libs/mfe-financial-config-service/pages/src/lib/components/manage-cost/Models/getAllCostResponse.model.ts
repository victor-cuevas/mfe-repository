import { codeTable } from "./codeTable.model";
import { creditProviderRef } from "./creditProvider.model";
import { mutationCost } from "./mutationCost.model";
import { mutationType } from "./mutationType.model";
import { postageCost } from "./postageCost.model";
import { productRef } from "./productRef.model";
import { reminderCost } from "./remainderCost.model";



export class getAllCostResponse {
  reminderCostList: reminderCost[]=[];
  postageCostList: postageCost[]=[];
  mutationCostList: mutationCost[]=[];
  creditProviderList: creditProviderRef[]=[];
  mutationTypeList: mutationType[]=[];
  countryList: codeTable[]=[];
  productList: productRef[]=[];
  financialTreatmentDate!: string;
  currentDate!: string;
  state!: number;
}
