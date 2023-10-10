import { baseModel } from "./baseModel.model"
import { creditStatusList } from "./creditStatusList.model"
import { reminderScenarioRefList } from "./reminderScenarioRefList.model"

export class reminderScenario extends baseModel {
  creditStatus!: creditStatusList|null
  reminderScenario!: reminderScenarioRefList|null
  isDelete!: boolean;
}
