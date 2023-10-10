import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { documentConfiguration } from "./documentConfigurationTemplate.model";

export class reminderDocument extends baseModel {
  documentConfiguration!: documentConfiguration;
  documentTemplateBaseDocGenTypeList: codeTable[]=[];
}
