import { baseModel } from "./baseModel.model"
import { scenarioType } from "./scenarioType.model"

export class reminderScenarioRefList extends baseModel {
  scenarioName!: string
  scenarioType!: scenarioType
  canHide!:boolean
}
