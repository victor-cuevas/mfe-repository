import { baseModel } from "./baseModel.model";
import { rateAdaptationName } from "./rateAdaptationName.model";

export class interestMediation extends baseModel {
  rateAdaptationNameList!: rateAdaptationName
  isEntered!: boolean;
}
