import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";

export class documentTemplate extends baseModel {
  adHoc!: boolean;
  batch!: boolean;
  documentTemplateType!: codeTable;
  docGenType!: codeTable;
  name!: string;
}
