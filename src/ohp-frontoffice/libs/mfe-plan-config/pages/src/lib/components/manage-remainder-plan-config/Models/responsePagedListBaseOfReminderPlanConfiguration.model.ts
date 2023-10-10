import { reminderPlanConfiguration } from "./reminderPlanConfiguration.model";

export class responsePagedListBaseOfReminderPlanConfiguration  {
  totalItemCount!: number;
  pageIndex!: number;
  items: reminderPlanConfiguration[]=[];
}
