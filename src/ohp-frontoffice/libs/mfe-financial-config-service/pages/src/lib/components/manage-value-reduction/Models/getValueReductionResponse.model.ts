import { codeTable } from "./codeTable.model";
import { valueReduction } from "./valueReduction.model";


export class getValueReductionResponse {
  valueReductionPrincipleList: valueReduction[]=[];
  valueReductionCalculationBaseList: codeTable[]=[];
  periodBaseList: codeTable[]=[];
  state!: number;
}
