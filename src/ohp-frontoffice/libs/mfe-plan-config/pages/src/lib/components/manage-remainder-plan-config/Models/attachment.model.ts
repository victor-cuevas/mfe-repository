import { baseModel } from "./baseModel.model";
import { documentTemplateRef } from "./documentTemplateRef.model";

export class attachment extends baseModel {
  documentTemplate!: documentTemplateRef;
}
