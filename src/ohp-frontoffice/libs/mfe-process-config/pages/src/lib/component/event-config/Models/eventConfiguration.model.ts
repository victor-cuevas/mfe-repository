
import { CodeTable } from "../../manage-followup-config/models/manage-followup.model"
import { baseModel } from "./baseModel.model"
import { followUpEventNameModel } from "./followUpEventName.model"
import { serviceActionName } from "./serviceActionName.model"

export class eventConfigModel extends baseModel {

  eventHandler!:string

  followUpEvent!: followUpEventNameModel

  serviceActionName!: serviceActionName

  integrationQueueConfigurationName!:string

  isEntered!: boolean

  modifiedEventHandler!: CodeTable

  isEnableServiceAction!: boolean
}
