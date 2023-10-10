import { planDerivationCriteria } from "./planDerivationCriteria.model";
import { reminderPlan } from "./reminderPlan.model";
import { stateModel } from "./state.model";

export class reminderPlanConfiguration {
  planDerivationCriteria!: planDerivationCriteria;
  reminderPlan!: reminderPlan;
  state!: stateModel;
  isEntered!: boolean;
  validFromDisable!: boolean;
  validToDisable!: boolean;
  isLegalDisable!: boolean;
  isCustomerDisable!: boolean;
  isInitiatorDisable!: boolean;
}
