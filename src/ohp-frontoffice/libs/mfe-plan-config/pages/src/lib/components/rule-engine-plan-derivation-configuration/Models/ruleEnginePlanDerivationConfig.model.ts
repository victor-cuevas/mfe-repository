import { baseModel } from "./baseModel.model";
import { ruleEnginePlanDerivationCriterion } from "./ruleEnginePlanDerivationCriterion.model";

export class ruleEnginePlanDerivationConfig extends baseModel {
  ruleModelName!: string;
  ruleEnginePlanDerivationCriterionList: ruleEnginePlanDerivationCriterion[] = [];
  isEntered!: boolean;
}
