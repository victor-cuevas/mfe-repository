
import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { valueReductionConfig } from "./valueReductionConfig.model";

export class valueReduction extends baseModel{
  name!: string;
  periodBase!: codeTable;
  valueReductionConfigs: valueReductionConfig[] = [];
  isEntered!: boolean

}
