import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";

export class reminderScenarioRef extends baseModel {
  scenarioName!: string;
  scenarioType!: codeTable;
}
