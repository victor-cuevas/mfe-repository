import { baseModel } from "./baseModel.model";

export class paymentAllocationPlanRef extends baseModel {
  name!: string;
  isActive!: boolean;
  planDerivationCriteriaPkey!: number;
}
