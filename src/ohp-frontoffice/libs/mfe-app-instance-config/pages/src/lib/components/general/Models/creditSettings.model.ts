import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";

export class creditSettings extends baseModel{
  rateRevisionPeriod!:number
  highestRevisionPeriodMethod!:codeTable
  highestRevisionPeriodMethodList: codeTable[]=[]

}
