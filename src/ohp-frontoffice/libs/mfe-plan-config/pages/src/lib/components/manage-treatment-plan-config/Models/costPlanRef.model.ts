import { baseModel } from "./baseModel.model";

export class costPlanRef extends baseModel {
  name!: string;
  isActive!: boolean;
  planDerivationCriteriaPkey!: number;
}
