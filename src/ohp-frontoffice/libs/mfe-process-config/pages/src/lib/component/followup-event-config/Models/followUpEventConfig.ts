import { baseModel } from "./baseModel.model"
import { eventdateType } from "./eventDateType"
import { followUpEventName } from "./followUpEventName"

export class followUpEventConfig extends baseModel {
  followUpEventName!: followUpEventName
  eventCreationDateType!: eventdateType
  eventHandlingDateType!: eventdateType
  canBeTriggeredManually!: boolean
  modifiedcanBeTriggeredManually!: string
  isEntered!: boolean
}
