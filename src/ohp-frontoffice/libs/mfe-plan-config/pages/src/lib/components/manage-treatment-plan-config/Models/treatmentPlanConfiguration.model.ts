import { planDerivationCriteria } from "./planDerivationCriteria.model";
import { stateModel } from "./state.model";
import { treatmentPlan } from "./treatmentPlan.model";


export class treatmentPlanConfiguration {
  planDerivationCriteria!: planDerivationCriteria;
  treatmentPlan!: treatmentPlan;
  state!: stateModel;
  isEntered!: boolean;
  isLegalDisable!: boolean;
  isCustomerDisable!: boolean;
  isInitiatorDisable!: boolean;
  validFromDisable!: boolean
  validToDisable!: boolean
}
