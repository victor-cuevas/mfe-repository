import { baseModel } from "./baseModel.model";

export class treatmentPlanRef extends baseModel {
  name!: string;
  isActive!: boolean;
  planDerivationCriteriaPkey!: number;
}
