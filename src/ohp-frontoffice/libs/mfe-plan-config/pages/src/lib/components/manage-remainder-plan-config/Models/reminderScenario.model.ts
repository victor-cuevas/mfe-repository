import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { reminderScenarioStep } from "./reminderScenarioStep.model";

export class reminderScenario extends baseModel {
  scenarioName!: string;
  endDate!: string | null;
  minPeriodBetweenSteps!: number;
  reminderDaysPostDueDate!: number;
  scenarioType!: codeTable;
  startDate!: string | null;
  reminderScenarioPeriodBase!: codeTable;
  setDossierStatusBackToNormal!: boolean;
  reminderScenarioStepList: reminderScenarioStep[]=[];
  isLinkedToReminderPlan!: boolean;
}


