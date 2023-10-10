import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";

export class documentTemplateRef extends baseModel {
  documentTemplateType!: codeTable;
  docGenType!: codeTable;
  name!: string;
}
