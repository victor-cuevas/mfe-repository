import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";

export class valueReductionConfig extends baseModel {
 
  dueElapsedPeriod!: number;
  factor!: number;
  name!: string;
  reduction!: number;
  valueReductionCalculationBase!: codeTable;
  isEntered!: boolean
  modifiedReduction!:string
}

