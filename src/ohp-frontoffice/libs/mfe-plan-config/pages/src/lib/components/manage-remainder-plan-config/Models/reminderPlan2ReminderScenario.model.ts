import { reminderScenarioRef } from "../../manage-treatment-plan-config/Models/reminderScenarioRef.model";
import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { reminderScenario } from "./reminderScenario.model";

export class reminderPlan2ReminderScenario extends baseModel {
  reminderScenario!: reminderScenario;
  reminderScenarioRef!: reminderScenarioRef;
  dossierStatus!: codeTable;
  isDelete!:boolean
}
