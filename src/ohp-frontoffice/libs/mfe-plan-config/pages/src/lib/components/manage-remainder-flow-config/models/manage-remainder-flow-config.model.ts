export class DtoBase {
  pKey!: number;
  rowVersion!: number;
  canValidate!: boolean
  state!: DtoState;
}

export class RefClassBaseDto {
  pKey!: number
  rowVersion!: number
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class CodeTable {
  codeId!: number;
  enumCaption!: string | null;
  caption!: string;
  extRefCode!: string
  seqNo!: number
  defaultCaption!: string
}

export class ReminderFlowConfigScreenDto {
  flowNameList!: FlowNameDto[]
  flowTypeList!: CodeTable[]
  followupEventNameList!: CodeTable[]
  dossierStatusList!: CodeTable[]
  actionFunctionalityList!: CodeTable[]
  actionReceiverTypeNameList!: CodeTable[]
  actionTypeList!: CodeTable[]
  communicationMediumList!: CodeTable[]
  communicationReceiverList!: CodeTable[]
  documentTemplateList!: DocumentTemplateRefDto[]
  communicationMedium2DocumentTemplateList!: CommunicationMedium2DocumentTemplateDto[]
  scenarioTypeList!: CodeTable[]
  reminderScenarioPeriodBaseList!: CodeTable[]
  elapsedPeriodTypeList!: CodeTable[]
  docGenTypeList!: CodeTable[]
  closeDocGenTypeList!: CloseDocGenTypeDto[]
  receiverTypeList!: CodeTable[]
  addressTypeList!: CodeTable[]
  priorityList!: CodeTable[]
  roleTypeList!: CodeTable[]
  followUpCaseStatusList!: CodeTable[]
  fallbackMechanismList!: FallbackMechanismDto[]
  referenceTypeList!: ReferenceTypeDto[]
  documentTemplateTypeList!: CodeTable[]
  possibleAttachmentList!: DocumentTemplateRefDto[]
  eventDateTypeList!: CodeTable[]
  intervalMeasureList!: CodeTable[]
  serviceActionNameList!: CodeTable[]
  state!: DtoState
}

export class ResponsePagedListBaseOfReminderScenarioDto {
  totalItemCount!: number
  pageIndex!: number
  items!: ReminderScenarioDto[]
}

export class ReminderScenarioDto extends DtoBase {
  scenarioName!: string
  endDate?: Date
  minPeriodBetweenSteps!: string
  reminderDaysPostDueDate!: string
  scenarioType!: CodeTable
  startDate?: Date
  reminderScenarioPeriodBase!: CodeTable
  setDossierStatusBackToNormal!: boolean
  reminderScenarioStepList: ReminderScenarioStepDto[]=[]
  isLinkedToReminderPlan!: boolean
  isSelected!: boolean
  isLastEdited!: boolean
  canDeleteEnable!: boolean
  flowType!: CodeTable
}

export class ReminderScenarioStepDto extends DtoBase{
  elapsedPeriodFromBeforeStep!: number
  elapsedPeriodFromStatus!: number
  notes!: string
  numberOfDueDates!: number
  name!: string
  seqNr!: number
  minDueAmount!: number
  chargeIOA!: boolean
  isReminder!: boolean
  isFormalNotice!: boolean
  stopCommission!: boolean
  changeDossierStatus!: boolean
  targetDossierStatus!: CodeTable
  communicationList: ReminderCommunicationDto[]=[]
  actionList: ReminderActionDto[]=[]
  roleCreationList: ReminderRoleCreationDto[]=[]
  elapsedPeriodType!: CodeTable
  elapsedPeriod!: number
  reminderDocumentList: ReminderDocumentDto[]=[]
  followUpEventForReminderStepList: FollowUpEventForReminderStepDto[]=[]
  enableTargetDossierStatus!: boolean
  isStepSelected!: boolean
}

export class ReminderCommunicationDto extends DtoBase {
  communication: CommunicationDto = new CommunicationDto
  isCommunicationSelected!: boolean
}

export class CommunicationDto extends DtoBase {
  isMerchant!: boolean
  documentTemplateList!: DocumentTemplateRefDto[]
  attachmentList: AttachmentDto[]=[]
  communicationMedium!: CodeTable
  registeredLetter!: boolean
  documentTemplate!: DocumentTemplateRefDto
  communicationReceiver!: CodeTable
  receiverType!: CodeTable
  addressType!: CodeTable
  fallbackMechanism!: FallbackMechanismDto
  referenceType!: ReferenceTypeDto
  dossierRolePKey!: number
}

export class ReminderActionDto extends DtoBase {
  action: CloseActionDto = new CloseActionDto
}

export class ActionDto extends DtoBase {
  nameEN!: string
  nameFR!: string
  nameNL!: string
  actionReceiverTypeName!: CodeTable
  actionMessage!: string
  actionType!: CodeTable
  defaultHandleMargin!: number | null
  descriptionEN!: string
  descriptionFR!: string
  descriptionNL!: string
  defaultHandleTimeDays!: number
  defaultHandleTimeHours!: number
  defaultHandleTimeMinutes!: number
  defaultName!: string
  defaultHandlePeriod!: string
  actionCode!: string
  priority!: CodeTable
  name!: string
}

export class ReminderRoleCreationDto extends DtoBase {
  roleType!: CodeTable
  isRoleSelected!: boolean
}

export class ReminderDocumentDto extends DtoBase {
  documentConfiguration: DocumentConfigurationDto = new DocumentConfigurationDto
  documentTemplateBaseDocGenTypeList!: CodeTable
  docGenTypeList: CodeTable[]=[]
}

export class DocumentConfigurationDto extends DtoBase {
  documentTemplate: DocumentTemplateDto = new DocumentTemplateDto
}

export class DocumentTemplateDto extends DtoBase {
  adHoc!: boolean
  batch!: boolean
  documentTemplateType!: CodeTable
  docGenType!: CodeTable
  name!: string
}

export class FollowUpEventForReminderStepDto extends DtoBase {
  eventName!: CodeTable
}

export class CloseActionDto extends ActionDto {
  defaultHandleTimeValue!: number
  actionFunctionality!: CodeTable
  defaultHandleTime!: number
  isActionSelected!: boolean
}

export class AttachmentDto extends DtoBase {
  documentTemplate!: DocumentTemplateRefDto
}


export class ResponsePagedListBaseOfFollowUpProcedureDto {
  totalItemCount!: number
  pageIndex!: number
  items!: FollowUpProcedureDto[]
}

export class FollowUpProcedureDto extends DtoBase {
  name!: string
  startTriggerEvent!: CodeTable
  processContext!: number
  stopTriggerEvent!: CodeTable
  followUpStepList: FollowUpStepDto[]=[]
  followUpProcedure2StopEventList: FollowUpProcedure2StopEventDto[]=[]
  isSelected!: boolean
  isLastEdited!: boolean;
  flowType!: CodeTable
}

export class FollowUpProcedure2StopEventDto extends DtoBase {
  stopTriggerEvent !: CodeTable
  followupEventNameList: CodeTable[]=[]
  isReadOnly!: boolean
}

export class FollowUpStepDto extends DtoBase {
  deletedMessageList!: MessageDto[]
  changeStatus!: boolean
  elapsedPeriodFromEvent!: number
  elapsedPeriodFromPreviousStep!: number
  name!: string
  seqNr!: number
  triggerEvent!: CodeTable
  actionList: CloseActionDto[]=[]
  messageList: MessageDto[]=[]
  serviceActionList: ServiceActionConfigDto[]=[]
  followUpStepEventList: FollowUpStepEventDto[] = []
  stateStep: StateStepDto = new StateStepDto
  elapsedPeriodType!: CodeTable
  elapsedPeriod!: number
  handlingDateType!: CodeTable
  intervalMeasure!: CodeTable
  elapsedPeriodFromRuleEngine?: number
  ruleEngineActionConfigList: RuleEngineActionConfigDto[]=[]
  enableTargetState!: boolean
  isStepSelected!: boolean
}

export class MessageDto extends DtoBase {
  messageType!: number
  communication: CommunicationDto = new CommunicationDto
  isMessageSelected!: boolean
}

export class ServiceActionConfigDto extends DtoBase {
  isBlocking!: boolean
  name!: string
  serviceAction!: CodeTable
}

export class FollowUpStepEventDto extends DtoBase {
  event !: CodeTable
}

export class StateStepDto extends DtoBase {
  targetStateStatusName!: CodeTable
}

export class RuleEngineActionConfigDto extends DtoBase {
  ruleModelName!: string
  ruleEngineOutputConfigList: RuleEngineOutputConfigDto[]=[]
  isRuleEngineActionSelected!: boolean
}

export class RuleEngineOutputConfigDto extends DtoBase {
  output!: string
  stepNr?: number | null
  stopProcess!: boolean
}

export class SearchCriteriaBaseDto {
  halfPageSize!: number;
  defaultPageSize!: number;
  pageIndex!: number
  pageSize!: number
  sortMode!: string
  sortColumn!: string
  canValidate!: boolean
  enableSearch!: boolean
  state!: DtoState
}

export class ReminderFlowSearchCriteriaDto extends SearchCriteriaBaseDto {
  flowName!: FlowNameDto
  flowType!: CodeTable
}

export class FlowNameDto {
  name!: string
  isStatusBased!: boolean
  state!: DtoState
}

export class DocumentTemplateRefDto extends RefClassBaseDto {
  documentTemplateType!: CodeTable
  docGenType!: CodeTable
  name!: string
}

export class CommunicationMedium2DocumentTemplateDto extends DtoBase {
  communicationMedium!: CodeTable
  documentTemplate!: CodeTable
}

export class CloseDocGenTypeDto extends CodeTable {

}

export class FallbackMechanismDto extends DtoBase {
  name!: string
}

export class ReferenceTypeDto extends DtoBase {
  name!: string
}

export class CodetableParameterDto extends DtoBase {
  codetableName!: string
  parameterName!: string
  isSingleValue!: boolean
  codetableParameterItemList!: CodetableParameterItemDto[]
}

export class CodetableParameterItemDto extends DtoBase {
  codetableValue!: number
}
