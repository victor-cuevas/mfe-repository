import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, ErrorDto, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, FluidAutoCompleteConfig, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { ManageRemainderFlowConfigService } from './service/manage-remainder-flow-config.service';
import { ConfigContextService } from '@close-front-office/shared/config';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentDto, CloseActionDto, CodeTable, CodetableParameterDto, DocumentTemplateRefDto, DtoState, FlowNameDto, FollowUpEventForReminderStepDto, FollowUpProcedure2StopEventDto, FollowUpProcedureDto, FollowUpStepDto, FollowUpStepEventDto, MessageDto, ReminderActionDto, ReminderCommunicationDto, ReminderDocumentDto, ReminderFlowConfigScreenDto, ReminderFlowSearchCriteriaDto, ReminderRoleCreationDto, ReminderScenarioDto, ReminderScenarioStepDto, ResponsePagedListBaseOfFollowUpProcedureDto, ResponsePagedListBaseOfReminderScenarioDto, RuleEngineActionConfigDto, RuleEngineOutputConfigDto, ServiceActionConfigDto, StateStepDto } from './models/manage-remainder-flow-config.model';



@Component({
  selector: 'mpc-manage-remainder-flow-config',
  templateUrl: './manage-remainder-flow-config.component.html',
  styleUrls: ['./manage-remainder-flow-config.component.scss']
})
export class ManageRemainderFlowConfigComponent implements OnInit {
  @ViewChild("reminderFlowform", { static: true }) reminderFlowform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;

  public FlowNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TriggerEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public elapsedPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ActionNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ActionReceiverDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ActionTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public PriorityDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TemplateNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CommunicationMediumDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CommunicationReceiverDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ServiceActionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ServiceActionNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public FollowUpEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RuleModelNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RuleOutputTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public HoursTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinutesTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AttachmentTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  public RSNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RSStepNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RSElapsedPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RSMinDueAmountTestBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RSElapsedPeriodDropdownconfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSActionNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RSActionReceiverDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSActionTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSPriorityDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSTemplateNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSCommunicationMediumDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSCommunicationReceiverDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSRoleTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DocumentTemplateTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DocGenTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSFollowUpEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RSAttachmentTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select';
  validationHeader = this.translate.instant('plan.Validation.Header')
  remainderFlowScreenData!: ReminderFlowConfigScreenDto
  filter: ReminderFlowSearchCriteriaDto = new ReminderFlowSearchCriteriaDto
  filterName: FlowNameDto[] = []
  followUpList!: ResponsePagedListBaseOfFollowUpProcedureDto
  followUpDetail!: FollowUpProcedureDto
  followUpStepListDetail!: FollowUpStepDto
  actiondetail: CloseActionDto = new CloseActionDto
  communicationDetail: MessageDto = new MessageDto
  ruleEngineActionDetail: RuleEngineActionConfigDto = new RuleEngineActionConfigDto

  ElapsedPeriodTypeListForEventBased!: CodeTable[]
  ElapsedPeriodTypeListForStatusBased!: CodeTable[]

  remainderScenarioList!: ResponsePagedListBaseOfReminderScenarioDto
  remainderScenarioDetail!: ReminderScenarioDto
  remainderScenarioStepListDetail!: ReminderScenarioStepDto
  remainderScenarioActionDetail: ReminderActionDto = new ReminderActionDto
  remainderScenarioCommunicationDetail: ReminderCommunicationDto = new ReminderCommunicationDto
  remainderScenarioRoleDetail: ReminderRoleCreationDto = new ReminderRoleCreationDto

  saveFollowUpData: FollowUpProcedureDto = new FollowUpProcedureDto;
  saveReminderData: ReminderScenarioDto = new ReminderScenarioDto

  showFollowUpData!: boolean
  showRemainderData!: boolean
  showFollowUpStepDetail!: boolean
  showFollowUpDetail!: boolean
  showAttachment!: boolean
  showRemainderScenarioStepDetail!: boolean
  showRemainderScenarioDetail!: boolean
  recordsAvailable = 0;
  pageRow = 10;
  resetPagination = 0;
  paginationContent = 'Total Records : ' + this.recordsAvailable;
  exceptionBox!: boolean;
  showDialog!: boolean
  commonfollowUpEventNameList: CodeTable[] = []
  attachmentVisibility: CodetableParameterDto = new CodetableParameterDto
  attachmentList!: DocumentTemplateRefDto[]
  documentTypeList: CodeTable[] = []
  docGenTypeList: CodeTable[] = [];

  maxErrorDto: ErrorDto[] = [];
  intMaxValue = 2147483647;
  navigateUrl!: string
  SelectedTabIndex!: number
  errorCode!: string
  minHourDto: ErrorDto[] = []
  maxHourDto: ErrorDto[] = []
  minMinuteDto: ErrorDto[] = []
  maxMinuteDto: ErrorDto[] = []

  communicationHeader!: any;
  FlowNameHeader!: any[];
  stepseqHeader!: any[];
  services!: any[];
  servicesHeader!: any[];
  events!: any[];
  RoleHeader!: any[];
  ActionHeader: any[] = []
  RemainderFlowNameHeader: any[] = []
  RemainderScenarioStepSeqHeader: any[] = []
  RemainderScenarioActionHeader: any[] = []

  stopEvent = [
    { field: null, property: 'label', width: '30%' },
    { field: 'stopTriggerEvent', property: 'StopEvent', width: '60%' },
    { field: null, property: 'Delete', width: '10%' }
  ]

  CommunicationHeader = [
    { header: this.translate.instant('plan.flow.tabel.referencetype'), field: 'communication.documentTemplate.name', property: 'ReferenceType', width: '13%' },
    { header: this.translate.instant('plan.flow.tabel.communicationmedium'), field: 'communication.communicationMedium.caption', property: 'CommunicationMedium', width: '13%' },
    { header: this.translate.instant('plan.flow.tabel.templatename'), field: 'communication.roleType.caption', property: 'TemplateName', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.communicationreceiver'), field: 'communication.adminRoleType.caption', property: 'CommunicationReceiver', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.receivertype'), field: 'communication.collectionsRoleType.caption', property: 'ReceiverType', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.registered'), field: 'communication.registeredLetter', property: 'Registered', width: '13%' },
    { header: this.translate.instant('plan.flow.tabel.addresstype'), field: 'communication.constructionDepotRoleType.caption', property: 'AddressType', width: '14%' },
    { header: '', field: null, property: 'Delete', width: '5%' }
  ];

  AttachmentHeader = [
    { header: this.translate.instant('plan.flow.tabel.attachmentType'), field: 'documentTemplate.docGenType.caption', property: 'AttachmentType', width: '95%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];

  ServicesHeader = [
    { header: this.translate.instant('plan.flow.tabel.name'), pSortableColumnDisabled: true, field: 'actionName', property: 'ActionName', width: '31%' },
    { header: this.translate.instant('plan.flow.tabel.servicename'), pSortableColumnDisabled: true, field: 'serviceAction.caption', property: 'ServiceName', width: '32%' },
    { header: this.translate.instant('plan.flow.tabel.isblocking'), field: 'isBlocking', property: 'IsBlocking', width: '32%' },
    { header: '', field: '', property: 'Delete', pSortableColumnDisabled: true, width: '5%' }
  ];

  EventsHeader = [
    { header: this.translate.instant('plan.flow.tabel.eventname'), field: 'event', property: 'FollowUpEvent', width: '95%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];

  RoleEngineActionHeader = [
    { header: this.translate.instant('plan.flow.tabel.ruleName'), field: 'ruleModelName', property: 'RuleModelName', width: '95%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];

  RuleEngineOutputHeader = [
    { header: this.translate.instant('plan.flow.tabel.ruleOutput'), field: 'output', property: 'Output', width: '32%' },
    { header: this.translate.instant('plan.flow.tabel.goToStep'), field: 'stepNr', property: 'StepNr', width: '32%' },
    { header: this.translate.instant('plan.flow.tabel.stopProcess'), field: 'stopProcess', property: 'StopProcess', width: '31%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];

  RemainderScenarioCommunicationHeader = [
    { header: this.translate.instant('plan.flow.tabel.referencetype'), field: 'communication.documentTemplate.name', property: 'ReferenceType', width: '13%' },
    { header: this.translate.instant('plan.flow.tabel.communicationmedium'), field: 'communication.communicationMedium.caption', property: 'CommunicationMedium', width: '13%' },
    { header: this.translate.instant('plan.flow.tabel.templatename'), field: 'communication.roleType.caption', property: 'TemplateName', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.fallBackMech'), field: 'communication.fallbackMechanism.caption', property: 'FallBackMechanism', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.communicationreceiver'), field: 'communication.adminRoleType.caption', property: 'CommunicationReceiver', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.receivertype'), field: 'communication.collectionsRoleType.caption', property: 'ReceiverType', width: '14%' },
    { header: this.translate.instant('plan.flow.tabel.registered'), field: 'communication.registeredLetter', property: 'Registered', width: '13%' },
    { header: this.translate.instant('plan.flow.tabel.addresstype'), field: 'communication.constructionDepotRoleType.caption', property: 'AddressType', width: '14%' },
    { header: '', field: null, property: 'Delete', width: '5%' }
  ];

  RemainderScenarioAttachmentHeader = [
    { header: this.translate.instant('plan.flow.tabel.attachmentType'), field: 'documentTemplate.docGenType.caption', property: 'AttachmentType', width: '95%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];

  RemainderScenarioEventsHeader = [
    { header: this.translate.instant('plan.flow.tabel.eventname'), field: 'eventName', property: 'RemainderEvent', width: '95%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];

  RemainderScenarioDocumentHeader = [
    { header: this.translate.instant('plan.flow.tabel.docTemplate'), field: 'documentConfiguration.documentTemplate.documentTemplateType.caption', property: 'TemplateType', width: '45%' },
    { header: this.translate.instant('plan.flow.tabel.docGen'), field: 'documentConfiguration.documentTemplate.docGenType.caption', property: 'DocGenType', width: '45%' },
    { header: '', field: '', property: 'Delete', width: '10%' }
  ];

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, private commonService: ConfigContextService, public router: Router,
    private fluidValidation: fluidValidationService, public route: ActivatedRoute, private spinnerService: SpinnerService, public service: ManageRemainderFlowConfigService) {
    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {
      this.SelectedTabIndex = selectedTabIndex;
    });
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  ngOnInit(): void {

    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.remainderFlowScreenData = res.RemainderFlowScreenData
    })

    const CMParameterName = 'CommunicationMediumNameChkForAutomaticAttachmentGeneration'
    this.service.getCodetableParameterByName(CMParameterName).subscribe((res: any) => {
      this.attachmentVisibility = res;
    })

    const AttachmentParameterName = 'DocumentTemplateTypeDefaultTypeDocument'
    this.service.getCodetableParameterByName(AttachmentParameterName).subscribe((res: CodetableParameterDto) => {
      const codeTableValue: CodetableParameterDto = res;
      codeTableValue.codetableParameterItemList.forEach(x => {
        this.attachmentList = this.remainderFlowScreenData.documentTemplateList.filter(y => y.documentTemplateType.codeId == x.codetableValue);
      })
    })

    const DocumentParameterName = 'DocumentTemplateTypeChkForConfigureDocumentInReminderFlow'
    this.service.getCodetableParameterByName(DocumentParameterName).subscribe((res: CodetableParameterDto) => {
      const codeTableValue: CodetableParameterDto = res;
      let documentTemplateList: DocumentTemplateRefDto[] = [];
      codeTableValue.codetableParameterItemList.forEach(x => {
        documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(y => y.documentTemplateType.codeId == x.codetableValue);
      })
      const uniqueId: any[] = []
      const documentTypeList: DocumentTemplateRefDto[] = documentTemplateList.filter(element => {
        const isDuplicate = uniqueId.includes(element.documentTemplateType.codeId);
        if (!isDuplicate) {
          uniqueId.push(element.documentTemplateType.codeId);
          return true;
        }
        return false;
      });

      documentTypeList.forEach(x => {
        this.documentTypeList.push(x.documentTemplateType);
      })
    })

    this.ElapsedPeriodTypeListForStatusBased = this.remainderFlowScreenData?.elapsedPeriodTypeList.filter(x => x.codeId == 1 || x.codeId == 2)
    this.ElapsedPeriodTypeListForEventBased = this.remainderFlowScreenData?.elapsedPeriodTypeList.filter(x => x.codeId != 1)

    this.FlowNameHeader = [
      { header: this.translate.instant('plan.flow.tabel.flowname'), field: 'name', width: '48%' },
      { header: this.translate.instant('plan.flow.tabel.flowtype'), field: 'flowType.caption', width: '47%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.RemainderFlowNameHeader = [
      { header: this.translate.instant('plan.flow.tabel.flowname'), field: 'scenarioName', width: '48%' },
      { header: this.translate.instant('plan.flow.tabel.flowtype'), field: 'flowType.caption', width: '47%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'remaindercustomizeDeleteButton', width: '5%' }
    ];

    this.stepseqHeader = [
      { header: this.translate.instant('plan.flow.tabel.stepseq'), field: 'seqNr', width: '31%' },
      { header: this.translate.instant('plan.flow.tabel.stepname'), field: 'name', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.elapserperiod'), field: 'elapsedPeriod', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.RemainderScenarioStepSeqHeader = [
      { header: this.translate.instant('plan.flow.tabel.stepseq'), field: 'seqNr', width: '31%' },
      { header: this.translate.instant('plan.flow.tabel.stepname'), field: 'name', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.elapserperiod'), field: 'elapsedPeriod', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.ActionHeader = [
      { header: this.translate.instant('plan.flow.tabel.actionname'), field: 'name', width: '31%' },
      { header: this.translate.instant('plan.flow.tabel.actiontype'), field: 'actionType.caption', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.actionreceive'), field: 'actionReceiverTypeName.caption', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.RemainderScenarioActionHeader = [
      { header: this.translate.instant('plan.flow.tabel.actionname'), field: 'action.name', width: '31%' },
      { header: this.translate.instant('plan.flow.tabel.actiontype'), field: 'action.actionType.caption', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.actionreceive'), field: 'action.actionReceiverTypeName.caption', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.communicationHeader = [
      { header: this.translate.instant('plan.flow.tabel.referencetype'), field: 'referencetype', width: '13%' },
      { header: this.translate.instant('plan.flow.tabel.communicationmedium'), field: 'communicationmedium', width: '14%' },
      { header: this.translate.instant('plan.flow.tabel.templatename'), field: 'templatename', width: '14%' },
      { header: this.translate.instant('plan.flow.tabel.communicationreceiver'), field: 'communicationreceiver', width: '14%' },
      { header: this.translate.instant('plan.flow.tabel.receivertype'), field: 'receivertype', width: '14%' },
      { header: this.translate.instant('plan.flow.tabel.registered'), field: 'registered', width: '13%' },
      { header: this.translate.instant('plan.flow.tabel.addresstype'), field: 'addresstype', width: '13%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.servicesHeader = [
      { header: this.translate.instant('plan.flow.tabel.name'), field: 'name', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.servicename'), field: 'servicename', width: '32%' },
      { header: this.translate.instant('plan.flow.tabel.isblocking'), field: 'isblocking', width: '31%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.RoleHeader = [
      { header: this.translate.instant('plan.flow.tabel.role'), field: 'roleType.caption', width: '95%' },
      { header: this.translate.instant('plan.flow.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];

  }

  onSave(saveData: any) {

    if (this.filter.flowType) {
      if (this.reminderFlowform.valid) {
        this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.oneRuleAction'));
        this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.oneRuleOutput'));
        this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.fillStepNr'));
        this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.noFillStepNr'));
        this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.StepBeforeNotAllowed'));
        this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.matchingFollowUpStep'));

        if (this.filter.flowType.codeId == 1) {
          (saveData as ReminderScenarioDto[]).forEach(x => {
            if (x.isLastEdited) {
              this.saveReminderData = { ...x };
            }
          })

          if (this.saveReminderData.scenarioName != undefined) {
            this.spinnerService.setIsLoading(true);
            this.service.saveRemainderScenarioData(this.saveReminderData).subscribe(res => {
              this.spinnerService.setIsLoading(false);
              this.onSearch(this.filter);
              this.saveReminderData = new ReminderScenarioDto
            }, err => {
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
              if (err?.error?.errorCode) {
                this.errorCode = err?.error?.errorCode;
              }
              else {
                this.errorCode = 'InternalServiceFault';
              }
              this.saveReminderData = new ReminderScenarioDto
            });
          }
        }
        else {
          (saveData as FollowUpProcedureDto[]).forEach(x => {
            if (x.isLastEdited) {
              this.saveFollowUpData = { ...x };
            }
          })

          this.saveFollowUpData.followUpStepList.forEach(x => {
            if (x.elapsedPeriodType == null || x.elapsedPeriodType == undefined) {
              x.elapsedPeriodType = this.remainderFlowScreenData.elapsedPeriodTypeList.filter(y => y.codeId == 3)[0]
            }
          })

          let businessError = false;
          this.saveFollowUpData.followUpStepList.forEach(x => {
            if (x.ruleEngineActionConfigList.length > 1) {
              businessError = true;
              this.throwBusinessError(this.translate.instant('plan.flow.businessError.oneRuleAction'));
            }

            if (x.ruleEngineActionConfigList.length > 0) {
              x.ruleEngineActionConfigList.forEach(y => {
                if (y.ruleEngineOutputConfigList.length == 0 && !businessError) {
                  businessError = true;
                  this.throwBusinessError(this.translate.instant('plan.flow.businessError.oneRuleOutput'));
                }

                if (y.ruleEngineOutputConfigList.length > 0) {
                  y.ruleEngineOutputConfigList.forEach(z => {
                    if (!z.stopProcess && z.stepNr == null || z.stepNr == 0 && !businessError) {
                      businessError = true;
                      this.throwBusinessError(this.translate.instant('plan.flow.businessError.fillStepNr'));
                    }

                    if (z.stopProcess && (z.stepNr != null || z.stepNr as unknown as number > 0) && !businessError) {
                      businessError = true;
                      this.throwBusinessError(this.translate.instant('plan.flow.businessError.noFillStepNr'));
                    }

                    if (z.stepNr as number > 0 && z.stepNr as number < x.seqNr && !businessError) {
                      businessError = true;
                      this.throwBusinessError(this.translate.instant('plan.flow.businessError.StepBeforeNotAllowed'));
                    }

                    if ((z.stepNr == x.seqNr && !(x.elapsedPeriodType?.codeId == 5) && !businessError)) {
                      businessError = true;
                      this.throwBusinessError(this.translate.instant('plan.flow.businessError.matchingFollowUpStep'));
                    }
                    const seqNrIndex = this.saveFollowUpData.followUpStepList.findIndex(a => a.seqNr == z.stepNr);
                    if (seqNrIndex == -1 && !z.stopProcess) {
                      businessError = true;
                      this.throwBusinessError(this.translate.instant('plan.flow.businessError.matchingFollowUpStep'));
                    }
                  })
                }
              })
            }
          })
          if (!businessError) {
            if (this.saveFollowUpData.name != undefined) {
              this.spinnerService.setIsLoading(true);
              this.service.saveFollowUpData(this.saveFollowUpData).subscribe(res => {
                this.spinnerService.setIsLoading(false);
                this.onSearch(this.filter);
                this.saveFollowUpData = new FollowUpProcedureDto
              }, err => {
                this.spinnerService.setIsLoading(false);
                this.exceptionBox = true;
                if (err?.error?.errorCode) {
                  this.errorCode = err?.error?.errorCode;
                }
                else {
                  this.errorCode = 'InternalServiceFault';
                }
                this.saveFollowUpData = new FollowUpProcedureDto
              });
            }
          }
        }
      }
      else {
        this.settingExternalErrorTrue();
      }
    }
  }

  onPageIndex(event: any) {
    if (event) {
      this.filter.pageSize = event.rows;
      this.filter.pageIndex = event.first / event.rows;
      if (event?.sortOrder && event?.sortField) {
        this.filter.sortColumn = event.sortField;
        if (event.sortOrder == 1) {
          this.filter.sortMode = 'asc';
          this.onSearch(this.filter);
        } else if (event.sortOrder == -1) {
          this.filter.sortMode = 'desc';
          this.onSearch(this.filter);
        }
      } else {
        this.onSearch(this.filter);
      }

    }
  }

  onSearch(searchData: ReminderFlowSearchCriteriaDto) {
    this.filter.pageSize = 10;
    this.spinnerService.setIsLoading(true);
    if (searchData.flowType?.codeId == 2) {
      this.service.getFollowupProcedureList(searchData).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        this.followUpList = res;
        this.followUpList.items.forEach(x => x.flowType = this.filter.flowType);

        if (this.filter.sortMode == 'asc') {
          this.followUpList.items.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1);
        }
        else if (this.filter.sortMode == 'desc') {
          this.followUpList.items.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 1);
        }
        if (this.followUpList.items.length > 0) {
          this.showFollowUpData = true;
          this.followUpList.items.forEach(x => {
            if (x.followUpProcedure2StopEventList.length > 0) {
              x.followUpProcedure2StopEventList.forEach(y => y.isReadOnly = true)
            }
          })

          this.followUpList.items.forEach(x => x.followUpStepList.forEach(y => {
            if (y.changeStatus)
              y.enableTargetState = true;
            else
              y.enableTargetState = false;
          }))

          this.settingIsSelectedFalse();
          this.followUpList.items[0].isSelected = true;
          this.followUpDetail = this.followUpList.items[0];
          this.showFollowUpDetail = false;
          this.settingIsLastEditedFalse();

          this.paginationContent = 'Total Records : ' + res.totalItemCount;
          this.followUpList.pageIndex = res.pageIndex;
          this.recordsAvailable = res.totalItemCount;

          this.resetPagination = res.pageIndex * this.pageRow
        }
        else {
          this.showFollowUpData = false;
        }

      }, err => {
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
      });
    }
    else if (searchData.flowType?.codeId == 1) {
      this.service.getReminderScenarioList(searchData).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        this.remainderScenarioList = res;

        this.remainderScenarioList.items.forEach(x => x.flowType = this.filter.flowType);

        this.remainderScenarioList.items.forEach(x => x.canDeleteEnable = !x.isLinkedToReminderPlan);
        if (this.filter.sortMode == 'asc') {
          this.remainderScenarioList.items.sort((a, b) => (a.scenarioName.toLowerCase() < b.scenarioName.toLowerCase()) ? -1 : 1);
        }
        else if (this.filter.sortMode == 'desc') {
          this.remainderScenarioList.items.sort((a, b) => (a.scenarioName.toLowerCase() > b.scenarioName.toLowerCase()) ? -1 : 1);
        }
        if (this.remainderScenarioList.items.length > 0) {
          this.showRemainderData = true;

          this.remainderScenarioList.items.forEach(x => x.reminderScenarioStepList.forEach(y => {
            if (y.changeDossierStatus)
              y.enableTargetDossierStatus = true;
            else
              y.enableTargetDossierStatus = false;
          }))

          this.settingRemainderScenarioIsSelectedFalse();
          this.remainderScenarioList.items[0].isSelected = true;
          this.remainderScenarioDetail = this.remainderScenarioList.items[0];
          this.showRemainderScenarioDetail = false;
          this.settingRemainderScenarioIsLastEditedFalse();

          this.paginationContent = 'Total Records : ' + res.totalItemCount;
          this.remainderScenarioList.pageIndex = res.pageIndex;
          this.recordsAvailable = res.totalItemCount;

          this.resetPagination = res.pageIndex * this.pageRow
        }
        else {
          this.showRemainderData = false;
        }

      }, err => {
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
      });
    }
    else {
      this.showFollowUpData = false;
      this.showRemainderData = false;
      this.spinnerService.setIsLoading(false);
    }
  }

  dataSelection(event: any) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.showFollowUpDetail = true;
        this.settingIsSelectedFalse();
        this.followUpDetail = event;
        this.followUpDetail.isSelected = true;
        this.showFollowUpStepDetail = false;
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  stepListDataSelection(event: any) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.showFollowUpStepDetail = true;
        this.settingIsStepSelectedFalse();
        this.followUpStepListDetail = event;
        this.followUpStepListDetail.isStepSelected = true;
        if (this.followUpStepListDetail.actionList.length > 0) {
          this.settingIsActionSelectedFalse();
          this.followUpStepListDetail.actionList[0].isActionSelected = true;
          this.actiondetail = this.followUpStepListDetail.actionList[0];
        }
        if (this.followUpStepListDetail.ruleEngineActionConfigList.length > 0) {
          this.settingIsRuleEngineSelectedfalse();
          this.followUpStepListDetail.ruleEngineActionConfigList[0].isRuleEngineActionSelected = true;
          this.ruleEngineActionDetail = this.followUpStepListDetail.ruleEngineActionConfigList[0];
        }
        if (this.followUpStepListDetail.messageList.length > 0) {
          this.settingIsMessageSelectedFalse();
          this.followUpStepListDetail.messageList[0].isMessageSelected = true;
          this.communicationDetail = this.followUpStepListDetail.messageList[0];
          const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == this.communicationDetail.communication.communicationMedium?.codeId)
          if (codeTableIndex != -1) {
            this.showAttachment = true;
          }
          else {
            this.showAttachment = false;
          }

          this.followUpStepListDetail.messageList.forEach(x => {
            const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(y => y.communicationMedium?.codeId == x.communication.communicationMedium?.codeId)
            x.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
              x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
            )
          })

        }
        else {
          this.showAttachment = false;
        }
      }
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  actionDataSelect(event: CloseActionDto) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.settingIsActionSelectedFalse();
        this.actiondetail = event;
        this.actiondetail.isActionSelected = true;
      }
    }
    else { this.settingExternalErrorTrue() }
  }

  messageDataSelect(event: MessageDto) {
    if (this.reminderFlowform.valid || event.isMessageSelected) {
      if (event) {
        this.settingIsMessageSelectedFalse();
        this.communicationDetail = event;
        this.communicationDetail.isMessageSelected = true;
        const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == this.communicationDetail.communication.communicationMedium?.codeId)
        if (codeTableIndex != -1) {
          this.showAttachment = true;
        }
        else {
          this.showAttachment = false;
        }
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  RuleActionDataSelect(event: RuleEngineActionConfigDto) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.settingIsRuleEngineSelectedfalse();
        this.ruleEngineActionDetail = event;
        this.ruleEngineActionDetail.isRuleEngineActionSelected = true;
      }
    }
    else { this.settingExternalErrorTrue() }
  }

  addEventBasedFlow() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      this.showFollowUpDetail = true;
      this.settingIsSelectedFalse();
      const newRow = new FollowUpProcedureDto();
      newRow.state = DtoState.Created;
      newRow.isSelected = true;
      const newuserList = this.followUpList.items;
      newuserList.push({ ...newRow });
      this.followUpDetail = new FollowUpProcedureDto;
      this.followUpList.items = [...newuserList];

      this.followUpDetail.isSelected = true;
      this.followUpDetail.pKey = 0;
      this.followUpDetail.state = DtoState.Created;
      this.followUpDetail.flowType = this.filter.flowType;

      this.followUpList.items[this.followUpList.items.length - 1] = this.followUpDetail;
      this.showFollowUpStepDetail = false;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onFollowUpRowDelete(event: FollowUpProcedureDto, gridData: FollowUpProcedureDto[]) {

    let action = -1;
    let communication = -1;
    let attachment = -1;
    let ruleaction = -1;
    let output = -1;
    let service = -1;
    let Event = -1;
    const nameIndex = event.followUpStepList.findIndex(x => x.name == "" || x.name == undefined);
    const triggerEventIndex = event.followUpStepList.findIndex(x => x.triggerEvent == null || x.triggerEvent == undefined)
    const elapsedPeriodIndex = event.followUpStepList.findIndex(x => x.elapsedPeriod == null || x.elapsedPeriod == undefined)

    event.followUpStepList.forEach(x => {
      if (x.actionList.length > 0)
        action = x.actionList.findIndex(y => {
          return y.actionType == null || y.actionType == undefined || y.actionReceiverTypeName == null || y.actionReceiverTypeName == undefined
            || y.priority == null || y.priority == undefined || y.name == "" || y.name == undefined
        })
    });
    event.followUpStepList.forEach(x => {
      if (x.messageList.length > 0)
        communication = x.messageList.findIndex(y => {
          return y.communication.documentTemplate == null || y.communication.documentTemplate == undefined || y.communication.communicationMedium == null
            || y.communication.communicationMedium == undefined || y.communication.communicationReceiver == null || y.communication.communicationMedium == undefined
        })
    });

    event.followUpStepList.forEach(x => x.messageList.forEach(y => {
      if (y.communication.attachmentList.length > 0) {
        attachment = y.communication.attachmentList.findIndex(z => z.documentTemplate == null || z.documentTemplate == undefined);
      }
    }))

    event.followUpStepList.forEach(x => {
      if (x.serviceActionList.length > 0)
        service = x.serviceActionList.findIndex(y => { return y.name == "" || y.name == undefined })
    });
    event.followUpStepList.forEach(x => {
      if (x.followUpStepEventList.length > 0)
        Event = x.followUpStepEventList.findIndex(y => { return y.event == null || y.event == undefined })
    });
    event.followUpStepList.forEach(x => {
      if (x.ruleEngineActionConfigList.length > 0)
        ruleaction = x.ruleEngineActionConfigList.findIndex(y => { return y.ruleModelName == "" || y.ruleModelName == undefined })
      x.ruleEngineActionConfigList.forEach(y => {
        if (y.ruleEngineOutputConfigList.length > 0) {
          output = y.ruleEngineOutputConfigList.findIndex(z => z.output == "" || z.output == undefined)
        }
      })
    });

    if (this.reminderFlowform.valid || event.name == "" || event.name == undefined || nameIndex != -1 || triggerEventIndex != -1 || elapsedPeriodIndex != -1 ||
      action != -1 || communication != -1 || service != -1 || Event != -1 || ruleaction != -1 || output != -1 || attachment != -1) {

      this.spinnerService.setIsLoading(true);
      this.service.deleteFollowUpData(event.pKey).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList = [];
        this.filter.flowName = null as unknown as FlowNameDto;
        this.onSearch(this.filter);
      }, err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
      });
      this.showFollowUpStepDetail = false;
    }
  }

  addStopEvent() {
    if (this.reminderFlowform.valid) {
      if (this.followUpDetail.followUpProcedure2StopEventList.length > 0) {
        this.commonfollowUpEventNameList = this.remainderFlowScreenData.followupEventNameList.filter(val => {
          return !this.followUpDetail.followUpProcedure2StopEventList.find(x => {
            if (x.stopTriggerEvent != undefined)
              return x.stopTriggerEvent.codeId == val.codeId;
            return false
          });
        })
      }
      else {
        this.commonfollowUpEventNameList = this.remainderFlowScreenData.followupEventNameList;
      }
      const newRow = new FollowUpProcedure2StopEventDto();
      newRow.isReadOnly = false;
      this.commonfollowUpEventNameList.forEach(x => newRow.followupEventNameList.push({ ...x }));
      const newuserList = this.followUpDetail.followUpProcedure2StopEventList;
      newuserList.push({ ...newRow });
      this.followUpDetail.followUpProcedure2StopEventList = [...newuserList];

      this.followUpDetail.followUpProcedure2StopEventList[this.followUpDetail.followUpProcedure2StopEventList.length - 1].pKey = 0;
      this.followUpDetail.followUpProcedure2StopEventList[this.followUpDetail.followUpProcedure2StopEventList.length - 1].state = DtoState.Created;

      const index = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[index].followUpProcedure2StopEventList = this.followUpDetail.followUpProcedure2StopEventList
      this.settingIsLastEditedFalse();
      this.followUpList.items[index].isLastEdited = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onStopEventDelete(event: FollowUpProcedure2StopEventDto, gridData: FollowUpProcedure2StopEventDto[]) {

    const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[ListIndex].isLastEdited = true;

    const deletedata = gridData.findIndex(data => {
      return (data == event);
    })
    event.stopTriggerEvent = <CodeTable>{};
    gridData.splice(deletedata, 1)
    this.followUpList.items[ListIndex].followUpProcedure2StopEventList = [...gridData];
  }

  addStep() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      this.settingIsStepSelectedFalse();
      this.showAttachment = false;
      const newRow = new FollowUpStepDto();
      newRow.isStepSelected = true;
      const newuserList = this.followUpDetail.followUpStepList;
      newuserList.push({ ...newRow });
      this.followUpStepListDetail = new FollowUpStepDto
      this.followUpDetail.followUpStepList = [...newuserList];
      const index = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected)

      this.followUpStepListDetail.isStepSelected = true;
      this.followUpStepListDetail.pKey = 0;
      this.followUpStepListDetail.state = DtoState.Created;
      this.followUpStepListDetail.elapsedPeriod = 0;
      this.followUpStepListDetail.seqNr = this.followUpDetail.followUpStepList.length;

      const listIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[listIndex].state = DtoState.Dirty;
      this.followUpDetail.followUpStepList[index] = this.followUpStepListDetail;
      this.showFollowUpStepDetail = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onStepDelete(event: FollowUpStepDto, gridData: FollowUpStepDto[]) {

    let outputindex = -1;
    let attachmentType = -1;
    const action = event.actionList?.findIndex(x => x.actionType == null || x.actionType == undefined || x.actionReceiverTypeName == null || x.actionReceiverTypeName == undefined
      || x.priority == null || x.priority == undefined || x.name == "" || x.name == undefined)

    const communication = event.messageList?.findIndex(x => x.communication.documentTemplate == null || x.communication.documentTemplate == undefined || x.communication.communicationMedium == null
      || x.communication.communicationMedium == undefined || x.communication.communicationReceiver == null || x.communication.communicationMedium == undefined)

    event.messageList?.forEach(x => {
      if (attachmentType == -1) {
        attachmentType = x.communication?.attachmentList.findIndex(y => y.documentTemplate == null)
      }
    })

    const ruleNameindex = event.ruleEngineActionConfigList?.findIndex(x => x.ruleModelName == "" || x.ruleModelName == undefined)

    event.ruleEngineActionConfigList?.forEach(x => {
      if (x.ruleEngineOutputConfigList.length > 0) {
        outputindex = x.ruleEngineOutputConfigList.findIndex(y => y.output == "" || y.output == undefined)
      }
    })
    const eventIndex = event.followUpStepEventList?.findIndex(x => x.event == null || x.event == undefined)

    if (this.reminderFlowform.valid || event.name == "" || event.triggerEvent == null || event.name == undefined || event.elapsedPeriod == null || action != -1 ||
      communication != -1 || ruleNameindex != -1 || outputindex != -1 || eventIndex != -1 || attachmentType != -1) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      gridData.splice(deletedata, 1);

      if (gridData.length > 0) {
        gridData.forEach(x => {
          if (x.seqNr > event.seqNr) {
            x.seqNr = x.seqNr - 1;
          }
        })
      }

      this.followUpList.items[ListIndex].followUpStepList = [...gridData];
      if (gridData.length == 0) {
        this.settingExternalErrorFalse();
        setTimeout(() => {
          this.showFollowUpStepDetail = false;
        }, 10)
      }
      else {
        this.followUpStepListDetail = this.followUpDetail.followUpStepList[this.followUpDetail.followUpStepList.length - 1];
        this.settingIsStepSelectedFalse();
        this.followUpStepListDetail.isStepSelected = true;
      }
    }
  }

  addActions() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new CloseActionDto();
      const newuserList = this.followUpStepListDetail.actionList;
      newuserList.push({ ...newRow });
      this.followUpStepListDetail.actionList = [...newuserList];
      this.actiondetail = new CloseActionDto;
      this.settingIsActionSelectedFalse();
      this.actiondetail.pKey = 0;
      this.actiondetail.state = DtoState.Created;
      this.actiondetail.isActionSelected = true;
      this.followUpStepListDetail.actionList[this.followUpStepListDetail.actionList.length - 1] = this.actiondetail;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onActionDelete(event: CloseActionDto, gridData: CloseActionDto[]) {
    if (this.reminderFlowform.valid || event.name == "" || event.name == undefined || event.actionType == null || event.actionReceiverTypeName == null || event.priority == null) {
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      this.settingIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      event.name = " "
      event.actionType = <CodeTable>{};
      event.actionReceiverTypeName = <CodeTable>{};
      event.priority = <CodeTable>{};
      event.defaultHandleTimeHours = 1;
      event.defaultHandleTimeMinutes = 1;
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].actionList = [...gridData];
        if (gridData.length > 0) {
          this.settingIsActionSelectedFalse();
          this.followUpList.items[ListIndex].followUpStepList[stepIndex].actionList[this.followUpList.items[ListIndex].followUpStepList[stepIndex].actionList.length - 1].isActionSelected = true;
          this.actiondetail = this.followUpList.items[ListIndex].followUpStepList[stepIndex].actionList[this.followUpList.items[ListIndex].followUpStepList[stepIndex].actionList.length - 1];
        }
      }, 1)
    }
  }

  addCommunications() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      this.showAttachment = false;
      const newRow = new MessageDto();
      const newuserList = this.followUpStepListDetail.messageList;
      newuserList.push({ ...newRow });
      this.communicationDetail = new MessageDto();
      this.followUpStepListDetail.messageList = [...newuserList];
      this.settingIsMessageSelectedFalse();
      this.communicationDetail.isMessageSelected = true;
      this.communicationDetail.pKey = 0;
      this.communicationDetail.state = DtoState.Created;
      this.communicationDetail.communication.pKey = 0;
      this.communicationDetail.communication.state = DtoState.Created;
      this.followUpStepListDetail.messageList[this.followUpStepListDetail.messageList.length - 1] = this.communicationDetail;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onCommunicationDelete(event: MessageDto, gridData: MessageDto[]) {
    const attachmentIndex = event.communication.attachmentList.findIndex(x => x.documentTemplate == null);
    if (this.reminderFlowform.valid || event.communication.documentTemplate == null || event.communication.communicationMedium == null || event.communication.communicationReceiver == null || attachmentIndex != -1) {
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      this.settingIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.communication.communicationMedium = <CodeTable>{}
      event.communication.communicationReceiver = <CodeTable>{}
      event.communication.documentTemplate = <DocumentTemplateRefDto>{}
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList = [...gridData];
        if (this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList.length > 0) {
          this.settingIsMessageSelectedFalse();
          this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList[this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList.length - 1].isMessageSelected = true;
          this.communicationDetail = this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList[this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList.length - 1];
          const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == this.communicationDetail.communication.communicationMedium?.codeId)
          if (codeTableIndex != -1) {
            this.showAttachment = true;
          }
          else {
            this.showAttachment = false;
          }
          if (this.communicationDetail.communication.communicationMedium != null) {
            const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(x => x.communicationMedium?.codeId == this.communicationDetail.communication.communicationMedium?.codeId)
            this.communicationDetail.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
              x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
            )
          }
        }
      }, 1)

    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  addAttachment() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      const messageIndex = this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList.findIndex(x => x.isMessageSelected)
      const newRow = new AttachmentDto();
      const newuserList = this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList
      this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList.push({ ...newRow });
      this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList = [...newuserList];
      this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList[this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList.length - 1].pKey = 0;
      this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList[this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList.length - 1].state = DtoState.Created;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onAttachmentDelete(event: AttachmentDto, gridData: AttachmentDto[]) {
    if (this.reminderFlowform.valid || event.documentTemplate == null || event.documentTemplate == undefined) {
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      const messageIndex = this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList.findIndex(x => x.isMessageSelected)
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.documentTemplate = <DocumentTemplateRefDto>{};
      setTimeout(() => {
        gridData.splice(deletedata, 1)
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].messageList[messageIndex].communication.attachmentList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }


  addServices() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new ServiceActionConfigDto();
      const newuserList = this.followUpStepListDetail.serviceActionList;
      newuserList.push({ ...newRow });
      this.followUpStepListDetail.serviceActionList = [...newuserList];
      this.followUpStepListDetail.serviceActionList[this.followUpStepListDetail.serviceActionList.length - 1].pKey = 0;
      this.followUpStepListDetail.serviceActionList[this.followUpStepListDetail.serviceActionList.length - 1].state = DtoState.Created;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onServiceDelete(event: ServiceActionConfigDto, gridData: ServiceActionConfigDto[]) {
    if (this.reminderFlowform.valid || event.name == "" || event.name == undefined || event.serviceAction == null) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.name = ' ';
      event.serviceAction = <CodeTable>{};
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].serviceActionList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  addEvents() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new FollowUpStepEventDto();
      const newuserList = this.followUpStepListDetail.followUpStepEventList
      this.followUpStepListDetail.followUpStepEventList.push({ ...newRow });
      this.followUpStepListDetail.followUpStepEventList = [...newuserList];
      this.followUpStepListDetail.followUpStepEventList[this.followUpStepListDetail.followUpStepEventList.length - 1].pKey = 0;
      this.followUpStepListDetail.followUpStepEventList[this.followUpStepListDetail.followUpStepEventList.length - 1].state = DtoState.Created;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onEventDelete(event: FollowUpStepEventDto, gridData: FollowUpStepEventDto[]) {
    if (this.reminderFlowform.valid || event.event == null) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.event = <CodeTable>{};
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].followUpStepEventList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }

  }

  addRuleAction() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new RuleEngineActionConfigDto();
      const newuserList = this.followUpStepListDetail.ruleEngineActionConfigList
      this.followUpStepListDetail.ruleEngineActionConfigList.push({ ...newRow });
      this.followUpStepListDetail.ruleEngineActionConfigList = [...newuserList];
      this.ruleEngineActionDetail = new RuleEngineActionConfigDto();
      this.ruleEngineActionDetail.pKey = 0;
      this.ruleEngineActionDetail.state = DtoState.Created;
      this.settingIsRuleEngineSelectedfalse();
      this.ruleEngineActionDetail.isRuleEngineActionSelected = true;
      this.followUpStepListDetail.ruleEngineActionConfigList[this.followUpStepListDetail.ruleEngineActionConfigList.length - 1] = this.ruleEngineActionDetail
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRuleActionDelete(event: RuleEngineActionConfigDto, gridData: RuleEngineActionConfigDto[]) {
    const index = event.ruleEngineOutputConfigList.findIndex(x => x.output == "");
    if (this.reminderFlowform.valid || event.ruleModelName == "" || event.ruleModelName == undefined || index != -1) {
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.ruleModelName = " ";
      setTimeout(() => {
        gridData.splice(deletedata, 1)
        if (gridData.length == 1) {
          this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.oneRuleAction'));
        }
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList = [...gridData];
        if (gridData.length > 0) {
          this.settingIsRuleEngineSelectedfalse();
          this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList[this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList.length - 1].isRuleEngineActionSelected = true;
          this.ruleEngineActionDetail = this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList[this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList.length - 1]
        }
      }, 1)
    }
  }

  addRuleOutput() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      const ruleIndex = this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
      const newRow = new RuleEngineOutputConfigDto();
      const newuserList = this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList
      this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList.push({ ...newRow });
      this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList = [...newuserList];
      this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList[this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList.length - 1].pKey = 0;
      this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList[this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList.length - 1].state = DtoState.Created;
      this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList[this.followUpStepListDetail.ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList.length - 1].stopProcess = false;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRuleOutputDelete(event: RuleEngineOutputConfigDto, gridData: RuleEngineOutputConfigDto[]) {
    if (this.reminderFlowform.valid || event.output == "" || event.output == undefined) {
      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpList.items[ListIndex].followUpStepList.findIndex(x => x.isStepSelected)
      const ruleIndex = this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.output = " ";
      setTimeout(() => {
        gridData.splice(deletedata, 1)
        this.followUpList.items[ListIndex].followUpStepList[stepIndex].ruleEngineActionConfigList[ruleIndex].ruleEngineOutputConfigList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  remainderScenarioDataSelect(event: any) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.showRemainderScenarioDetail = true;
        this.settingRemainderScenarioIsSelectedFalse();
        this.remainderScenarioDetail = event;
        this.remainderScenarioDetail.isSelected = true;
        this.showRemainderScenarioStepDetail = false;
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  RSStepListDataSelection(event: any) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.showRemainderScenarioStepDetail = true;
        this.settingRemainderScenarioIsStepSelectedFalse();
        this.remainderScenarioStepListDetail = event;
        this.remainderScenarioStepListDetail.isStepSelected = true;
        if (this.remainderScenarioStepListDetail.actionList.length > 0) {
          this.settingRSIsActionSelectedFalse();
          this.remainderScenarioStepListDetail.actionList[0].action.isActionSelected = true;
          this.remainderScenarioActionDetail = this.remainderScenarioStepListDetail.actionList[0];
        }
        if (this.remainderScenarioStepListDetail.roleCreationList.length > 0) {
          this.settingRSIsRoleSelectedFalse();
          this.remainderScenarioStepListDetail.roleCreationList[0].isRoleSelected = true;
          this.remainderScenarioRoleDetail = this.remainderScenarioStepListDetail.roleCreationList[0];
        }
        if (this.remainderScenarioStepListDetail.communicationList.length > 0) {
          this.settingRSIsCommunicationSelectedFalse();
          this.remainderScenarioStepListDetail.communicationList[0].isCommunicationSelected = true;
          this.remainderScenarioCommunicationDetail = this.remainderScenarioStepListDetail.communicationList[0];
          const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == this.remainderScenarioCommunicationDetail.communication.communicationMedium?.codeId)
          if (codeTableIndex != -1) {
            this.showAttachment = true;
          }
          else {
            this.showAttachment = false;
          }
          this.remainderScenarioStepListDetail.communicationList.forEach(x => {
            const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(y => y.communicationMedium?.codeId == x.communication.communicationMedium?.codeId)
            x.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
              x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
            )
          })
        }
        else {
          this.showAttachment = false;
        }
        if (this.remainderScenarioStepListDetail.reminderDocumentList.length > 0) {
          this.remainderScenarioStepListDetail.reminderDocumentList.forEach(x => {
            const docGenTypeList: DocumentTemplateRefDto[] = this.remainderFlowScreenData.documentTemplateList.filter(y => y.documentTemplateType.codeId == x.documentConfiguration.documentTemplate.documentTemplateType.codeId)
            x.docGenTypeList = [];
            docGenTypeList.forEach(y => {
              x.docGenTypeList.push(y.docGenType)
            })
          })
        }
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  RSActionDataSelect(event: ReminderActionDto) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.settingRSIsActionSelectedFalse();
        this.remainderScenarioActionDetail = event;
        this.remainderScenarioActionDetail.action.isActionSelected = true;
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  RSCommunicationDataSelect(event: ReminderCommunicationDto) {
    if (this.reminderFlowform.valid || event.isCommunicationSelected) {
      if (event) {
        this.settingRSIsCommunicationSelectedFalse();
        this.remainderScenarioCommunicationDetail = event;
        this.remainderScenarioCommunicationDetail.isCommunicationSelected = true;
        const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == this.remainderScenarioCommunicationDetail.communication.communicationMedium?.codeId)
        if (codeTableIndex != -1) {
          this.showAttachment = true;
        }
        else {
          this.showAttachment = false;
        }
        if (this.remainderScenarioCommunicationDetail.communication.communicationMedium != null) {
          const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(x => x.communicationMedium?.codeId == this.remainderScenarioCommunicationDetail.communication.communicationMedium?.codeId)
          this.remainderScenarioCommunicationDetail.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
            x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
          )
        }
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  RSRoleDataSelect(event: ReminderRoleCreationDto) {
    if (this.reminderFlowform.valid) {
      if (event) {
        this.settingRSIsRoleSelectedFalse();
        this.remainderScenarioRoleDetail = event;
        this.remainderScenarioRoleDetail.isRoleSelected = true;
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addStatusBasedFlow() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      this.showRemainderScenarioDetail = true;
      this.settingRemainderScenarioIsSelectedFalse();
      const newRow = new ReminderScenarioDto();
      newRow.state = DtoState.Created;
      newRow.isSelected = true;
      newRow.canDeleteEnable = false;
      const newuserList = this.remainderScenarioList.items;
      newuserList.push({ ...newRow });
      this.remainderScenarioDetail = new ReminderScenarioDto;
      this.remainderScenarioList.items = [...newuserList];

      this.remainderScenarioDetail.isSelected = true;
      this.remainderScenarioDetail.pKey = 0;
      this.remainderScenarioDetail.state = DtoState.Created;
      this.remainderScenarioDetail.canDeleteEnable = true;
      this.remainderScenarioDetail.flowType = this.filter.flowType;
      this.remainderScenarioDetail.scenarioType = this.remainderFlowScreenData.scenarioTypeList.filter(x => x.codeId == 1)[0];
      this.remainderScenarioDetail.reminderScenarioPeriodBase = this.remainderFlowScreenData.reminderScenarioPeriodBaseList.filter(x => x.codeId == 1)[0];

      this.remainderScenarioList.items[this.remainderScenarioList.items.length - 1] = this.remainderScenarioDetail;
      this.showRemainderScenarioStepDetail = false;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRemainderScenarioRowDelete(event: ReminderScenarioDto, gridData: ReminderScenarioDto[]) {

    let action = -1;
    let communication = -1;
    let attachment = -1;
    let document = -1;
    let role = -1;
    let Event = -1;
    const nameIndex = event.reminderScenarioStepList.findIndex(x => x.name == "" || x.name == undefined);
    const elapsedPeriodIndex = event.reminderScenarioStepList.findIndex(x => x.elapsedPeriod == null || x.elapsedPeriod == undefined)

    event.reminderScenarioStepList?.forEach(x => {
      if (x.actionList.length > 0)
        action = x.actionList.findIndex(y => {
          return y.action.actionType == null || y.action.actionType == undefined || y.action.actionReceiverTypeName == null || y.action.actionReceiverTypeName == undefined
            || y.action.priority == null || y.action.priority == undefined || y.action.name == "" || y.action.name == undefined
        })
    });
    event.reminderScenarioStepList?.forEach(x => {
      if (x.communicationList.length > 0)
        communication = x.communicationList?.findIndex(y => {
          return y.communication.documentTemplate == null || y.communication.documentTemplate == undefined || y.communication.communicationMedium == null
            || y.communication.communicationMedium == undefined || y.communication.communicationReceiver == null || y.communication.communicationMedium == undefined
        })
    });

    event.reminderScenarioStepList?.forEach(x => x.communicationList?.forEach(y => {
      if (y.communication.attachmentList.length > 0 && attachment == -1) {
        attachment = y.communication.attachmentList.findIndex(z => z.documentTemplate == null)
      }
    }))

    event.reminderScenarioStepList?.forEach(x => {
      if (x.roleCreationList.length > 0)
        role = x.roleCreationList.findIndex(y => { return y.roleType == null || y.roleType == undefined })
    });

    event.reminderScenarioStepList?.forEach(x => {
      if (x.reminderDocumentList.length > 0)
        document = x.reminderDocumentList.findIndex(y => { return y.documentConfiguration.documentTemplate.documentTemplateType == null || y.documentConfiguration.documentTemplate.docGenType == null })
    });

    event.reminderScenarioStepList?.forEach(x => {
      if (x.followUpEventForReminderStepList.length > 0)
        Event = x.followUpEventForReminderStepList.findIndex(y => { return y.eventName == null || y.eventName == undefined })
    });
    if (this.reminderFlowform.valid || event.scenarioName == "" || event.scenarioName == undefined || nameIndex != -1 || elapsedPeriodIndex != -1 || action != -1
      || communication != -1 || role != -1 || Event != -1 || document != -1 || attachment != -1) {

      this.spinnerService.setIsLoading(true);
      this.service.deleteRemainderScenarioData(event.pKey).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList = [];
        this.filter.flowName = null as unknown as FlowNameDto;
        this.onSearch(this.filter);
      }, err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
      });
      this.settingRemainderScenarioIsSelectedFalse();
      this.remainderScenarioDetail = this.remainderScenarioList.items[this.remainderScenarioList.items.length - 1];
      this.remainderScenarioDetail.isSelected = true;
      if (this.remainderScenarioDetail.reminderScenarioStepList.length > 0) {
        this.settingRemainderScenarioIsStepSelectedFalse();
        this.showRemainderScenarioStepDetail = true;
        this.remainderScenarioDetail.reminderScenarioStepList[0].isStepSelected = true;
        this.remainderScenarioStepListDetail = this.remainderScenarioDetail.reminderScenarioStepList[0];
      }
      else {
        this.showRemainderScenarioStepDetail = false;
      }
    }
  }

  addRSStep() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      this.settingRemainderScenarioIsStepSelectedFalse();
      this.showAttachment = false;
      const newRow = new ReminderScenarioStepDto;
      newRow.isStepSelected = true;
      const newuserList = this.remainderScenarioDetail.reminderScenarioStepList;
      newuserList.push({ ...newRow });
      this.remainderScenarioStepListDetail = new ReminderScenarioStepDto
      this.remainderScenarioDetail.reminderScenarioStepList = [...newuserList];
      const index = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected)

      this.remainderScenarioStepListDetail.isStepSelected = true;
      this.remainderScenarioStepListDetail.pKey = 0;
      this.remainderScenarioStepListDetail.state = DtoState.Created;
      this.remainderScenarioStepListDetail.elapsedPeriod = 0;
      this.remainderScenarioStepListDetail.seqNr = this.remainderScenarioDetail.reminderScenarioStepList.length;
      this.remainderScenarioStepListDetail.changeDossierStatus = false;

      const listIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      this.remainderScenarioList.items[listIndex].state = DtoState.Dirty;
      this.remainderScenarioDetail.reminderScenarioStepList[index] = this.remainderScenarioStepListDetail;
      this.showRemainderScenarioStepDetail = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSStepDelete(event: ReminderScenarioStepDto, gridData: ReminderScenarioStepDto[]) {
    let attachment = -1;
    const action = event?.actionList?.findIndex(x => x.action.actionType == null || x.action.actionType == undefined || x.action.actionReceiverTypeName == null ||
      x.action.actionReceiverTypeName == undefined || x.action.priority == null || x.action.priority == undefined || x.action.name == "" || x.action.name == undefined)

    const communication = event?.communicationList?.findIndex(x => x.communication.documentTemplate == null || x.communication.documentTemplate == undefined ||
      x.communication.communicationMedium == null || x.communication.communicationMedium == undefined || x.communication.communicationReceiver == null || x.communication.communicationMedium == undefined)

    event.communicationList?.forEach(x => {
      if (x.communication.attachmentList.length > 0 && attachment == -1) {
        attachment = x.communication?.attachmentList?.findIndex(y => y.documentTemplate == null)
      }
    })

    const roleindex = event?.roleCreationList?.findIndex(x => x.roleType == null || x.roleType == undefined)
    const document = event?.reminderDocumentList?.findIndex(x => x.documentConfiguration.documentTemplate.documentTemplateType == null || x.documentConfiguration.documentTemplate.documentTemplateType == undefined
      || x.documentConfiguration.documentTemplate.docGenType == null || x.documentConfiguration.documentTemplate.docGenType == undefined)

    const eventIndex = event?.followUpEventForReminderStepList?.findIndex(x => x.eventName == null || x.eventName == undefined)

    if (this.reminderFlowform.valid || event.name == "" || event.name == undefined || event.elapsedPeriod == null || action != -1 || communication != -1 ||
      roleindex != -1 || document != -1 || eventIndex != -1 || attachment != -1) {
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      this.settingRemainderScenarioIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      gridData.splice(deletedata, 1);

      if (gridData.length > 0) {
        gridData.forEach(x => {
          if (x.seqNr > event.seqNr) {
            x.seqNr = x.seqNr - 1;
          }
        })
      }
      this.remainderScenarioList.items[ListIndex].reminderScenarioStepList = [...gridData];
      this.settingExternalErrorFalse();
      if (gridData.length == 0) {
        setTimeout(() => {
          this.showRemainderScenarioStepDetail = false;
        }, 10)
      }
      else {
        this.settingRemainderScenarioIsStepSelectedFalse();
        this.remainderScenarioDetail.reminderScenarioStepList[this.remainderScenarioDetail.reminderScenarioStepList.length - 1].isStepSelected = true;
        this.remainderScenarioStepListDetail = this.remainderScenarioDetail.reminderScenarioStepList[this.remainderScenarioDetail.reminderScenarioStepList.length - 1];
      }
    }

  }

  addRSActions() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new ReminderActionDto();
      const newuserList = this.remainderScenarioStepListDetail.actionList;
      newuserList.push({ ...newRow });
      this.remainderScenarioStepListDetail.actionList = [...newuserList];
      this.remainderScenarioActionDetail = new ReminderActionDto;
      this.settingRSIsActionSelectedFalse();
      this.remainderScenarioActionDetail.pKey = 0;
      this.remainderScenarioActionDetail.state = DtoState.Created;
      this.remainderScenarioActionDetail.action.pKey = 0;
      this.remainderScenarioActionDetail.action.state = DtoState.Created;
      this.remainderScenarioActionDetail.action.isActionSelected = true;
      this.remainderScenarioStepListDetail.actionList[this.remainderScenarioStepListDetail.actionList.length - 1] = this.remainderScenarioActionDetail;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSActionDelete(event: ReminderActionDto, gridData: ReminderActionDto[]) {
    if (this.reminderFlowform.valid || event.action.name == "" || event.action.name == undefined || event.action.actionType == null || event.action.actionReceiverTypeName == null || event.action.priority == null) {
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      this.settingRemainderScenarioIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.action.name = " "
      event.action.actionType = <CodeTable>{};
      event.action.actionReceiverTypeName = <CodeTable>{};
      event.action.priority = <CodeTable>{};
      event.action.defaultHandleTimeHours = 1;
      event.action.defaultHandleTimeMinutes = 1;
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].actionList = [...gridData];
        if (gridData.length > 0) {
          this.settingRSIsActionSelectedFalse();
          this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].actionList[this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].actionList.length - 1].action.isActionSelected = true;
          this.remainderScenarioActionDetail = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].actionList[this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].actionList.length - 1]
        }
      }, 1)
    }
  }

  addRSCommunications() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new ReminderCommunicationDto();
      const newuserList = this.remainderScenarioStepListDetail.communicationList;
      newuserList.push({ ...newRow });
      this.remainderScenarioStepListDetail.communicationList = [...newuserList];
      this.remainderScenarioCommunicationDetail = new ReminderCommunicationDto();
      this.settingRSIsCommunicationSelectedFalse();
      this.remainderScenarioCommunicationDetail.isCommunicationSelected = true;
      this.remainderScenarioCommunicationDetail.pKey = 0;
      this.remainderScenarioCommunicationDetail.state = DtoState.Created;
      this.remainderScenarioCommunicationDetail.communication.pKey = 0;
      this.remainderScenarioCommunicationDetail.communication.state = DtoState.Created;
      this.remainderScenarioStepListDetail.communicationList[this.remainderScenarioStepListDetail.communicationList.length - 1] = this.remainderScenarioCommunicationDetail;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSCommunicationDelete(event: ReminderCommunicationDto, gridData: ReminderCommunicationDto[]) {
    const attachmentIndex = event.communication.attachmentList.findIndex(x => x.documentTemplate == null)
    if (this.reminderFlowform.valid || event.communication.communicationMedium == null || event.communication.documentTemplate == null
      || event.communication.communicationReceiver == null || attachmentIndex != -1) {
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      this.settingRemainderScenarioIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.communication.communicationMedium = <CodeTable>{}
      event.communication.communicationReceiver = <CodeTable>{}
      event.communication.documentTemplate = <DocumentTemplateRefDto>{}
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList = [...gridData];
        if (this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList.length > 0) {
          this.settingRSIsCommunicationSelectedFalse();
          this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList[this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList.length - 1].isCommunicationSelected = true;
          this.remainderScenarioCommunicationDetail = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList[this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList.length - 1];
          const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == this.remainderScenarioCommunicationDetail.communication.communicationMedium?.codeId)
          if (codeTableIndex != -1) {
            this.showAttachment = true;
          }
          else {
            this.showAttachment = false;
          }
          if (this.remainderScenarioCommunicationDetail.communication.communicationMedium != null) {
            const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(x => x.communicationMedium?.codeId == this.remainderScenarioCommunicationDetail.communication.communicationMedium?.codeId)
            this.remainderScenarioCommunicationDetail.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
              x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
            )
          }
        }
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  addRSAttachment() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      const communicationIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList.findIndex(x => x.isCommunicationSelected)
      const newRow = new AttachmentDto();
      const newuserList = this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList
      this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList.push({ ...newRow });
      this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList = [...newuserList];
      this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList[this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList.length - 1].pKey = 0;
      this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList[this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList.length - 1].state = DtoState.Created;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSAttachmentDelete(event: AttachmentDto, gridData: AttachmentDto[]) {
    if (this.reminderFlowform.valid || event.documentTemplate == null || event.documentTemplate == undefined) {
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      const communicationIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList.findIndex(x => x.isCommunicationSelected)
      this.settingRemainderScenarioIsLastEditedFalse();
      this.remainderScenarioList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.documentTemplate = <DocumentTemplateRefDto>{};
      setTimeout(() => {
        gridData.splice(deletedata, 1)
        this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].communication.attachmentList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  addRSDocument() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new ReminderDocumentDto();
      const newuserList = this.remainderScenarioStepListDetail.reminderDocumentList;
      newuserList.push({ ...newRow });
      this.remainderScenarioStepListDetail.reminderDocumentList = [...newuserList];

      this.remainderScenarioStepListDetail.reminderDocumentList[this.remainderScenarioStepListDetail.reminderDocumentList.length - 1].pKey = 0;
      this.remainderScenarioStepListDetail.reminderDocumentList[this.remainderScenarioStepListDetail.reminderDocumentList.length - 1].state = DtoState.Created;
      this.remainderScenarioStepListDetail.reminderDocumentList[this.remainderScenarioStepListDetail.reminderDocumentList.length - 1].documentConfiguration.state = DtoState.Created;
      this.remainderScenarioStepListDetail.reminderDocumentList[this.remainderScenarioStepListDetail.reminderDocumentList.length - 1].documentConfiguration.documentTemplate.state = DtoState.Dirty;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSDocumentDelete(event: ReminderDocumentDto, gridData: ReminderDocumentDto[]) {
    if (this.reminderFlowform.valid || event.documentConfiguration.documentTemplate.documentTemplateType == null || event.documentConfiguration.documentTemplate.docGenType == null) {
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      this.settingRemainderScenarioIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.documentConfiguration.documentTemplate.documentTemplateType = <CodeTable>{};
      event.documentConfiguration.documentTemplate.docGenType = <CodeTable>{};
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].reminderDocumentList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  addRSRole() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new ReminderRoleCreationDto();
      const newuserList = this.remainderScenarioStepListDetail.roleCreationList;
      newuserList.push({ ...newRow });
      this.remainderScenarioStepListDetail.roleCreationList = [...newuserList];
      this.remainderScenarioRoleDetail = new ReminderRoleCreationDto;
      this.settingRSIsRoleSelectedFalse();
      this.remainderScenarioRoleDetail.pKey = 0;
      this.remainderScenarioRoleDetail.state = DtoState.Created;
      this.remainderScenarioRoleDetail.isRoleSelected = true;
      this.remainderScenarioStepListDetail.roleCreationList[this.remainderScenarioStepListDetail.roleCreationList.length - 1] = this.remainderScenarioRoleDetail;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSRoleDelete(event: ReminderRoleCreationDto, gridData: ReminderRoleCreationDto[]) {
    if (this.reminderFlowform.valid || event.roleType == null) {
      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      this.settingRemainderScenarioIsLastEditedFalse();
      this.settingIsLastEditedTrue();

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      if (gridData.length == 1) {
        event.roleType = <CodeTable>{}
      }
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].roleCreationList = [...gridData];
        if (gridData.length > 0) {
          this.settingRSIsRoleSelectedFalse();
          this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].roleCreationList[this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].roleCreationList.length - 1].isRoleSelected = true;
          this.remainderScenarioRoleDetail = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].roleCreationList[this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].roleCreationList.length - 1]
        }
      }, 1)
    }
  }

  addRSEvents() {
    if (this.reminderFlowform.valid) {
      this.settingExternalErrorFalse();
      const newRow = new FollowUpEventForReminderStepDto();
      const newuserList = this.remainderScenarioStepListDetail.followUpEventForReminderStepList
      this.remainderScenarioStepListDetail.followUpEventForReminderStepList.push({ ...newRow });
      this.remainderScenarioStepListDetail.followUpEventForReminderStepList = [...newuserList];
      this.remainderScenarioStepListDetail.followUpEventForReminderStepList[this.remainderScenarioStepListDetail.followUpEventForReminderStepList.length - 1].pKey = 0;
      this.remainderScenarioStepListDetail.followUpEventForReminderStepList[this.remainderScenarioStepListDetail.followUpEventForReminderStepList.length - 1].state = DtoState.Created;
      this.settingFollowUpDirty();
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRSEventDelete(event: FollowUpEventForReminderStepDto, gridData: FollowUpEventForReminderStepDto[]) {
    if (this.reminderFlowform.valid || event.eventName == null) {

      const ListIndex = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioList.items[ListIndex].reminderScenarioStepList.findIndex(x => x.isStepSelected)
      this.settingRemainderScenarioIsLastEditedFalse();
      this.remainderScenarioList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.eventName = <CodeTable>{}
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        event.eventName = <CodeTable>{};
        this.remainderScenarioList.items[ListIndex].reminderScenarioStepList[stepIndex].followUpEventForReminderStepList = [...gridData];
      }, 1)
    }
    else {
      this.settingExternalErrorTrue()
    }
  }

  settingIsSelectedFalse() {
    this.followUpList.items.forEach(x => x.isSelected = false);
  }

  settingIsStepSelectedFalse() {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.followUpList.items[index].followUpStepList.forEach(x => x.isStepSelected = false);
  }

  settingIsLastEditedFalse() {
    this.followUpList.items.forEach(x => x.isLastEdited = false);
  }

  settingIsActionSelectedFalse() {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpList.items[index].followUpStepList.findIndex(x => x.isStepSelected);
    this.followUpList.items[index].followUpStepList[stepIndex].actionList.forEach(x => x.isActionSelected = false)
  }

  settingIsMessageSelectedFalse() {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpList.items[index].followUpStepList.findIndex(x => x.isStepSelected);
    this.followUpList.items[index].followUpStepList[stepIndex].messageList.forEach(x => x.isMessageSelected = false);
  }

  settingIsRuleEngineSelectedfalse() {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpList.items[index].followUpStepList.findIndex(x => x.isStepSelected);
    this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList.forEach(x => x.isRuleEngineActionSelected = false);
  }

  settingRemainderScenarioIsSelectedFalse() {
    this.remainderScenarioList.items.forEach(x => x.isSelected = false);
  }

  settingRemainderScenarioIsStepSelectedFalse() {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.remainderScenarioList.items[index].reminderScenarioStepList.forEach(x => x.isStepSelected = false);
  }

  settingRSIsActionSelectedFalse() {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioList.items[index].reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList.forEach(x => x.action.isActionSelected = false)
  }

  settingRSIsCommunicationSelectedFalse() {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioList.items[index].reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList.forEach(x => x.isCommunicationSelected = false)
  }

  settingRSIsRoleSelectedFalse() {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioList.items[index].reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].roleCreationList.forEach(x => x.isRoleSelected = false)
  }

  settingRemainderScenarioIsLastEditedFalse() {
    this.remainderScenarioList.items.forEach(x => x.isLastEdited = false);
  }

  settingFollowUpDirty() {
    if (this.filter.flowType?.codeId == 2) {
      const index = this.followUpList.items.findIndex(x => x.isSelected);
      if (this.followUpList.items[index].state != DtoState.Created)
        this.followUpList.items[index].state = DtoState.Dirty;
    }
    else {
      const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      if (this.remainderScenarioList.items[index].state != DtoState.Created)
        this.remainderScenarioList.items[index].state = DtoState.Dirty;
    }
  }

  settingFollowUpStepDirty() {
    if (this.filter.flowType?.codeId == 2) {
      const index = this.followUpList.items.findIndex(x => x.isSelected);
      const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    else {
      const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
      if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].state == DtoState.Unknown)
        this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].state = DtoState.Dirty;
    }
  }

  settingIsLastEditedTrue() {
    if (this.filter.flowType?.codeId == 2) {
      const index = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[index].isLastEdited = true;
    }
    else {
      const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
      this.remainderScenarioList.items[index].isLastEdited = true;
    }
  }

  filterNames(event: any) {
    if (event) {
      this.filterName = [];

      this.remainderFlowScreenData.flowNameList
        .filter(data => {
          if (data.name?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterName.push(data);
          }
        });
    }
  }

  changeName(event: any) {
    if (event.target.value) {
      const name = this.remainderFlowScreenData.flowNameList.filter(x => {
        return x.name == event?.target?.value;
      })
      if (name[0] != null) {
        (this.filter.flowName as FlowNameDto) = name[0];
        if (name[0].isStatusBased) {
          this.filter.flowType = this.remainderFlowScreenData.flowTypeList.filter(x => x.codeId == 1)[0];
          this.showFollowUpData = false;
          this.showRemainderData = false;
          this.fluidValidation.FluidBaseValidationService.ValidationErrorList = []
          this.removeBusinesserror();
        }
        else {
          this.filter.flowType = this.remainderFlowScreenData.flowTypeList.filter(x => x.codeId == 2)[0];
          this.showFollowUpData = false;
          this.showRemainderData = false;
          this.fluidValidation.FluidBaseValidationService.ValidationErrorList = []
          this.removeBusinesserror();
        }
      }
    }
  }

  onChangeFlowType(event: any) {
    if (event?.value) {
      this.filter.flowType = event?.value;
      this.showRemainderData = false;
      this.showFollowUpData = false;
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList = []
      this.removeBusinesserror();
    }
    else {
      this.filter.flowType = null as unknown as CodeTable;
      this.showRemainderData = false;
      this.showFollowUpData = false;
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList = []
      this.removeBusinesserror();
    }
  }

  //FollowUp Change Event
  onChangeFlowName(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    this.settingFollowUpDirty();
    this.followUpList.items[index].name = event.target?.value;
    this.followUpDetail.name = event.target?.value;
    if (event.target?.value == "") {
      this.FlowNameTextBoxconfig.externalError = true;
    }
  }

  onChangeStartTriggerEvent(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    this.settingFollowUpDirty();
    this.followUpList.items[index].startTriggerEvent = event?.value;
    this.followUpDetail.startTriggerEvent = event?.value;
  }

  onChangeStopTriggerEvent(event: any, stopEventIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpProcedure2StopEventList[stopEventIndex].stopTriggerEvent = event.value;
      if (this.followUpList.items[index].followUpProcedure2StopEventList[stopEventIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpProcedure2StopEventList[stopEventIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpProcedure2StopEventList[stopEventIndex].stopTriggerEvent = event.value;
    this.followUpDetail.followUpProcedure2StopEventList[stopEventIndex].isReadOnly = true;
  }

  onChangeStepname(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].name = event.target?.value;
    this.followUpDetail.followUpStepList[stepIndex].name = event.target?.value;
    this.followUpStepListDetail.name = event.target?.value;
    if (event.target?.value == "") {
      this.NameTextBoxconfig.externalError = true;
    }
  }

  onChangeTriggerEvent(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].triggerEvent = event.value;
    this.followUpDetail.followUpStepList[stepIndex].triggerEvent = event.value;
    this.followUpStepListDetail.triggerEvent = event.value;
    if (event.value == null) {
      this.TriggerEventDropdownConfig.externalError = true;
    }
  }

  onChangeElapsedPeriodType(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].elapsedPeriodType = event.value;
    this.followUpDetail.followUpStepList[stepIndex].elapsedPeriodType = event.value;
    this.followUpStepListDetail.elapsedPeriodType = event.value;
  }

  onChangeElapsedPeriod(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    if (event) {
      this.followUpList.items[index].followUpStepList[stepIndex].elapsedPeriod = parseInt(event);
      this.followUpDetail.followUpStepList[stepIndex].elapsedPeriod = parseInt(event);
      this.followUpStepListDetail.elapsedPeriod = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.elapsedPeriodTextBoxconfig.externalError = true;
      }
      else {
        this.elapsedPeriodTextBoxconfig.externalError = false;
      }
    }
    else {
      this.followUpList.items[index].followUpStepList[stepIndex].elapsedPeriod = event;
      this.followUpDetail.followUpStepList[stepIndex].elapsedPeriod = event;
      this.followUpStepListDetail.elapsedPeriod = event;
      this.elapsedPeriodTextBoxconfig.externalError = true;
    }
  }

  onChangeStatus(event: boolean) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].changeStatus = event;
    this.followUpDetail.followUpStepList[stepIndex].changeStatus = event;
    this.followUpStepListDetail.changeStatus = event;
    if (event) {
      this.followUpList.items[index].followUpStepList[stepIndex].enableTargetState = true
      this.followUpDetail.followUpStepList[stepIndex].enableTargetState = true
      if (this.followUpDetail.followUpStepList[stepIndex].stateStep == null) {
        this.followUpDetail.followUpStepList[stepIndex].stateStep = new StateStepDto
      }
      this.followUpDetail.followUpStepList[stepIndex].stateStep.targetStateStatusName = this.remainderFlowScreenData.followUpCaseStatusList[0]
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep.targetStateStatusName = this.remainderFlowScreenData.followUpCaseStatusList[0]
    }
    else {
      this.followUpList.items[index].followUpStepList[stepIndex].enableTargetState = false
      this.followUpDetail.followUpStepList[stepIndex].enableTargetState = false
      this.followUpDetail.followUpStepList[stepIndex].stateStep.targetStateStatusName = new CodeTable
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep.targetStateStatusName = new CodeTable
    }
  }

  onChangeTargetStateStatusName(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty()
    if (this.followUpList.items[index].followUpStepList[stepIndex].stateStep.state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep.state = DtoState.Dirty;
    }


    this.followUpList.items[index].followUpStepList[stepIndex].stateStep.targetStateStatusName = event.value;
    this.followUpDetail.followUpStepList[stepIndex].stateStep.targetStateStatusName = event.value;
    this.followUpStepListDetail.stateStep.targetStateStatusName = event.value;
    if (event.value == null) {
      this.followUpList.items[index].followUpStepList[stepIndex].changeStatus = false
      this.followUpDetail.followUpStepList[stepIndex].changeStatus = false
      this.followUpStepListDetail.changeStatus = false;
      this.followUpList.items[index].followUpStepList[stepIndex].enableTargetState = false
      this.followUpDetail.followUpStepList[stepIndex].enableTargetState = false
    }

  }

  onChangeHandlingDateType(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].handlingDateType = event.value;
    this.followUpDetail.followUpStepList[stepIndex].handlingDateType = event.value;
    this.followUpStepListDetail.handlingDateType = event.value;
  }

  onChangeIntervalMeasure(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].intervalMeasure = event.value;
    this.followUpDetail.followUpStepList[stepIndex].intervalMeasure = event.value;
    this.followUpStepListDetail.intervalMeasure = event.value;
  }

  settingActionDirty() {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    if (this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].state != DtoState.Created) {
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].state = DtoState.Dirty;
    }
  }

  onChangeActionName(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].name = event?.target?.value;
    this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].name = event?.target?.value;
    this.followUpStepListDetail.actionList[actionIndex].name = event?.target?.value;
    this.actiondetail.name = event?.target?.value;
    if (event?.target?.value == "") {
      this.ActionNameTextBoxconfig.externalError = true;
    }
  }

  onChangeActionType(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].actionType = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].actionType = event?.value;
    this.followUpStepListDetail.actionList[actionIndex].actionType = event?.value;
    this.actiondetail.actionType = event?.value;
    if (event?.value == null) {
      this.ActionTypeDropdownConfig.externalError = true;
    }
  }

  onChangeDefaultHandleTimeDays(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    if (event) {
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeDays = parseInt(event);
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeDays = parseInt(event);
      this.followUpStepListDetail.actionList[actionIndex].defaultHandleTimeDays = parseInt(event);
      this.actiondetail.defaultHandleTimeDays = parseInt(event);
    }
    else {
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeDays = event;
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeDays = event;
      this.followUpStepListDetail.actionList[actionIndex].defaultHandleTimeDays = event;
      this.actiondetail.defaultHandleTimeDays = event;
    }
  }

  onChangeDefaultHandleHoursDays(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    if (event && event != "0") {
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeHours = parseInt(event);
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeHours = parseInt(event);
      this.followUpStepListDetail.actionList[actionIndex].defaultHandleTimeHours = parseInt(event);
      this.actiondetail.defaultHandleTimeHours = parseInt(event);
      if (parseInt(event) > 23) {
        this.HoursTextBoxconfig.externalError = true;
      }
      else {
        this.HoursTextBoxconfig.externalError = false;
      }
    }
    else {
      if (event == "0") {
        this.HoursTextBoxconfig.externalError = true;
      }
      else {
        this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeHours = event;
        this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeHours = event;
        this.followUpStepListDetail.actionList[actionIndex].defaultHandleTimeHours = event;
        this.actiondetail.defaultHandleTimeHours = event;
      }
    }
  }

  onChangeDefaultHandleTimeeMinutes(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    if (event && event != "0") {
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeMinutes = parseInt(event);
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeMinutes = parseInt(event);
      this.followUpStepListDetail.actionList[actionIndex].defaultHandleTimeMinutes = parseInt(event);
      this.actiondetail.defaultHandleTimeMinutes = parseInt(event);
      if (parseInt(event) > 59) {
        this.MinutesTextBoxconfig.externalError = true;
      }
      else {
        this.MinutesTextBoxconfig.externalError = false;
      }
    }
    else {
      if (event == "0") {
        this.MinutesTextBoxconfig.externalError = true;
      }
      else {
        this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeMinutes = event;
        this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleTimeMinutes = event;
        this.followUpStepListDetail.actionList[actionIndex].defaultHandleTimeMinutes = event;
        this.actiondetail.defaultHandleTimeMinutes = event;
      }
    }
  }

  onChangeDefaultHandleMargin(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    if (event) {
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleMargin = parseInt(event);
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleMargin = parseInt(event);
      this.followUpStepListDetail.actionList[actionIndex].defaultHandleMargin = parseInt(event);
      this.actiondetail.defaultHandleMargin = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleMargin = null;
          this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleMargin = null;
          this.followUpStepListDetail.actionList[actionIndex].defaultHandleMargin = null;
          this.actiondetail.defaultHandleMargin = null;
        }, 1)
      }
    }
    else {
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].defaultHandleMargin = event;
      this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].defaultHandleMargin = event;
      this.followUpStepListDetail.actionList[actionIndex].defaultHandleMargin = event;
      this.actiondetail.defaultHandleMargin = event;
    }
  }

  onChangeActionReceiverTypeName(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].actionReceiverTypeName = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].actionReceiverTypeName = event?.value;
    this.followUpStepListDetail.actionList[actionIndex].actionReceiverTypeName = event?.value;
    this.actiondetail.actionReceiverTypeName = event?.value;
    if (event?.value == null) {
      this.ActionReceiverDropdownConfig.externalError = true;
    }
  }

  onChangePriority(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.followUpDetail.followUpStepList[stepIndex].actionList.findIndex(x => x.isActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingActionDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].priority = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].priority = event?.value;
    this.followUpStepListDetail.actionList[actionIndex].priority = event?.value;
    this.actiondetail.priority = event?.value;
    if (event?.value == null) {
      this.PriorityDropdownConfig.externalError = true;
    }
  }

  onChangeReferenceType(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.referenceType = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.referenceType = event?.value;
    this.followUpStepListDetail.messageList[listIndex].communication.referenceType = event?.value;
  }

  onChangeCommunicationMedium(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.communicationMedium = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.communicationMedium = event?.value;
    this.followUpStepListDetail.messageList[listIndex].communication.communicationMedium = event?.value;
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.documentTemplate = null as unknown as DocumentTemplateRefDto;
    const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == event?.value?.codeId)
    if (codeTableIndex != -1) {
      this.showAttachment = true;
    }
    else {
      this.showAttachment = false;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.attachmentList = [];
    }
    if (event?.value != null) {
      const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(x => x.communicationMedium?.codeId == event?.value?.codeId)
      this.communicationDetail.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
        x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
      )
    } else {
      this.communicationDetail.communication.documentTemplateList = [];
    }
    if (event?.value == null) {
      this.CommunicationMediumDropdownConfig.externalError = true;
    }
  }

  onChangeDocumentTemplate(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.documentTemplate = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.documentTemplate = event?.value;
    this.followUpStepListDetail.messageList[listIndex].communication.documentTemplate = event?.value;
    if (event?.value == null) {
      this.DocumentTemplateTypeDropdownConfig.externalError = true;
    }
  }

  onChangeCommunicationReceiver(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.communicationReceiver = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.communicationReceiver = event?.value;
    this.followUpStepListDetail.messageList[listIndex].communication.communicationReceiver = event?.value;
    if (event?.value == null) {
      this.CommunicationReceiverDropdownConfig.externalError = true;
    }
  }

  onChangeReceiverType(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.receiverType = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.receiverType = event?.value;
    this.followUpStepListDetail.messageList[listIndex].communication.receiverType = event?.value;
  }

  onChangeAddressType(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.addressType = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.addressType = event?.value;
    this.followUpStepListDetail.messageList[listIndex].communication.addressType = event?.value;
  }

  onChangeRegisteredLetter(event: boolean, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[listIndex].communication.registeredLetter = event;
    this.followUpDetail.followUpStepList[stepIndex].messageList[listIndex].communication.registeredLetter = event;
    this.followUpStepListDetail.messageList[listIndex].communication.registeredLetter = event;
  }

  onChangeAttachmentType(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const messageIndex = this.followUpDetail.followUpStepList[stepIndex].messageList.findIndex(x => x.isMessageSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[messageIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[messageIndex].state = DtoState.Dirty
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[messageIndex].communication.state = DtoState.Dirty
    }
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[messageIndex].communication.attachmentList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[messageIndex].communication.attachmentList[listIndex].state = DtoState.Dirty;
    }
    this.followUpList.items[index].followUpStepList[stepIndex].messageList[messageIndex].communication.attachmentList[listIndex].documentTemplate = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].messageList[messageIndex].communication.attachmentList[listIndex].documentTemplate = event?.value;
    this.followUpStepListDetail.messageList[messageIndex].communication.attachmentList[listIndex].documentTemplate = event?.value;
    if (event?.value == null) {
      this.AttachmentTypeDropdownConfig.externalError = true;
    }
  }

  onChangeServiceActionName(event: string, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].name = event;
    this.followUpDetail.followUpStepList[stepIndex].serviceActionList[listIndex].name = event;
    this.followUpStepListDetail.serviceActionList[listIndex].name = event;
    if (event == "") {
      this.ServiceActionNameTextBoxconfig.externalError = true;
    }
  }

  onChangeServiceAction(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].serviceAction = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].serviceActionList[listIndex].serviceAction = event?.value;
    this.followUpStepListDetail.serviceActionList[listIndex].serviceAction = event?.value;
    if (event?.value == null) {
      this.ServiceActionDropdownConfig.externalError = true;
    }
  }

  onChangeIsBlocking(event: boolean, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[listIndex].isBlocking = event;
    this.followUpDetail.followUpStepList[stepIndex].serviceActionList[listIndex].isBlocking = event;
    this.followUpStepListDetail.serviceActionList[listIndex].isBlocking = event;
  }

  onChangeFollowUpEvent(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].followUpStepEventList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].followUpStepEventList[listIndex].state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].followUpStepEventList[listIndex].event = event?.value;
    this.followUpDetail.followUpStepList[stepIndex].followUpStepEventList[listIndex].event = event?.value;
    this.followUpStepListDetail.followUpStepEventList[listIndex].event = event?.value;
    if (event?.value == null) {
      this.FollowUpEventDropdownConfig.externalError = true;
    }
  }

  settingRuleActionDirty() {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const RuleIndex = this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
    if (this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].state = DtoState.Dirty
    }
  }

  onChangeRuleModelName(event: string) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const RuleIndex = this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRuleActionDirty();
    this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleModelName = event;
    this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleModelName = event;
    this.followUpStepListDetail.ruleEngineActionConfigList[RuleIndex].ruleModelName = event;
    if (event == "") {
      this.RuleModelNameTextBoxconfig.externalError = true;
    }
  }

  onChangeOutputName(event: string, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const RuleIndex = this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRuleActionDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].output = event;
    this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].output = event;
    this.followUpStepListDetail.ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].output = event;
    this.ruleEngineActionDetail.ruleEngineOutputConfigList[listIndex].output = event;
    if (event == "") {
      this.RuleOutputTextBoxconfig.externalError = true;
    }
  }

  onChangeStepNr(event: any, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const RuleIndex = this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRuleActionDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].state = DtoState.Dirty
    }
    if (event) {
      this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = parseInt(event);
      this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = parseInt(event);
      this.followUpStepListDetail.ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = parseInt(event);
      this.ruleEngineActionDetail.ruleEngineOutputConfigList[listIndex].stepNr = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = null;
          this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = null;
          this.followUpStepListDetail.ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = null;
          this.ruleEngineActionDetail.ruleEngineOutputConfigList[listIndex].stepNr = null;
        }, 1)
      }
    }
    else {
      this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = event;
      this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = event;
      this.followUpStepListDetail.ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stepNr = event;
      this.ruleEngineActionDetail.ruleEngineOutputConfigList[listIndex].stepNr = event;
    }
  }

  onChangeStopProcess(event: boolean, listIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    const RuleIndex = this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList.findIndex(x => x.isRuleEngineActionSelected)
    this.settingIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRuleActionDirty();
    if (this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].state != DtoState.Created) {
      this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].state = DtoState.Dirty
    }
    this.followUpList.items[index].followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stopProcess = event;
    this.followUpDetail.followUpStepList[stepIndex].ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stopProcess = event;
    this.followUpStepListDetail.ruleEngineActionConfigList[RuleIndex].ruleEngineOutputConfigList[listIndex].stopProcess = event;
    this.ruleEngineActionDetail.ruleEngineOutputConfigList[listIndex].stopProcess = event;
  }

  //RS Change Event

  onChangeRSScenarioName(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    this.settingFollowUpDirty();
    this.remainderScenarioList.items[index].scenarioName = event.target?.value;
    this.remainderScenarioDetail.scenarioName = event.target?.value;
    if (event.target?.value == "") {
      this.RSNameTextBoxconfig.externalError = true;
    }
  }

  OnChangeRSStepName(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].name = event.target?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].name = event.target?.value;
    this.remainderScenarioStepListDetail.name = event.target?.value;
    if (event.target?.value == "") {
      this.RSStepNameTextBoxconfig.externalError = true;
    }
  }

  onChangeMinDueAmount(event: any, isChanged: boolean) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].minDueAmount = parseFloat(floatValue);
        this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].minDueAmount = parseFloat(floatValue);
        this.remainderScenarioStepListDetail.minDueAmount = parseFloat(floatValue);
      }
    }
    else {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].minDueAmount = null as unknown as number;
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].minDueAmount = null as unknown as number;
      this.remainderScenarioStepListDetail.minDueAmount = null as unknown as number;
    }
  }

  onChangeRSElapsedPeriodType(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].elapsedPeriodType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].elapsedPeriodType = event?.value;
    this.remainderScenarioStepListDetail.elapsedPeriodType = event?.value;
  }

  onChangeRSElapsedPeriod(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    if (event) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].elapsedPeriod = parseInt(event);
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].elapsedPeriod = parseInt(event);
      this.remainderScenarioStepListDetail.elapsedPeriod = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.RSElapsedPeriodTextBoxconfig.externalError = true;
      }
      else {
        this.RSElapsedPeriodTextBoxconfig.externalError = false;
      }
    }
    else {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].elapsedPeriod = event;
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].elapsedPeriod = event;
      this.remainderScenarioStepListDetail.elapsedPeriod = event;
      this.RSElapsedPeriodTextBoxconfig.externalError = true;
    }
  }

  onChangeRSDossierStatus(event: boolean) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].changeDossierStatus = event;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].changeDossierStatus = event;
    this.remainderScenarioStepListDetail.changeDossierStatus = event;
  }

  onChangeRSTargetDossierStatus(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue();
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingFollowUpDirty();
    this.settingFollowUpStepDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].targetDossierStatus = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].targetDossierStatus = event?.value;
    this.remainderScenarioStepListDetail.targetDossierStatus = event?.value;
  }

  settingRSActionDirty() {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.state = DtoState.Dirty
    }
  }

  onChangeRSActionName(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.name = event?.target?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.name = event?.target?.value;
    this.remainderScenarioStepListDetail.actionList[actionIndex].action.name = event?.target?.value;
    this.remainderScenarioActionDetail.action.name = event?.target?.value;
    if (event?.target?.value == "") {
      this.RSActionNameTextBoxconfig.externalError = true;
    }
  }

  onChangeRSActionType(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.actionType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.actionType = event?.value;
    this.remainderScenarioStepListDetail.actionList[actionIndex].action.actionType = event?.value;
    this.remainderScenarioActionDetail.action.actionType = event?.value;
    if (event?.value == null) {
      this.RSActionTypeDropdownConfig.externalError = true;
    }
  }

  onChangeRSDefaultHandleTimeDays(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    if (event) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeDays = parseInt(event);
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeDays = parseInt(event);
      this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleTimeDays = parseInt(event);
      this.remainderScenarioActionDetail.action.defaultHandleTimeDays = parseInt(event);
    }
    else {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeDays = event;
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeDays = event;
      this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleTimeDays = event;
      this.remainderScenarioActionDetail.action.defaultHandleTimeDays = event;
    }
  }

  onChangeRSDefaultHandleTimeHours(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    if (event || event != "0") {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeHours = parseInt(event);
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeHours = parseInt(event);
      this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleTimeHours = parseInt(event);
      this.remainderScenarioActionDetail.action.defaultHandleTimeHours = parseInt(event);
      if (parseInt(event) > 23) {
        this.HoursTextBoxconfig.externalError = true;
      }
      else {
        this.HoursTextBoxconfig.externalError = false;
      }
    }
    else {
      if (event == "0") {
        this.HoursTextBoxconfig.externalError = true;
      }
      else {
        this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeHours = event;
        this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeHours = event;
        this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleTimeHours = event;
        this.remainderScenarioActionDetail.action.defaultHandleTimeHours = event;
      }
    }
  }

  onChangeRSDefaultHandleTimeMinutes(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    if (event || event != "0") {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeMinutes = parseInt(event);
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeMinutes = parseInt(event);
      this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleTimeMinutes = parseInt(event);
      this.remainderScenarioActionDetail.action.defaultHandleTimeMinutes = parseInt(event);
      if (parseInt(event) > 59) {
        this.MinutesTextBoxconfig.externalError = true;
      }
      else {
        this.MinutesTextBoxconfig.externalError = false;
      }
    }
    else {
      if (event == "0") {
        this.MinutesTextBoxconfig.externalError = true;
      }
      else {
        this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeMinutes = event;
        this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleTimeMinutes = event;
        this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleTimeMinutes = event;
        this.remainderScenarioActionDetail.action.defaultHandleTimeMinutes = event;
      }
    }
  }

  onChangeRSDefaultHandleMargin(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    if (event) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleMargin = parseInt(event);
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleMargin = parseInt(event);
      this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleMargin = parseInt(event);
      this.remainderScenarioActionDetail.action.defaultHandleMargin = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleMargin = null;
          this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleMargin = null;
          this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleMargin = null;
          this.remainderScenarioActionDetail.action.defaultHandleMargin = null;
        }, 1)
      }
    }
    else {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleMargin = event;
      this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.defaultHandleMargin = event;
      this.remainderScenarioStepListDetail.actionList[actionIndex].action.defaultHandleMargin = event;
      this.remainderScenarioActionDetail.action.defaultHandleMargin = event;
    }
  }

  onChangeRSActionReceiverTypeName(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.settingRSActionDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.actionReceiverTypeName = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.actionReceiverTypeName = event?.value;
    this.remainderScenarioStepListDetail.actionList[actionIndex].action.actionReceiverTypeName = event?.value;
    this.remainderScenarioActionDetail.action.actionReceiverTypeName = event?.value;
    if (event?.value == null) {
      this.RSActionReceiverDropdownConfig.externalError = true;
    }
  }

  onChangeRSPriority(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const actionIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList.findIndex(x => x.action.isActionSelected)
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].actionList[actionIndex].action.priority = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].actionList[actionIndex].action.priority = event?.value;
    this.remainderScenarioStepListDetail.actionList[actionIndex].action.priority = event?.value;
    this.remainderScenarioActionDetail.action.priority = event?.value;
    if (event?.value == null) {
      this.RSPriorityDropdownConfig.externalError = true;
    }
  }

  onChangeRSReferenceType(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.referenceType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.referenceType = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.referenceType = event?.value;
  }

  onChangeRSCommunicationMedium(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.communicationMedium = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.communicationMedium = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.communicationMedium = event?.value;
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.documentTemplate = null as unknown as DocumentTemplateRefDto;
    const codeTableIndex = this.attachmentVisibility.codetableParameterItemList.findIndex(x => x.codetableValue == event?.value?.codeId)
    if (codeTableIndex != -1) {
      this.showAttachment = true;
    }
    else {
      this.showAttachment = false;
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.attachmentList = [];
    }
    if (event?.value != null) {
      const cmIndex = this.remainderFlowScreenData.communicationMedium2DocumentTemplateList.findIndex(x => x.communicationMedium?.codeId == event?.value?.codeId)
      this.remainderScenarioCommunicationDetail.communication.documentTemplateList = this.remainderFlowScreenData.documentTemplateList.filter(x =>
        x.documentTemplateType?.codeId == this.remainderFlowScreenData.communicationMedium2DocumentTemplateList[cmIndex].documentTemplate?.codeId
      )
    }
    else {
      this.remainderScenarioCommunicationDetail.communication.documentTemplateList = [];
    }
    if (event?.value == null) {
      this.RSCommunicationMediumDropdownConfig.externalError = true;
    }
  }

  onChangeRSDocumentTemplate(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.documentTemplate = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.documentTemplate = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.documentTemplate = event?.value;
    if (event?.value == null) {
      this.RSTemplateNameDropdownConfig.externalError = true;
    }
  }

  onChangeRSFallbackMechanism(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.fallbackMechanism = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.fallbackMechanism = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.fallbackMechanism = event?.value;
  }

  onChangeRSCommunicationReceiver(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.communicationReceiver = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.communicationReceiver = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.communicationReceiver = event?.value;
    if (event?.value == null) {
      this.RSCommunicationReceiverDropdownConfig.externalError = true;
    }
  }

  onChangeRSReceiverType(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.receiverType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.receiverType = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.receiverType = event?.value;
  }

  onChangeRSRegisteredLetter(event: boolean, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.registeredLetter = event;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.registeredLetter = event;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.registeredLetter = event;
  }

  onChangeRSAddressType(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.addressType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[listIndex].communication.addressType = event?.value;
    this.remainderScenarioStepListDetail.communicationList[listIndex].communication.addressType = event?.value;
  }

  onChangeRSAttachmentType(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const communicationIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList.findIndex(x => x.isCommunicationSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].communication.state = DtoState.Dirty
    }
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].communication.attachmentList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].communication.attachmentList[listIndex].state = DtoState.Dirty;
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].communicationList[communicationIndex].communication.attachmentList[listIndex].documentTemplate = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].communicationList[communicationIndex].communication.attachmentList[listIndex].documentTemplate = event?.value;
    this.remainderScenarioStepListDetail.communicationList[communicationIndex].communication.attachmentList[listIndex].documentTemplate = event?.value;
    if (event?.value == null) {
      this.RSAttachmentTypeDropdownConfig.externalError = true;
    }
  }

  onChangeRSEventName(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].followUpEventForReminderStepList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].followUpEventForReminderStepList[listIndex].state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].followUpEventForReminderStepList[listIndex].eventName = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].followUpEventForReminderStepList[listIndex].eventName = event?.value;
    this.remainderScenarioStepListDetail.followUpEventForReminderStepList[listIndex].eventName = event?.value;
    if (event?.value == null) {
      this.RSFollowUpEventDropdownConfig.externalError = true;
    }
  }

  onChangeRSDocumentTemplateType(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.documentTemplate.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.documentTemplate.documentTemplateType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.documentTemplate.documentTemplateType = event?.value;
    this.remainderScenarioStepListDetail.reminderDocumentList[listIndex].documentConfiguration.documentTemplate.documentTemplateType = event?.value;
    if (event?.value != null) {
      const docGenType: DocumentTemplateRefDto[] = this.remainderFlowScreenData.documentTemplateList.filter(x => x.documentTemplateType.codeId == event?.value.codeId)
      docGenType.forEach(x => {
        this.remainderScenarioStepListDetail.reminderDocumentList[listIndex].docGenTypeList.push(x.docGenType)
      })
    }
    else {
      this.remainderScenarioStepListDetail.reminderDocumentList[listIndex].docGenTypeList = [];
    }
    if (event?.value == null) {
      this.DocumentTemplateTypeDropdownConfig.externalError = true;
    }
  }

  onChangeRSDocGenType(event: any, listIndex: number) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.state = DtoState.Dirty
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.documentTemplate.state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.documentTemplate.docGenType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].reminderDocumentList[listIndex].documentConfiguration.documentTemplate.docGenType = event?.value;
    this.remainderScenarioStepListDetail.reminderDocumentList[listIndex].documentConfiguration.documentTemplate.docGenType = event?.value;
    //this.remainderScenarioStepListDetail.reminderDocumentList[listIndex].documentConfiguration.documentTemplate.name = event?.value?.name;
    //this.remainderScenarioStepListDetail.reminderDocumentList[listIndex].documentConfiguration.documentTemplate.pKey = event?.value?.pKey;
    if (event?.value == null) {
      this.DocGenTypeDropdownConfig.externalError = true;
    }
  }

  onChangeRSRoleType(event: any) {
    const index = this.remainderScenarioList.items.findIndex(x => x.isSelected);
    const stepIndex = this.remainderScenarioDetail.reminderScenarioStepList.findIndex(x => x.isStepSelected);
    const roleIndex = this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].roleCreationList.findIndex(x => x.isRoleSelected);
    this.settingRemainderScenarioIsLastEditedFalse();
    this.settingIsLastEditedTrue()
    this.settingFollowUpDirty()
    this.settingFollowUpStepDirty();
    if (this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].roleCreationList[roleIndex].state != DtoState.Created) {
      this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].roleCreationList[roleIndex].state = DtoState.Dirty
    }
    this.remainderScenarioList.items[index].reminderScenarioStepList[stepIndex].roleCreationList[roleIndex].roleType = event?.value;
    this.remainderScenarioDetail.reminderScenarioStepList[stepIndex].roleCreationList[roleIndex].roleType = event?.value;
    this.remainderScenarioStepListDetail.roleCreationList[roleIndex].roleType = event?.value;
    this.remainderScenarioRoleDetail.roleType = event?.value;
    if (event?.value == null) {
      this.RSRoleTypeDropdownConfig.externalError = true;
    }
  }

  onClear() {
    this.filter.flowName = null as unknown as FlowNameDto;
    this.filter.flowType = null as unknown as CodeTable;
    this.settingExternalErrorFalse();
    this.showFollowUpData = false;
    this.showRemainderData = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    if (this.filter?.flowType?.codeId == 2) {
      const updated = this.followUpList.items.findIndex(x => x.state == 1 || x.state == 3 || x.isLastEdited);
      if (updated != -1)
        this.showDialog = true;
      else
        window.location.assign(this.navigateUrl);
    }
    else if (this.filter?.flowType?.codeId == 1) {
      const updated = this.remainderScenarioList.items.findIndex(x => x.state == 1 || x.state == 3 || x.isLastEdited);
      if (updated != -1)
        this.showDialog = true;
      else
        window.location.assign(this.navigateUrl);
    }
    else {
      window.location.assign(this.navigateUrl);
    }
  }

  onClickYes(saveData: any) {
    this.showDialog = false;
    this.onSave(saveData);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.removeBusinesserror();
    this.settingExternalErrorFalse();
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }

  onClickCancel() {
    this.showDialog = false;
  }

  removeBusinesserror() {
    this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.oneRuleAction'));
    this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.oneRuleOutput'));
    this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.fillStepNr'));
    this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.noFillStepNr'));
    this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.StepBeforeNotAllowed'));
    this.RemoveBusinessError(this.translate.instant('plan.flow.businessError.matchingFollowUpStep'));
  }

  settingExternalErrorTrue() {
    this.FlowNameTextBoxconfig.externalError = true;
    this.NameTextBoxconfig.externalError = true;
    this.TriggerEventDropdownConfig.externalError = true;
    this.elapsedPeriodTextBoxconfig.externalError = true;
    this.ActionNameTextBoxconfig.externalError = true;
    this.ActionReceiverDropdownConfig.externalError = true;
    this.ActionTypeDropdownConfig.externalError = true;
    this.PriorityDropdownConfig.externalError = true;
    this.TemplateNameDropdownConfig.externalError = true;
    this.CommunicationMediumDropdownConfig.externalError = true;
    this.CommunicationReceiverDropdownConfig.externalError = true;
    this.ServiceActionDropdownConfig.externalError = true;
    this.ServiceActionNameTextBoxconfig.externalError = true;
    this.FollowUpEventDropdownConfig.externalError = true;
    this.RuleModelNameTextBoxconfig.externalError = true;
    this.RuleOutputTextBoxconfig.externalError = true;
    this.AttachmentTypeDropdownConfig.externalError = true;

    this.RSNameTextBoxconfig.externalError = true;
    this.RSStepNameTextBoxconfig.externalError = true;
    this.RSElapsedPeriodTextBoxconfig.externalError = true;
    this.RSMinDueAmountTestBoxconfig.externalError = true;
    this.RSElapsedPeriodDropdownconfig.externalError = true;
    this.RSActionNameTextBoxconfig.externalError = true;
    this.RSActionReceiverDropdownConfig.externalError = true;
    this.RSActionTypeDropdownConfig.externalError = true;
    this.RSPriorityDropdownConfig.externalError = true;
    this.RSTemplateNameDropdownConfig.externalError = true;
    this.RSCommunicationMediumDropdownConfig.externalError = true;
    this.RSCommunicationReceiverDropdownConfig.externalError = true;
    this.RSRoleTypeDropdownConfig.externalError = true;
    this.DocumentTemplateTypeDropdownConfig.externalError = true;
    this.DocGenTypeDropdownConfig.externalError = true;
    this.RSFollowUpEventDropdownConfig.externalError = true;
    this.RSAttachmentTypeDropdownConfig.externalError = true;
  }

  settingExternalErrorFalse() {
    this.FlowNameTextBoxconfig.externalError = false;
    this.NameTextBoxconfig.externalError = false;
    this.TriggerEventDropdownConfig.externalError = false;
    this.elapsedPeriodTextBoxconfig.externalError = false;
    this.ActionNameTextBoxconfig.externalError = false
    this.ActionReceiverDropdownConfig.externalError = false;
    this.ActionTypeDropdownConfig.externalError = false;
    this.PriorityDropdownConfig.externalError = false;
    this.TemplateNameDropdownConfig.externalError = false;
    this.CommunicationMediumDropdownConfig.externalError = false;
    this.CommunicationReceiverDropdownConfig.externalError = false;
    this.ServiceActionDropdownConfig.externalError = false;
    this.ServiceActionNameTextBoxconfig.externalError = false;
    this.FollowUpEventDropdownConfig.externalError = false;
    this.RuleModelNameTextBoxconfig.externalError = false;
    this.RuleOutputTextBoxconfig.externalError = false;
    this.AttachmentTypeDropdownConfig.externalError = false;

    this.RSNameTextBoxconfig.externalError = false;
    this.RSStepNameTextBoxconfig.externalError = false;
    this.RSElapsedPeriodTextBoxconfig.externalError = false;
    this.RSMinDueAmountTestBoxconfig.externalError = false;
    this.RSElapsedPeriodDropdownconfig.externalError = false;
    this.RSActionNameTextBoxconfig.externalError = false;
    this.RSActionReceiverDropdownConfig.externalError = false;
    this.RSActionTypeDropdownConfig.externalError = false;
    this.RSPriorityDropdownConfig.externalError = false;
    this.RSTemplateNameDropdownConfig.externalError = false;
    this.RSCommunicationMediumDropdownConfig.externalError = false;
    this.RSCommunicationReceiverDropdownConfig.externalError = false;
    this.RSRoleTypeDropdownConfig.externalError = false;
    this.DocumentTemplateTypeDropdownConfig.externalError = false;
    this.DocGenTypeDropdownConfig.externalError = false;
    this.RSFollowUpEventDropdownConfig.externalError = false;
    this.RSAttachmentTypeDropdownConfig.externalError = false;
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList?.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage
      })
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
      }
    }
    else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService?.ValidationErrorList?.length > 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
        const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
          .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
        if (Index >= 0) {
          this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
        }
      })
    }
  }


  buildConfiguration() {
    const flowNameError = new ErrorDto;
    flowNameError.validation = "required";
    flowNameError.isModelError = true;
    flowNameError.validationMessage = this.translate.instant('plan.flow.validation.name');
    this.FlowNameTextBoxconfig.required = true;
    this.FlowNameTextBoxconfig.Errors = [flowNameError];

    const nameError = new ErrorDto;
    nameError.validation = "required";
    nameError.isModelError = true;
    nameError.validationMessage = this.translate.instant('plan.flow.validation.name');
    this.NameTextBoxconfig.required = true;
    this.NameTextBoxconfig.Errors = [nameError];

    const triggerEventError = new ErrorDto;
    triggerEventError.validation = "required";
    triggerEventError.isModelError = true;
    triggerEventError.validationMessage = this.translate.instant('plan.flow.validation.triggerEvent');
    this.TriggerEventDropdownConfig.required = true;
    this.TriggerEventDropdownConfig.Errors = [triggerEventError];

    const elapsedPeriodError = new ErrorDto;
    elapsedPeriodError.validation = "required";
    elapsedPeriodError.isModelError = true;
    elapsedPeriodError.validationMessage = this.translate.instant('plan.flow.validation.elapsedPeriod');
    this.elapsedPeriodTextBoxconfig.required = true;
    this.elapsedPeriodTextBoxconfig.Errors = [elapsedPeriodError];

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('plan.flow.validation.numberInt32Check');
    this.maxErrorDto = [maxLimitValidation];
    this.elapsedPeriodTextBoxconfig.maxValueValidation = this.translate.instant('plan.flow.validation.InputIncorrect');

    const actionNameError = new ErrorDto;
    actionNameError.validation = "required";
    actionNameError.isModelError = true;
    actionNameError.validationMessage = this.translate.instant('plan.flow.validation.actionName');
    this.ActionNameTextBoxconfig.required = true;
    this.ActionNameTextBoxconfig.Errors = [actionNameError];

    const actionReceiverError = new ErrorDto;
    actionReceiverError.validation = "required";
    actionReceiverError.isModelError = true;
    actionReceiverError.validationMessage = this.translate.instant('plan.flow.validation.actionReceiverType');
    this.ActionReceiverDropdownConfig.required = true;
    this.ActionReceiverDropdownConfig.Errors = [actionReceiverError];

    const actionTypeError = new ErrorDto;
    actionTypeError.validation = "required";
    actionTypeError.isModelError = true;
    actionTypeError.validationMessage = this.translate.instant('plan.flow.validation.actionType');
    this.ActionTypeDropdownConfig.required = true;
    this.ActionTypeDropdownConfig.Errors = [actionTypeError];

    const priorityError = new ErrorDto;
    priorityError.validation = "required";
    priorityError.isModelError = true;
    priorityError.validationMessage = this.translate.instant('plan.flow.validation.priority');
    this.PriorityDropdownConfig.required = true;
    this.PriorityDropdownConfig.Errors = [priorityError];

    const templateNameError = new ErrorDto;
    templateNameError.validation = "required";
    templateNameError.isModelError = true;
    templateNameError.validationMessage = this.translate.instant('plan.flow.validation.docTemplate');
    this.TemplateNameDropdownConfig.required = true;
    this.TemplateNameDropdownConfig.Errors = [templateNameError];

    const communicationMediumError = new ErrorDto;
    communicationMediumError.validation = "required";
    communicationMediumError.isModelError = true;
    communicationMediumError.validationMessage = this.translate.instant('plan.flow.validation.communicationMedium');
    this.CommunicationMediumDropdownConfig.required = true;
    this.CommunicationMediumDropdownConfig.Errors = [communicationMediumError];

    const communicationReceiverError = new ErrorDto;
    communicationReceiverError.validation = "required";
    communicationReceiverError.isModelError = true;
    communicationReceiverError.validationMessage = this.translate.instant('plan.flow.validation.communicationReceiver')
    this.CommunicationReceiverDropdownConfig.required = true;
    this.CommunicationReceiverDropdownConfig.Errors = [communicationReceiverError];

    const serviceActionNameError = new ErrorDto;
    serviceActionNameError.validation = "required";
    serviceActionNameError.isModelError = true;
    serviceActionNameError.validationMessage = this.translate.instant('plan.flow.validation.name')
    this.ServiceActionNameTextBoxconfig.required = true;
    this.ServiceActionNameTextBoxconfig.Errors = [serviceActionNameError];

    const serviceActionError = new ErrorDto;
    serviceActionError.validation = "required";
    serviceActionError.isModelError = true;
    serviceActionError.validationMessage = this.translate.instant('plan.flow.validation.serviceAction')
    this.ServiceActionDropdownConfig.required = true;
    this.ServiceActionDropdownConfig.Errors = [serviceActionError];

    const followUpEventError = new ErrorDto;
    followUpEventError.validation = "required";
    followUpEventError.isModelError = true;
    followUpEventError.validationMessage = this.translate.instant('plan.flow.validation.event')
    this.FollowUpEventDropdownConfig.required = true;
    this.FollowUpEventDropdownConfig.Errors = [followUpEventError];

    const ruleModelNameError = new ErrorDto;
    ruleModelNameError.validation = "required";
    ruleModelNameError.isModelError = true;
    ruleModelNameError.validationMessage = this.translate.instant('plan.flow.validation.ruleName')
    this.RuleModelNameTextBoxconfig.required = true;
    this.RuleModelNameTextBoxconfig.Errors = [ruleModelNameError];

    const ruleOutputError = new ErrorDto;
    ruleOutputError.validation = "required";
    ruleOutputError.isModelError = true;
    ruleOutputError.validationMessage = this.translate.instant('plan.flow.validation.ruleOutput')
    this.RuleOutputTextBoxconfig.required = true;
    this.RuleOutputTextBoxconfig.Errors = [ruleOutputError];

    //Reminder Scenario 
    const scenarioNameError = new ErrorDto;
    scenarioNameError.validation = "required";
    scenarioNameError.isModelError = true;
    scenarioNameError.validationMessage = this.translate.instant('plan.flow.validation.scenarioName')
    this.RSNameTextBoxconfig.required = true;
    this.RSNameTextBoxconfig.Errors = [scenarioNameError];

    const RSStepNameError = new ErrorDto;
    RSStepNameError.validation = "required";
    RSStepNameError.isModelError = true;
    RSStepNameError.validationMessage = this.translate.instant('plan.flow.validation.name')
    this.RSStepNameTextBoxconfig.required = true;
    this.RSStepNameTextBoxconfig.Errors = [RSStepNameError];

    const RSElapsedPeriodError = new ErrorDto;
    RSElapsedPeriodError.validation = "required";
    RSElapsedPeriodError.isModelError = true;
    RSElapsedPeriodError.validationMessage = this.translate.instant('plan.flow.validation.elapsedPeriod')
    this.RSElapsedPeriodTextBoxconfig.required = true;
    this.RSElapsedPeriodTextBoxconfig.Errors = [RSElapsedPeriodError];


    const RSMinDueAmountError = new ErrorDto;
    RSMinDueAmountError.validation = "required";
    RSMinDueAmountError.isModelError = true;
    RSMinDueAmountError.validationMessage = this.translate.instant('plan.flow.validation.minDueAmount')
    this.RSMinDueAmountTestBoxconfig.required = true;
    this.RSMinDueAmountTestBoxconfig.Errors = [RSMinDueAmountError];

    const RSElapsedPerioddropdownError = new ErrorDto;
    RSElapsedPerioddropdownError.validation = "required";
    RSElapsedPerioddropdownError.isModelError = true;
    RSElapsedPerioddropdownError.validationMessage = this.translate.instant('plan.flow.validation.elapsedPeriod')
    this.RSElapsedPeriodDropdownconfig.required = true;
    this.RSElapsedPeriodDropdownconfig.Errors = [RSElapsedPerioddropdownError];


    const RSactionNameError = new ErrorDto;
    RSactionNameError.validation = "required";
    RSactionNameError.isModelError = true;
    RSactionNameError.validationMessage = this.translate.instant('plan.flow.validation.actionName')
    this.RSActionNameTextBoxconfig.required = true;
    this.RSActionNameTextBoxconfig.Errors = [RSactionNameError];

    const RSactionReceiverError = new ErrorDto;
    RSactionReceiverError.validation = "required";
    RSactionReceiverError.isModelError = true;
    RSactionReceiverError.validationMessage = this.translate.instant('plan.flow.validation.actionReceiverType')
    this.RSActionReceiverDropdownConfig.required = true;
    this.RSActionReceiverDropdownConfig.Errors = [RSactionReceiverError];

    const RSactionTypeError = new ErrorDto;
    RSactionTypeError.validation = "required";
    RSactionTypeError.isModelError = true;
    RSactionTypeError.validationMessage = this.translate.instant('plan.flow.validation.actionType')
    this.RSActionTypeDropdownConfig.required = true;
    this.RSActionTypeDropdownConfig.Errors = [RSactionTypeError];

    const RSpriorityError = new ErrorDto;
    RSpriorityError.validation = "required";
    RSpriorityError.isModelError = true;
    RSpriorityError.validationMessage = this.translate.instant('plan.flow.validation.priority')
    this.RSPriorityDropdownConfig.required = true;
    this.RSPriorityDropdownConfig.Errors = [RSpriorityError];

    const RStemplateNameError = new ErrorDto;
    RStemplateNameError.validation = "required";
    RStemplateNameError.isModelError = true;
    RStemplateNameError.validationMessage = this.translate.instant('plan.flow.validation.docTemplate')
    this.RSTemplateNameDropdownConfig.required = true;
    this.RSTemplateNameDropdownConfig.Errors = [RStemplateNameError];

    const RScommunicationMediumError = new ErrorDto;
    RScommunicationMediumError.validation = "required";
    RScommunicationMediumError.isModelError = true;
    RScommunicationMediumError.validationMessage = this.translate.instant('plan.flow.validation.communicationMedium')
    this.RSCommunicationMediumDropdownConfig.required = true;
    this.RSCommunicationMediumDropdownConfig.Errors = [RScommunicationMediumError];

    const RScommunicationReceiverError = new ErrorDto;
    RScommunicationReceiverError.validation = "required";
    RScommunicationReceiverError.isModelError = true;
    RScommunicationReceiverError.validationMessage = this.translate.instant('plan.flow.validation.communicationReceiver')
    this.RSCommunicationReceiverDropdownConfig.required = true;
    this.RSCommunicationReceiverDropdownConfig.Errors = [RScommunicationReceiverError];

    const RSRoleTypeError = new ErrorDto;
    RSRoleTypeError.validation = "required";
    RSRoleTypeError.isModelError = true;
    RSRoleTypeError.validationMessage = this.translate.instant('plan.flow.validation.roleType')
    this.RSRoleTypeDropdownConfig.required = true;
    this.RSRoleTypeDropdownConfig.Errors = [RSRoleTypeError];

    const documentTemplateTypeError = new ErrorDto;
    documentTemplateTypeError.validation = "required";
    documentTemplateTypeError.isModelError = true;
    documentTemplateTypeError.validationMessage = this.translate.instant('plan.flow.validation.docTemplateType')
    this.DocumentTemplateTypeDropdownConfig.required = true;
    this.DocumentTemplateTypeDropdownConfig.Errors = [documentTemplateTypeError];

    const docGenTypeError = new ErrorDto;
    docGenTypeError.validation = "required";
    docGenTypeError.isModelError = true;
    docGenTypeError.validationMessage = this.translate.instant('plan.flow.validation.docGen')
    this.DocGenTypeDropdownConfig.required = true;
    this.DocGenTypeDropdownConfig.Errors = [docGenTypeError];

    const RSfollowUpEventError = new ErrorDto;
    RSfollowUpEventError.validation = "required";
    RSfollowUpEventError.isModelError = true;
    RSfollowUpEventError.validationMessage = this.translate.instant('plan.flow.validation.eventName')
    this.RSFollowUpEventDropdownConfig.required = true;
    this.RSFollowUpEventDropdownConfig.Errors = [RSfollowUpEventError];

    const attachmentTypeError = new ErrorDto;
    attachmentTypeError.validation = "required";
    attachmentTypeError.isModelError = true;
    attachmentTypeError.validationMessage = this.translate.instant('plan.flow.validation.attachmentType')
    this.AttachmentTypeDropdownConfig.required = true;
    this.AttachmentTypeDropdownConfig.Errors = [attachmentTypeError];
    this.RSAttachmentTypeDropdownConfig.required = true;
    this.RSAttachmentTypeDropdownConfig.Errors = [attachmentTypeError];

    const hourValidation = new ErrorDto;
    hourValidation.validation = "maxError";
    hourValidation.isModelError = true;
    hourValidation.validationMessage = this.translate.instant('plan.flow.validation.hour')
    this.minHourDto = [hourValidation];
    this.maxHourDto = [hourValidation];

    const minuteValidation = new ErrorDto;
    minuteValidation.validation = "maxError";
    minuteValidation.isModelError = true;
    minuteValidation.validationMessage = this.translate.instant('plan.flow.validation.minute')
    this.minMinuteDto = [minuteValidation];
    this.maxMinuteDto = [minuteValidation];

  }
}
