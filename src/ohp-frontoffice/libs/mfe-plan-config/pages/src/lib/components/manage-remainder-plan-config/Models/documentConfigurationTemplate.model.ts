import { baseModel } from "./baseModel.model";
import { documentTemplate } from "./documentTemplate.model";

export class documentConfiguration extends baseModel {
  documentTemplate!: documentTemplate;
}
