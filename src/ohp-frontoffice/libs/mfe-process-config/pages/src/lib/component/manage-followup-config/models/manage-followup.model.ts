export class DtoBase {
  pKey!: number;
  rowVersion!: number
  state!: DtoState
  canValidate!: boolean
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class CodeTable {
  codeId!: number
  enumCaption!:string
  caption?: string
}
export class FollowUpConfigScreenDto {
  state!: DtoState;
  flowNameList!: FlowNameDto[];
  followupEventNameList!: FollowupEventNameDto[];
  creditStatusList!: CodeTable[]
  actionFunctionalityList!: CodeTable[]
  actionReceiverTypeNameList!: CodeTable[]
  actionTypeList!: CodeTable[]
  scenarioTypeList!: CodeTable[]
  reminderScenarioPeriodBaseList!: CodeTable[]
  priorityList!: CodeTable[]
  serviceActionList!: ServiceActionNameDto[]
  roleTypeList!: CodeTable[]
  elapsedPeriodTypeList!: ElapsedPeriodTypeDto[]
  followUpCaseStatusList!: FollowUpCaseStatusDto[]
  messageTypeList!: MessageTypeDto[]
  eventDateTypeList!: EventDateTypeDto[]
  communicationMediumList!: CommunicationMediumDto[]
  intervalMeasureList!: CodeTable[]
  adminRoleTypeList!: CodeTable[]
  collectionsRoleTypeList!: CodeTable[]
  documentTemplateList!: DocumentTemplatesDto[]
  actionList!: ActionDto[]
  constructionDepotRoleTypeList!: CodeTable[]
}

export class ResponseListBaseOfFollowUpProcedureDto {
  items: FollowUpProcedureDto[]=[]
  totalItemCount!: number
  pageIndex!: number
}

export class FollowUpProcedureDto extends DtoBase {
  isSelected!: boolean;
  flowName!:string
  startTriggerEvent!: FollowUpEventNameDto
  processContext!: number
  stopTriggerEvent!: FollowUpEventNameDto
  followUpStepList: FollowUpStepDto[]=[]
  followUpProcedure2StopEventList: FollowUpProcedure2StopEventDto[] = []
  isLastEdited!: boolean;
}

export class FollowUpSearchCriteriaDto {
  state!: DtoState
  pageIndex!: number
  pageSize!: number
  sortMode!: string| null
  sortColumn!: string | null
  canValidate!: boolean
  enableSearch!: boolean
  flowName: FlowNameDto = new FlowNameDto
}

export class FollowUpStepDto extends DtoBase{
  isStepSelected!: boolean
  changeStatus!: boolean
  elapsedPeriodFromEvent!: number
  elapsedPeriodFromPreviousStep!: number
  name!:string
  seqNr!: number
  triggerEvent!: FollowupEventNameDto
  actionList: FollowUpStepActionDto[]=[]
  messageList: MessageDto[]=[]
  deletedMessageList!: MessageDto[]
  stateStep: StateStepDto = new StateStepDto 
  elapsedPeriodType!: ElapsedPeriodTypeDto
  serviceActionList: ServiceActionDto[]=[]
  handlingDateType!: EventDateTypeDto
  elapsedPeriod!: number
  intervalMeasure!: CodeTable
  followUpStepEventList: FollowUpStepEventDto[] = []
  enableTargetState!: boolean;
}

export class FollowUpStepActionDto extends DtoBase{
  action!: ActionDto;
  isDeleted!: boolean
}

export class MessageDto extends DtoBase {
  messageType!: number
  communication: CommunicationsDto = new CommunicationsDto
  isDeleted!:boolean
}

export class CommunicationsDto extends DtoBase {
  communicationMedium!: CodeTable
  registeredLetter!: boolean
  onlySendAfterPeriod!: boolean
  periodToVerify!: number
  hasCost!: boolean
  hasPageCost!: boolean
  documentTemplate!: DocumentTemplatesDto
  fallbackMechanism!: FallbackMechanismDto
  roleType!: CodeTable
  adminRoleType!: CodeTable
  collectionsRoleType!: CodeTable
  constructionDepotRoleType!: CodeTable
}

export class FallbackMechanismDto extends DtoBase {
  name!: string
}

export class StateStepDto extends DtoBase {
  targetStateStatusName: FollowUpCaseStatusDto = new FollowUpCaseStatusDto
}

export class ServiceActionDto extends DtoBase {
  isBlocking!: boolean
  actionName!: string
  serviceAction!: ServiceActionNameDto
  isDeleted!: boolean
}

export class FollowUpStepEventDto extends DtoBase {
  event !: FollowUpEventNameDto
  isDeleted!: boolean
}

export class FollowUpProcedure2StopEventDto extends DtoBase {
  stopTriggerEvent !: FollowUpEventNameDto
  followupEventNameList: FollowupEventNameDto[] = []
  isDeleted!: boolean;
  isReadOnly!: boolean;
}

export class FollowUpEventNameDto extends CodeTable{

}

export class DocumentTemplatesDto extends DtoBase {
  adHoc!: boolean
  batch!: boolean
  documentTemplateType!: CodeTable
  docGenType!: CodeTable
  name!: string
}

export class ActionDto extends DtoBase {
  nameEN!: string;
  nameFR!: string;
  nameNL!: string;
  actionReceiverTypeName!: CodeTable
  actionType!: CodeTable
  actionMessage!: string;
  defaultHandleMargin!: number
  descriptionEN!: string;
  descriptionFR!: string;
  descriptionNL!: string;
  defaultHandleTimeDays!: number
  defaultHandleTimeHours!: number
  defaultHandleTimeMinutes!: number
  defaultName!: string;
  defaultHandlePeriod!: string;
  actionCode!: string;
  name!: string;
  calculatedDeadlineDate!: Date
}

export class FlowNameDto {
  state!: DtoState
  name!: string | null
}

export class FollowupEventNameDto extends CodeTable {

}

export class ServiceActionNameDto extends CodeTable {

}

export class ElapsedPeriodTypeDto extends CodeTable {

}

export class FollowUpCaseStatusDto extends CodeTable {

}

export class MessageTypeDto extends CodeTable {

}

export class EventDateTypeDto extends CodeTable {

}

export class CommunicationMediumDto extends CodeTable {

}
