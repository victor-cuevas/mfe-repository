import { baseModel } from "./baseModel.model";
import { reminderPlan2ReminderScenario } from "./reminderPlan2ReminderScenario.model";

export class reminderPlan extends baseModel {
  reminderPlan2ReminderScenarioList: reminderPlan2ReminderScenario[]=[];
  name!: string;
}
