import { baseModel } from "./baseModel.model";
import { costPlanRef } from "./costPlanRef.model";
import { paymentAllocationPlanRef } from "./paymentAllocationPlanRef.model";
import { reminderPlanRef } from "./reminderPlanRef.model";
import { treatmentPlanRef } from "./treatmentPlanRef.model";

export class ruleEnginePlanDerivationCriterion extends baseModel {
  output!: string;
  treatmentPlan!: treatmentPlanRef;
  reminderPlan!: reminderPlanRef;
  costPlan!: costPlanRef;
  paymentAllocationPlan!: paymentAllocationPlanRef;
  isEntered!: boolean;
  isDelete!: boolean;
}
