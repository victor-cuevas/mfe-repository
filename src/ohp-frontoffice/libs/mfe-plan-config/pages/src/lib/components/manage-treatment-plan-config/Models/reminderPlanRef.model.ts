import { baseModel } from "./baseModel.model";

export class reminderPlanRef extends baseModel {
  name!: string;
  isActive!: boolean;
  planDerivationCriteriaPkey!: number;
}
