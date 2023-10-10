import { baseModel } from "./baseModel.model";
import { rateAdaptationName } from "./rateAdaptationName.model";

export class ltvModification extends baseModel {
  rateAdaptationNameList!: rateAdaptationName
  isEntered!: boolean;
}
