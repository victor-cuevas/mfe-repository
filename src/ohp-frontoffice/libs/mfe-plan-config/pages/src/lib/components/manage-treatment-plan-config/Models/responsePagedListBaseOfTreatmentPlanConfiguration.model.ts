import { treatmentPlanConfiguration } from "./treatmentPlanConfiguration.model";

export class responsePagedListBaseOfTreatmentPlanConfiguration {
  totalItemCount!: number;
  pageIndex!: number;
  items: treatmentPlanConfiguration[]=[];
}
