import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FluidAutoCompleteConfig, FluidButtonConfig, FluidCheckBoxConfig, ErrorDto, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { CodeTable, DtoState, FlowNameDto, FollowUpCaseStatusDto, FollowUpConfigScreenDto, FollowupEventNameDto, FollowUpEventNameDto, FollowUpProcedure2StopEventDto, FollowUpProcedureDto, FollowUpSearchCriteriaDto, FollowUpStepActionDto, FollowUpStepDto, FollowUpStepEventDto, MessageDto, ResponseListBaseOfFollowUpProcedureDto, ServiceActionDto, StateStepDto } from './models/manage-followup.model';
import { ManageFollowupService } from './service/manage-followup.service';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mprsc-manage-followup-config',
  templateUrl: './manage-followup-config.component.html',
  styleUrls: ['./manage-followup-config.component.scss']
})
export class ManageFollowupConfigComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("followUpConfigForm", { static: true }) followUpConfigForm!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public FlowNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public startEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TriggerEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ElapsedPeriodTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public HandlingDateDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ActionNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TemplateNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CommunicationMediumDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ServiceActionNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public FollowUpEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public elapsedPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  filter: FollowUpSearchCriteriaDto = new FollowUpSearchCriteriaDto();
  followUpList: ResponseListBaseOfFollowUpProcedureDto = new ResponseListBaseOfFollowUpProcedureDto;
  followUpDetail: FollowUpProcedureDto = new FollowUpProcedureDto;
  followUpScreenData!: FollowUpConfigScreenDto;
  followUpStepListDetail: FollowUpStepDto = new FollowUpStepDto
  filterName: FlowNameDto[] = []
  recordsAvailable = 0;
  pageRow = 10;
  resetPagination = 0;
  paginationContent = 'Total Records : ' + this.recordsAvailable;
  commonfollowUpEventNameList!: FollowupEventNameDto[]
  showFollowUpStepDetail!: boolean;
  validationHeader!: string
  saveFollowUpData: FollowUpProcedureDto = new FollowUpProcedureDto
  SelectedTabIndex!: number;
  placeholder = 'select';
  exceptionBox!: boolean;
  showFollowUpData!: boolean
  showDialog!: boolean
  stepseqHeader!: any[];
  FlowNameHeader!: any[];
  maxErrorDto: ErrorDto[] = [];
  intMaxValue = 2147483647;
  navigateUrl!: string
  search!: FollowUpSearchCriteriaDto
  errorCode!: string

  stopEvent = [
    { field: null, property: 'label', width: '30%' },
    { field: 'stopTriggerEvent', property: 'StopEvent', width: '60%' },
    { field: null, property: 'Delete', width: '10%' }
  ]

  actionHeader = [
    { header: this.translate.instant('process.managefllowup.tab.actionName'), field: 'action.name', pSortableColumnDisabled: true, property: 'ActionName', width: '31%' },
    { header: this.translate.instant('process.managefllowup.tab.actionType'), field: 'action.actionType.caption', property: 'ActionType', width: '32%' },
    { header: this.translate.instant('process.managefllowup.tab.actionReceiver'), field: 'action.actionReceiverTypeName.caption', property: 'ActionReceiver', width: '32%' },
    { header: '', field: null, property: 'Delete', pSortableColumnDisabled: true, width: '5%' }
  ];

  CommunicationHeader = [
    { header: this.translate.instant('process.managefllowup.tab.tempName'), field: '.communication.documentTemplate.name', property: 'TemplateName', width: '13%' },
    { header: this.translate.instant('process.managefllowup.tab.communicat'), field: 'communication.communicationMedium.caption', property: 'CommunicationMedium', width: '13%' },
    { header: this.translate.instant('process.managefllowup.tab.roleType'), field: 'communication.roleType.caption', property: 'RoleType', width: '14%' },
    { header: this.translate.instant('process.managefllowup.tab.adminRole'), field: 'communication.adminRoleType.caption', property: 'AdminRoleType', width: '14%' },
    { header: this.translate.instant('process.managefllowup.tab.collectionRole'), field: 'communication.collectionsRoleType.caption', property: 'CollectionRoleType', width: '14%' },
    { header: this.translate.instant('process.managefllowup.tab.constructionType'), field: 'communication.constructionDepotRoleType.caption', property: 'ConstructionDepotRoleType', width: '14%' },
    { header: this.translate.instant('process.managefllowup.tab.R'), field: 'communication.registeredLetter', property: 'Registered', width: '13%' },
    { header: '', field: null, property: 'Delete', width: '5%' }
  ];
  ServicesHeader = [
    { header: this.translate.instant('process.managefllowup.tab.serActionName'), pSortableColumnDisabled: true, field: 'actionName', property: 'ActionName', width: '31%' },
    { header: this.translate.instant('process.managefllowup.tab.ServiceName'), pSortableColumnDisabled: true, field: 'serviceAction.caption', property: 'ServiceName', width: '32%' },
    { header: this.translate.instant('process.managefllowup.tab.IsBlocking'), field: 'isBlocking', property: 'IsBlocking', width: '32%' },
    { header: '', field: '', property: 'Delete', pSortableColumnDisabled: true, width: '5%' }
  ];

  EventsHeader = [
    { header: this.translate.instant('process.managefllowup.tab.FollowUpEvent'), field: 'event', property: 'FollowUpEvent', width: '95%' },
    { header: '', field: '', property: 'Delete', width: '5%' }
  ];
  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, private commonService: ConfigContextService, public router: Router,
    public service: ManageFollowupService, private fluidValidation: fluidValidationService, public route: ActivatedRoute, private spinnerService: SpinnerService) {
    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {
      this.SelectedTabIndex = selectedTabIndex;
    });
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }
  ngOnInit(): void {

    this.buildConfiguration();
    this.validationHeader = this.translate.instant('process.Validation.Header');
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.followUpScreenData = res.followUpScreenData;
      this.commonfollowUpEventNameList = this.followUpScreenData.followupEventNameList;
    });

    this.filter.flowName = null as unknown as FlowNameDto;
    this.onSearch(this.filter);

    this.FlowNameHeader = [
      { header: this.translate.instant('process.managefllowup.table.Flowname'), field: 'flowName', width: '95%' },
      { header: '', field: '', fieldType: 'deleteButton', width: '5%' }
    ];

    this.stepseqHeader = [
      { header: this.translate.instant('process.managefllowup.table.stepSeq'), field: 'seqNr', width: '23%' },
      { header: this.translate.instant('process.managefllowup.table.stepName'), field: 'name', width: '24%' },
      { header: this.translate.instant('process.managefllowup.table.ElapsePeriod'), field: 'elapsedPeriod', width: '24%' },
      { header: this.translate.instant('process.managefllowup.table.IntervalType'), field: 'intervalMeasure.caption', width: '24%' },
      { header: '', field: '', fieldType: 'deleteButton', width: '5%' }
    ];

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
        this.filter.sortColumn = null;
        this.filter.sortMode = null;
        this.onSearch(this.filter);
      }

    }
  }

  onSearch(searchData: FollowUpSearchCriteriaDto) {
    this.filter.pageSize = 10;
    this.spinnerService.setIsLoading(true);
    this.service.getFollowUpSearchData(searchData).subscribe(res => {
      this.spinnerService.setIsLoading(false);
      this.followUpList = res;
      if (this.filter.sortMode == 'asc') {
        this.followUpList.items.sort((a, b) => (a.flowName.toLowerCase() < b.flowName.toLowerCase()) ? -1 : 1);
      }
      else if (this.filter.sortMode == 'desc') {
        this.followUpList.items.sort((a, b) => (a.flowName.toLowerCase() > b.flowName.toLowerCase()) ? -1 : 1);
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
        this.settingIsStepSelectedFalse();
        this.followUpList.items[0].isSelected = true;
        this.followUpDetail = this.followUpList.items[0];
        if (this.followUpDetail.followUpStepList.length > 0) {
          this.showFollowUpStepDetail = true;
          this.followUpDetail.followUpStepList[0].isStepSelected = true;
          this.followUpStepListDetail = this.followUpDetail.followUpStepList[0];
        }
        else {
          this.showFollowUpStepDetail = false;
        }
        this.settingIsLastEditedFalse();
        this.followUpList.items.forEach(x => x.followUpProcedure2StopEventList.forEach(y => y.isDeleted = false));
        this.followUpList.items.forEach(x => x.followUpStepList.forEach(y => y.actionList.forEach(z => z.isDeleted = false)));
        this.followUpList.items.forEach(x => x.followUpStepList.forEach(y => y.messageList.forEach(z => z.isDeleted = false)));
        this.followUpList.items.forEach(x => x.followUpStepList.forEach(y => y.serviceActionList.forEach(z => z.isDeleted = false)));
        this.followUpList.items.forEach(x => x.followUpStepList.forEach(y => y.followUpStepEventList.forEach(z => z.isDeleted = false)));

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

  onSave(followupDetail: FollowUpProcedureDto[]) {
    if (this.followUpConfigForm.valid && !this.Duplicate() && this.CommunicationBusinessError()) {

      if (!this.Duplicate()) {
        this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.RemoveExternalError()
      followupDetail.forEach(x => {
        const notDeleted = x.followUpProcedure2StopEventList.filter(y => !y.isDeleted && y.stopTriggerEvent != undefined)
        x.followUpProcedure2StopEventList = notDeleted;
      })

      followupDetail.forEach(x => x.followUpStepList.forEach(y => {
        const notDeleted = y.actionList.filter(z => !z.isDeleted)
        y.actionList = notDeleted
      }))

      followupDetail.forEach(x => x.followUpStepList.forEach(y => {
        const notDeleted = y.messageList.filter(z => !z.isDeleted)
        y.messageList = notDeleted
      }))

      followupDetail.forEach(x => x.followUpStepList.forEach(y => {
        const notDeleted = y.serviceActionList.filter(z => !z.isDeleted)
        y.serviceActionList = notDeleted
      }))

      followupDetail.forEach(x => x.followUpStepList.forEach(y => {
        const notDeleted = y.followUpStepEventList.filter(z => !z.isDeleted)
        y.followUpStepEventList = notDeleted
      }))

      followupDetail.forEach(x => {
        if (x.isLastEdited) {
          this.saveFollowUpData = { ...x };
        }
      })

      if (this.saveFollowUpData.flowName != undefined) {
        this.spinnerService.setIsLoading(true);
        this.service.saveFollowUpData(this.saveFollowUpData).subscribe(res => {
          this.spinnerService.setIsLoading(false);
          if (this.filter.flowName == null) {
            if (this.saveFollowUpData.state == DtoState.Dirty || this.saveFollowUpData.state == DtoState.Unknown) {
              this.onSearch(this.filter);
            }
            else {
              this.filter.pageIndex = parseInt((this.followUpList.totalItemCount / this.filter.pageSize) as unknown as string)
              this.onSearch(this.filter)
            }
          }
          else {
            if (this.saveFollowUpData.state == DtoState.Dirty || this.saveFollowUpData.state == DtoState.Unknown) {
              this.searchCriteriaform.resetForm();
              this.filter.flowName = null as unknown as FlowNameDto;
              this.onSearch(this.filter)
            }
            else {
              this.onSearch(this.filter)
            }
          }
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
        });
      }
    }
    else {
      this.validationCheck();
      if (this.Duplicate()) {
        this.throwBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
    }
  }

  dataSelection(event: any) {

    if (this.followUpConfigForm.valid && !this.Duplicate() && this.CommunicationBusinessError()) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))

      if (event) {
        this.settingIsSelectedFalse();
        this.followUpDetail = event;
        this.followUpDetail.isSelected = true;
        if (this.followUpDetail.followUpStepList.length > 0) {
          this.settingIsStepSelectedFalse();
          this.followUpDetail.followUpStepList[0].isStepSelected = true;
          this.followUpStepListDetail = this.followUpDetail.followUpStepList[0];
          this.showFollowUpStepDetail = true;
        }
        else
          this.showFollowUpStepDetail = false;
      }
    }
    else {
      this.validationCheck();
      if (this.Duplicate()) {
        this.throwBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
    }
  }

  stepListDataSelection(event: any) {

    if (this.followUpConfigForm.valid && !this.Duplicate() && this.CommunicationBusinessError()) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))

      if (event) {
        this.settingIsStepSelectedFalse();
        this.followUpStepListDetail = event;
        this.followUpStepListDetail.isStepSelected = true;
      }
    }
    else {
      this.validationCheck();
      if (this.Duplicate()) {
        this.throwBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
    }
  }

  addEventBasedFlow() {
    if (this.followUpConfigForm.valid) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.FlowNameTextBoxconfig.externalError = false;
      this.startEventDropdownConfig.externalError = false;

      this.showFollowUpData = true;
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

      this.followUpList.items[this.followUpList.items.length - 1] = this.followUpDetail;
      this.showFollowUpStepDetail = false;
    }
    else {
      this.validationCheck();
    }
  }

  addStopEvent() {
    if (this.followUpConfigForm.valid) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))

      if (this.followUpDetail.followUpProcedure2StopEventList.length > 0) {
        this.commonfollowUpEventNameList = this.followUpScreenData.followupEventNameList.filter(val => {
          return !this.followUpDetail.followUpProcedure2StopEventList.find(x => {
            if (!x.isDeleted && x.stopTriggerEvent != undefined)
              return x.stopTriggerEvent.codeId == val.codeId;
            return false
          });
        })
      }
      const newRow = new FollowUpProcedure2StopEventDto();
      newRow.isDeleted = false;
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
  }

  addStep() {
    if (this.followUpConfigForm.valid) {

      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.NameTextBoxconfig.externalError = false;
      this.TriggerEventDropdownConfig.externalError = false;
      this.HandlingDateDropdownConfig.externalError = false;
      this.ElapsedPeriodTypeDropdownConfig.externalError = false;

      this.settingIsStepSelectedFalse();
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
      this.validationCheck();
    }
  }

  addActions() {
    if (this.followUpConfigForm.valid && !this.Duplicate()) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.ActionNameDropdownConfig.externalError = false;
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))

      const newRow = new FollowUpStepActionDto();
      newRow.isDeleted = false;
      const newuserList = this.followUpStepListDetail.actionList;
      newuserList.push({ ...newRow });
      this.followUpStepListDetail.actionList = [...newuserList];
      this.followUpStepListDetail.actionList[this.followUpStepListDetail.actionList.length - 1].pKey = 0;
      this.followUpStepListDetail.actionList[this.followUpStepListDetail.actionList.length - 1].state = DtoState.Created;
      const listIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[listIndex].state = DtoState.Dirty;
    }
    else {
      this.validationCheck();
      if (this.Duplicate()) {
        this.throwBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
    }
  }

  Duplicate(): boolean {
    if (this.followUpStepListDetail.actionList.length > 0 && this.followUpConfigForm.valid) {
      const valueArr = this.followUpStepListDetail.actionList.map(function (item) {
        if (!item.isDeleted)
          return item.action.name
        return false
      });
      return valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
    }
    else
      return false;
  }

  DuplicatewithEvent(event: FollowUpStepDto): boolean {
    if (event.actionList.length > 0 && this.followUpConfigForm.valid) {
      const valueArr = event.actionList.map(function (item) {
        if (!item.isDeleted)
          return item.action.name
        return false
      });
      return valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
    }
    else
      return false;
  }

  DuplicatewithEventList(event: FollowUpStepDto[]): boolean[] {

    const check = event.map(x => {
      if (x.actionList.length > 0 && this.followUpConfigForm.valid) {
        const valueArr = x.actionList.map(function (item) {
          if (!item.isDeleted)
            return item.action.name
          return false
        });
        return valueArr.some(function (item, idx) {
          return valueArr.indexOf(item) != idx
        });
      }
      else
        return false;
    })
    return check;
  }

  addCommunications() {

    if (this.followUpConfigForm.valid && this.CommunicationBusinessError()) {
      this.TemplateNameDropdownConfig.externalError = false;
      this.CommunicationMediumDropdownConfig.externalError = false;
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));

      const newRow = new MessageDto();
      newRow.isDeleted = false;
      const newuserList = this.followUpStepListDetail.messageList;
      newuserList.push({ ...newRow });
      this.followUpStepListDetail.messageList = [...newuserList];

      this.followUpStepListDetail.messageList[this.followUpStepListDetail.messageList.length - 1].pKey = 0;
      this.followUpStepListDetail.messageList[this.followUpStepListDetail.messageList.length - 1].state = DtoState.Created;
      this.followUpStepListDetail.messageList[this.followUpStepListDetail.messageList.length - 1].communication.pKey = 0;
      this.followUpStepListDetail.messageList[this.followUpStepListDetail.messageList.length - 1].communication.state = DtoState.Created;
      const listIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[listIndex].state = DtoState.Dirty;

    }
    else {
      this.validationCheck();

    }
  }


  addServices() {
    if (this.followUpConfigForm.valid) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.ServiceActionNameDropdownConfig.externalError = false;

      const newRow = new ServiceActionDto();
      newRow.isDeleted = false;
      const newuserList = this.followUpStepListDetail.serviceActionList;
      newuserList.push({ ...newRow });
      this.followUpStepListDetail.serviceActionList = [...newuserList];
      this.followUpStepListDetail.serviceActionList[this.followUpStepListDetail.serviceActionList.length - 1].pKey = 0;
      this.followUpStepListDetail.serviceActionList[this.followUpStepListDetail.serviceActionList.length - 1].state = DtoState.Created;
      const listIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[listIndex].state = DtoState.Dirty;
    }
    else {
      this.validationCheck();
    }
  }


  addEvents() {
    if (this.followUpConfigForm.valid) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.FollowUpEventDropdownConfig.externalError = false;

      const newRow = new FollowUpStepEventDto();
      newRow.isDeleted = false;
      const newuserList = this.followUpStepListDetail.followUpStepEventList
      this.followUpStepListDetail.followUpStepEventList.push({ ...newRow });
      this.followUpStepListDetail.followUpStepEventList = [...newuserList];
      this.followUpStepListDetail.followUpStepEventList[this.followUpStepListDetail.followUpStepEventList.length - 1].pKey = 0;
      this.followUpStepListDetail.followUpStepEventList[this.followUpStepListDetail.followUpStepEventList.length - 1].state = DtoState.Created;
      const listIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.followUpList.items[listIndex].state = DtoState.Dirty;
    }
    else {
      this.validationCheck();
    }
  }

  validationCheck() {
    const eventIndex = this.followUpStepListDetail.followUpStepEventList.findIndex(x => x.event == null || x.event == undefined)
    if (eventIndex != -1) {
      this.FollowUpEventDropdownConfig.externalError = true;
    }

    const serviceActionNameIndex = this.followUpStepListDetail.serviceActionList.findIndex(x => x.actionName == null || x.actionName == undefined)
    if (serviceActionNameIndex != -1) {
      this.ServiceActionNameDropdownConfig.externalError = true;
    }

    const templateNameindex = this.followUpStepListDetail.messageList.findIndex(x => x.communication.documentTemplate == null || x.communication.documentTemplate == undefined)
    const communicationMediumindex = this.followUpStepListDetail.messageList.findIndex(x => x.communication.communicationMedium == null || x.communication.communicationMedium == undefined)
    if (templateNameindex != -1) {
      this.TemplateNameDropdownConfig.externalError = true;
    }
    if (communicationMediumindex != -1) {
      this.CommunicationMediumDropdownConfig.externalError = true;
    }

    const actionIndex = this.followUpStepListDetail.actionList.findIndex(x => x.action == null || x.action == undefined)
    if (actionIndex != -1) {
      this.ActionNameDropdownConfig.externalError = true;
    }

    if (this.followUpStepListDetail.name == "" || this.followUpStepListDetail.name == undefined) {
      this.NameTextBoxconfig.externalError = true;
    }
    if (this.followUpStepListDetail.triggerEvent == undefined || this.followUpStepListDetail.triggerEvent == null) {
      this.TriggerEventDropdownConfig.externalError = true;
    }
    if (this.followUpStepListDetail.elapsedPeriodType == undefined || this.followUpStepListDetail.elapsedPeriodType == null) {
      this.ElapsedPeriodTypeDropdownConfig.externalError = true;
    }
    if (this.followUpStepListDetail.handlingDateType == undefined || this.followUpStepListDetail.handlingDateType == null) {
      this.HandlingDateDropdownConfig.externalError = true;
    }

    if (this.followUpDetail.flowName == undefined || this.followUpDetail.flowName == "") {
      this.FlowNameTextBoxconfig.externalError = true;
    }
    if (this.followUpDetail.startTriggerEvent == undefined || this.followUpDetail.startTriggerEvent == null) {
      this.startEventDropdownConfig.externalError = true;
    }

  }

  CommunicationBusinessError(): boolean {
    if (this.followUpConfigForm.valid) {
      if (this.followUpStepListDetail.messageList.length > 0) {
        let nullCheck;
        this.followUpStepListDetail.messageList.forEach(x => {
          if ((x.communication.roleType == null || x.communication.roleType == undefined) &&
            (x.communication.adminRoleType == null || x.communication.adminRoleType == undefined) && (x.communication.collectionsRoleType == null || x.communication.collectionsRoleType == undefined) &&
            (x.communication.constructionDepotRoleType == null || x.communication.constructionDepotRoleType == undefined)) {
            {
              this.throwBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
              nullCheck = true;
            }
          }
        })

        if (nullCheck) {
          return false;
        }

        if (!nullCheck) {
          let oneRoleTypeBusinessError;
          this.followUpStepListDetail.messageList.forEach(x => {
            if ((x.communication.roleType != null || x.communication.roleType != undefined) && (x.communication.adminRoleType == null || x.communication.adminRoleType == undefined) &&
              (x.communication.collectionsRoleType == null || x.communication.collectionsRoleType == undefined) && (x.communication.constructionDepotRoleType == null || x.communication.constructionDepotRoleType == undefined)) {
              oneRoleTypeBusinessError = true;
            }
            else if ((x.communication.roleType == null || x.communication.roleType == undefined) && (x.communication.adminRoleType != null || x.communication.adminRoleType != undefined) &&
              (x.communication.collectionsRoleType == null || x.communication.collectionsRoleType == undefined) && (x.communication.constructionDepotRoleType == null || x.communication.constructionDepotRoleType == undefined)) {
              oneRoleTypeBusinessError = true;
            }
            else if ((x.communication.roleType == null || x.communication.roleType == undefined) && (x.communication.adminRoleType == null || x.communication.adminRoleType == undefined) &&
              (x.communication.collectionsRoleType != null || x.communication.collectionsRoleType != undefined) && (x.communication.constructionDepotRoleType == null || x.communication.constructionDepotRoleType == undefined)) {
              oneRoleTypeBusinessError = true;
            }
            else if ((x.communication.roleType == null || x.communication.roleType == undefined) && (x.communication.adminRoleType == null || x.communication.adminRoleType == undefined) &&
              (x.communication.collectionsRoleType == null || x.communication.collectionsRoleType == undefined) && (x.communication.constructionDepotRoleType != null || x.communication.constructionDepotRoleType != undefined)) {
              oneRoleTypeBusinessError = true;
            }
            else {
              oneRoleTypeBusinessError = false;
            }
          })
          if (!oneRoleTypeBusinessError) {
            this.throwBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
            return false;
          }
        }
      }
    }
    return true;
  }

  RemoveExternalError() {
    this.NameTextBoxconfig.externalError = false;
    this.TriggerEventDropdownConfig.externalError = false;
    this.ElapsedPeriodTypeDropdownConfig.externalError = false;
    this.HandlingDateDropdownConfig.externalError = false;
    this.ActionNameDropdownConfig.externalError = false;
    this.TemplateNameDropdownConfig.externalError = false;
    this.CommunicationMediumDropdownConfig.externalError = false;
    this.ServiceActionNameDropdownConfig.externalError = false;
    this.FollowUpEventDropdownConfig.externalError = false;
  }

  RemoveStepExternalError() {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('process.managefllowup.validationErrors.actionName'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })

    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('process.managefllowup.validationErrors.templateName'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })

    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('process.managefllowup.validationErrors.communicationMedium'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })

    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('process.managefllowup.validationErrors.serviceActionName'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })

    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('process.managefllowup.validationErrors.event'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  onRowDelete(event: FollowUpProcedureDto, gridData: FollowUpProcedureDto[]) {

    let actionIndex = -1;
    let templateNameIndex = -1;
    let communicationMediumIndex = -1;
    let serviceActionNameIndex = -1;
    let EventNameIndex = -1;
    const nameIndex = event.followUpStepList.findIndex(x => x.name == "" || x.name == undefined);
    const triggerEventIndex = event.followUpStepList.findIndex(x => x.triggerEvent == null || x.triggerEvent == undefined)
    const elapsedPeriodTypeIndex = event.followUpStepList.findIndex(x => x.elapsedPeriodType == null || x.elapsedPeriodType == undefined)
    const handlingDateIndex = event.followUpStepList.findIndex(x => x.handlingDateType == null || x.handlingDateType == undefined)
    let oneRoleType;

    event.followUpStepList.forEach(x => {
      if (x.actionList.length > 0)
        actionIndex = x.actionList.findIndex(y => { return y.action == null || y.action == undefined })
    });
    event.followUpStepList.forEach(x => {
      if (x.messageList.length > 0)
        templateNameIndex = x.messageList.findIndex(y => { return y?.communication?.documentTemplate == null || y?.communication?.documentTemplate == undefined })
    });
    event.followUpStepList.forEach(x => {
      if (x.messageList.length > 0)
        communicationMediumIndex = x.messageList.findIndex(y => { return y?.communication?.communicationMedium == null || y?.communication?.communicationMedium == undefined })
    });
    event.followUpStepList.forEach(x => {
      if (x.serviceActionList.length > 0)
        serviceActionNameIndex = x.serviceActionList.findIndex(y => { return y.actionName == "" || y.actionName == undefined })
    });
    event.followUpStepList.forEach(x => {
      if (x.followUpStepEventList.length > 0)
        EventNameIndex = x.followUpStepEventList.findIndex(y => { return y.event == null || y.event == undefined })
    });
    event.followUpStepList.forEach(x => x.messageList.forEach(x => {
      if ((x?.communication?.roleType == null || x?.communication?.roleType == undefined) &&
        (x?.communication?.adminRoleType == null || x?.communication?.adminRoleType == undefined) && (x?.communication?.collectionsRoleType == null || x?.communication?.collectionsRoleType == undefined) &&
        (x?.communication?.constructionDepotRoleType == null || x?.communication?.constructionDepotRoleType == undefined)) {
        {
          oneRoleType = true;
        }
      }
    })
    )

    if ((this.followUpConfigForm.valid && ((this.CommunicationBusinessError() || oneRoleType) && (!this.Duplicate() || this.DuplicatewithEventList(event.followUpStepList)))) || serviceActionNameIndex != -1 || event.flowName == "" || event.flowName == undefined || event.startTriggerEvent == null || event.startTriggerEvent == undefined ||
      nameIndex != -1 || triggerEventIndex != -1 || elapsedPeriodTypeIndex != -1 || handlingDateIndex != -1 || actionIndex != -1 ||
      templateNameIndex != -1 || communicationMediumIndex != -1 || EventNameIndex != -1) {
      this.RemoveExternalError();
      this.RemoveStepExternalError();
      if (!this.Duplicate()) {
        this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      this.spinnerService.setIsLoading(true);
      this.service.deleteFollowUpData(event.pKey).subscribe(res => {
        this.spinnerService.setIsLoading(false);
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
      this.settingIsSelectedFalse();
      this.settingIsStepSelectedFalse();
      this.followUpDetail = this.followUpList.items[this.followUpList.items.length - 1];
      this.followUpDetail.isSelected = true;
      if (this.followUpDetail.followUpStepList.length > 0) {
        this.showFollowUpStepDetail = true;
        this.followUpDetail.followUpStepList[0].isStepSelected = true;
        this.followUpStepListDetail = this.followUpDetail.followUpStepList[0];
      }
      else {
        this.showFollowUpStepDetail = false;
      }
    }
  }

  onStopEventDelete(event: FollowUpProcedure2StopEventDto, gridData: FollowUpProcedure2StopEventDto[]) {
    if (this.followUpConfigForm.valid) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.stopTriggerEvent = <CodeTable>{};
      setTimeout(() => {
        this.deleteStopEvent(deletedata, this.followUpDetail.followUpProcedure2StopEventList);
      }, 10);
    }
  }

  deleteStopEvent(deletedata: number, stopEventDetail: FollowUpProcedure2StopEventDto[]) {
    stopEventDetail[deletedata].isDeleted = true;
  }

  onStepDelete(event: FollowUpStepDto, gridData: FollowUpStepDto[]) {
    const actionIndex = event.actionList.findIndex(x => x.action == null || x.action == undefined)
    const templateNameindex = event.messageList.findIndex(x => x.communication.documentTemplate == null || x.communication.documentTemplate == undefined)
    const communicationMediumindex = event.messageList.findIndex(x => x.communication.communicationMedium == null || x.communication.communicationMedium == undefined)
    const eventIndex = event.followUpStepEventList.findIndex(x => x.event == null || x.event == undefined)
    const serviceIndex = event.serviceActionList.findIndex(x => x.actionName == "" || x.actionName == undefined)
    let oneRoleType;
    event.messageList.forEach(x => {
      if ((x.communication.roleType == null || x.communication.roleType == undefined) &&
        (x.communication.adminRoleType == null || x.communication.adminRoleType == undefined) && (x.communication.collectionsRoleType == null || x.communication.collectionsRoleType == undefined) &&
        (x.communication.constructionDepotRoleType == null || x.communication.constructionDepotRoleType == undefined)) {
        {
          oneRoleType = true;
        }
      }
    })

    if ((this.followUpConfigForm.valid && ((this.CommunicationBusinessError() || oneRoleType) && (!this.Duplicate() || this.DuplicatewithEvent(event)))) || event.name == "" || event.name == undefined || event.elapsedPeriodType == null || event.elapsedPeriodType == undefined ||
      event.triggerEvent == null || event.triggerEvent == undefined || event.handlingDateType == null || event.handlingDateType == undefined || actionIndex != -1 ||
      templateNameindex != -1 || communicationMediumindex != -1 || eventIndex != -1 || serviceIndex != -1) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      if (!this.Duplicate()) {
        this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
      }
      this.RemoveExternalError();
      this.RemoveStepExternalError();

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

  onActionDelete(event: FollowUpStepActionDto, gridData: FollowUpStepActionDto[]) {
    if (this.followUpConfigForm.valid || event.action == null || event.action == undefined) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      this.ActionNameDropdownConfig.externalError = false;
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      setTimeout(() => {
        this.DeleteAction(deletedata, gridData);
      }, 10);
    }
    else {
      this.validationCheck();
    }
  }

  DeleteAction(deletedata: number, gridData: FollowUpStepActionDto[]) {
    gridData[deletedata].isDeleted = true;
    if (!this.Duplicate()) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
    }
  }

  onCommunicationDelete(event: MessageDto, gridData: MessageDto[]) {
    if (this.followUpConfigForm.valid || event.communication?.documentTemplate == null || event.communication?.documentTemplate == undefined
      || event.communication?.communicationMedium == null || event.communication?.communicationMedium == undefined) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      this.TemplateNameDropdownConfig.externalError = false;
      this.CommunicationMediumDropdownConfig.externalError = false;
      if (this.CommunicationBusinessError()) {
        this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
        this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
      }

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      setTimeout(() => {
        this.DeleteCommunication(deletedata, gridData);
      }, 10);
    }
    else {
      this.validationCheck();
    }
  }

  DeleteCommunication(deletedata: number, gridData: MessageDto[]) {
    gridData[deletedata].isDeleted = true;
  }

  onServiceDelete(event: ServiceActionDto, gridData: ServiceActionDto[]) {
    if (this.followUpConfigForm.valid || event.actionName == null || event.actionName == undefined) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      this.ServiceActionNameDropdownConfig.externalError = false;
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      setTimeout(() => {
        this.DeleteService(deletedata, gridData);
      }, 10);
    }
    else { this.validationCheck(); }
  }

  DeleteService(deletedata: number, gridData: ServiceActionDto[]) {
    gridData[deletedata].isDeleted = true;
  }

  onEventDelete(event: FollowUpStepEventDto, gridData: FollowUpStepEventDto[], index: number) {
    if (this.followUpConfigForm.valid || event.event == null || event.event == undefined) {

      const ListIndex = this.followUpList.items.findIndex(x => x.isSelected);
      this.settingIsLastEditedFalse();
      this.followUpList.items[ListIndex].isLastEdited = true;

      this.FollowUpEventDropdownConfig.externalError = false;
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.event = <FollowUpEventNameDto>{};
      setTimeout(() => {
        this.DeleteEvent(deletedata, gridData);
      }, 10);
    }
    else {
      this.validationCheck();
    }
  }

  DeleteEvent(deletedata: number, gridData: FollowUpStepEventDto[]) {
    gridData[deletedata].isDeleted = true;
  }

  settingIsSelectedFalse() {
    this.followUpList.items.forEach(x => x.isSelected = false);
  }

  settingIsStepSelectedFalse() {
    this.followUpDetail.followUpStepList.forEach(x => x.isStepSelected = false);
  }

  settingIsLastEditedFalse() {
    this.followUpList.items.forEach(x => x.isLastEdited = false);
  }

  onClear() {
    this.searchCriteriaform.resetForm();
    this.filter.flowName = null as unknown as FlowNameDto;
    this.onSearch(this.filter);
  }

  filterNames(event: any) {
    if (event) {
      this.filterName = [];

      this.followUpScreenData.flowNameList
        .filter(data => {
          if (data.name?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterName.push(data);
          }

        });
    }
  }
  changeName(event: any) {
    if (event.target.value) {

      const name = this.followUpScreenData.flowNameList.filter(x => {
        return x.name == event?.target?.value;
      })
      if (name[0] != null) {
        (this.filter.flowName as FlowNameDto) = name[0];
      }
    }
  }

  onChangeFlowName(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].flowName = event.target?.value;
    }
    this.followUpDetail.flowName = event.target?.value;
    if (event.target?.value == "") {
      this.FlowNameTextBoxconfig.externalError = true;
    }
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

  onChangeStartTriggerEvent(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].startTriggerEvent = event.value;
    }
    this.followUpDetail.startTriggerEvent = event.value;
    if (event.value == null) {
      this.startEventDropdownConfig.externalError = true;
    }
  }

  onChangeStepname(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].name = event.target?.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].name = event.target?.value;
    this.followUpStepListDetail.name = event.target?.value;
    if (event.target?.value == "") {
      this.NameTextBoxconfig.externalError = true;
    }
  }

  onChangeTriggerEvent(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].triggerEvent = event.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].triggerEvent = event.value;
    this.followUpStepListDetail.triggerEvent = event.value;
    if (event.value == null) {
      this.TriggerEventDropdownConfig.externalError = true;
    }
  }

  onChangeElapsedPeriodType(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].elapsedPeriodType = event.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].elapsedPeriodType = event.value;
    this.followUpStepListDetail.elapsedPeriodType = event.value;
    if (event.value == null) {
      this.ElapsedPeriodTypeDropdownConfig.externalError = true;
    }
  }

  onChangeElapsedPeriod(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].elapsedPeriod = event.target?.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].elapsedPeriod = event.target?.value;
    this.followUpStepListDetail.elapsedPeriod = event.target?.value;
    if (event.target?.value > this.intMaxValue) {
      this.elapsedPeriodTextBoxconfig.externalError = true;
    }
    else {
      this.elapsedPeriodTextBoxconfig.externalError = false;
    }
  }

  onChangeStatus(event: boolean) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].changeStatus = event;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].changeStatus = event;
    this.followUpStepListDetail.changeStatus = event;
    if (event) {
      this.followUpList.items[index].followUpStepList[stepIndex].enableTargetState = true
      this.followUpDetail.followUpStepList[stepIndex].enableTargetState = true
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep = new StateStepDto
      this.followUpDetail.followUpStepList[stepIndex].stateStep = new StateStepDto;
      this.followUpDetail.followUpStepList[stepIndex].stateStep.targetStateStatusName = this.followUpScreenData.followUpCaseStatusList[0]
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep.targetStateStatusName = this.followUpScreenData.followUpCaseStatusList[0]
    }
    else {
      this.followUpList.items[index].followUpStepList[stepIndex].enableTargetState = false
      this.followUpDetail.followUpStepList[stepIndex].enableTargetState = false
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep = new StateStepDto
      this.followUpDetail.followUpStepList[stepIndex].stateStep = new StateStepDto;
      this.followUpDetail.followUpStepList[stepIndex].stateStep.targetStateStatusName = <FollowUpCaseStatusDto>{}
      this.followUpList.items[index].followUpStepList[stepIndex].stateStep.targetStateStatusName = <FollowUpCaseStatusDto>{}
    }
  }

  onChangeTargetStateStatusName(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;

      this.followUpList.items[index].followUpStepList[stepIndex].stateStep = new StateStepDto
      this.followUpDetail.followUpStepList[stepIndex].stateStep = new StateStepDto
      this.followUpStepListDetail.stateStep = new StateStepDto

      this.followUpList.items[index].followUpStepList[stepIndex].stateStep.targetStateStatusName = event.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].stateStep.targetStateStatusName = event.value;
    this.followUpStepListDetail.stateStep.targetStateStatusName = event.value;
  }

  onChangeHandlingDateType(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].handlingDateType = event.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].handlingDateType = event.value;
    this.followUpStepListDetail.handlingDateType = event.value;
    if (event.value == null) {
      this.HandlingDateDropdownConfig.externalError = true;
    }
  }

  onChangeIntervalMeasure(event: any) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].intervalMeasure = event.value;
      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].intervalMeasure = event.value;
    this.followUpStepListDetail.intervalMeasure = event.value;
  }

  onChangeActionName(event: any, actionIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].action = event.value;
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].state = event.value.state;
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].pKey = event.value.pKey;
      this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].rowVersion = event.value.rowVersion;

      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
      if (this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].actionList[actionIndex].state = DtoState.Dirty;
    }
    this.followUpDetail.followUpStepList[stepIndex].actionList[actionIndex].action = event.value;
    this.followUpStepListDetail.actionList[actionIndex].action = event.value;
    if (!this.Duplicate()) {
      this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
    }
    if (event.value == null) {
      this.ActionNameDropdownConfig.externalError = true;
    }
  }

  updateCommunicationState(communicationIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
      this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].state == DtoState.Unknown)
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].state = DtoState.Dirty
    if (this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.state == DtoState.Unknown)
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.state = DtoState.Dirty
  }

  onChangeDocumentTemplate(event: any, communicationIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.documentTemplate = event.value;

      this.updateCommunicationState(communicationIndex);

    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.documentTemplate = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.documentTemplate = event.value;
    if (event.value == null) {
      this.TemplateNameDropdownConfig.externalError = true;
    }
  }

  onChangeCommunicationMedium(event: any, communicationIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.communicationMedium = event.value;

      this.updateCommunicationState(communicationIndex);
    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.communicationMedium = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.communicationMedium = event.value;
    if (event.value == null) {
      this.CommunicationMediumDropdownConfig.externalError = true;
    }
  }

  onChangeRoleType(event: any, communicationIndex: number) {
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.roleType = event.value;

      this.updateCommunicationState(communicationIndex);

    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.roleType = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.roleType = event.value;
  }

  onChangeAdminRoleType(event: any, communicationIndex: number) {
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.adminRoleType = event.value;

      this.updateCommunicationState(communicationIndex);

    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.adminRoleType = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.adminRoleType = event.value;
  }

  onChangeCollectionsRoleType(event: any, communicationIndex: number) {
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.collectionsRoleType = event.value;

      this.updateCommunicationState(communicationIndex);

    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.collectionsRoleType = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.collectionsRoleType = event.value;
  }

  onChangeConstructionDepotRoleType(event: any, communicationIndex: number) {
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.constructionDepotRoleType = event.value;

      this.updateCommunicationState(communicationIndex);

    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.constructionDepotRoleType = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.constructionDepotRoleType = event.value;
  }

  onChangeRegisteredLetter(event: any, communicationIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].messageList[communicationIndex].communication.registeredLetter = event.value;

      this.updateCommunicationState(communicationIndex);

    }
    this.followUpDetail.followUpStepList[stepIndex].messageList[communicationIndex].communication.registeredLetter = event.value;
    this.followUpStepListDetail.messageList[communicationIndex].communication.registeredLetter = event.value;
  }

  onChangeServiceActionName(event: string, serviceIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[serviceIndex].actionName = event;

      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
      if (this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].state == DtoState.Unknown)
        this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].state = DtoState.Dirty
    }
    this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].actionName = event;
    this.followUpStepListDetail.serviceActionList[serviceIndex].actionName = event;
    if (event == "") {
      this.ServiceActionNameDropdownConfig.externalError = true;
    }
  }

  onChangeServiceAction(event: any, serviceIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[serviceIndex].serviceAction = event.value;

      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
      if (this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].state == DtoState.Unknown)
        this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].state = DtoState.Dirty

    }
    this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].serviceAction = event.value;
    this.followUpStepListDetail.serviceActionList[serviceIndex].serviceAction = event.value;
    if (event.value == null) {
      this.ServiceActionNameDropdownConfig.externalError = true;
    }
  }

  onChangeIsBlocking(event: boolean, serviceIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].serviceActionList[serviceIndex].isBlocking = event;

      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
      if (this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].state == DtoState.Unknown)
        this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].state = DtoState.Dirty

    }
    this.followUpDetail.followUpStepList[stepIndex].serviceActionList[serviceIndex].isBlocking = event;
    this.followUpStepListDetail.serviceActionList[serviceIndex].isBlocking = event;
  }

  onChangeEvent(event: any, eventIndex: number) {
    const index = this.followUpList.items.findIndex(x => x.isSelected);
    this.settingIsLastEditedFalse();
    this.followUpList.items[index].isLastEdited = true;
    const stepIndex = this.followUpDetail.followUpStepList.findIndex(x => x.isStepSelected);
    if (index != -1) {
      if (this.followUpList.items[index].state == DtoState.Unknown)
        this.followUpList.items[index].state = DtoState.Dirty;
      this.followUpList.items[index].followUpStepList[stepIndex].followUpStepEventList[eventIndex].event = event.value;

      if (this.followUpList.items[index].followUpStepList[stepIndex].state == DtoState.Unknown)
        this.followUpList.items[index].followUpStepList[stepIndex].state = DtoState.Dirty;
      if (this.followUpDetail.followUpStepList[stepIndex].followUpStepEventList[eventIndex].state == DtoState.Unknown)
        this.followUpDetail.followUpStepList[stepIndex].followUpStepEventList[eventIndex].state = DtoState.Dirty

    }
    this.followUpDetail.followUpStepList[stepIndex].followUpStepEventList[eventIndex].event = event.value;
    this.followUpStepListDetail.followUpStepEventList[eventIndex].event = event.value;
    if (event.value == null) {
      this.FollowUpEventDropdownConfig.externalError = true;
    }
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
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
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  buildConfiguration() {

    const flowNameError = new ErrorDto;
    flowNameError.validation = "required";
    flowNameError.isModelError = true;
    flowNameError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.followUpName');
    this.FlowNameTextBoxconfig.required = true;
    this.FlowNameTextBoxconfig.Errors = [flowNameError];

    const startEventError = new ErrorDto;
    startEventError.validation = "required";
    startEventError.isModelError = true;
    startEventError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.startEvent');
    this.startEventDropdownConfig.required = true;
    this.startEventDropdownConfig.Errors = [startEventError];

    const nameError = new ErrorDto;
    nameError.validation = "required";
    nameError.isModelError = true;
    nameError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.name');
    this.NameTextBoxconfig.required = true;
    this.NameTextBoxconfig.Errors = [nameError];

    const triggerEventError = new ErrorDto;
    triggerEventError.validation = "required";
    triggerEventError.isModelError = true;
    triggerEventError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.triggerEvent');
    this.TriggerEventDropdownConfig.required = true;
    this.TriggerEventDropdownConfig.Errors = [triggerEventError];

    const elapsedPeriodTypeError = new ErrorDto;
    elapsedPeriodTypeError.validation = "required";
    elapsedPeriodTypeError.isModelError = true;
    elapsedPeriodTypeError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.elapsedPeriodType');
    this.ElapsedPeriodTypeDropdownConfig.required = true;
    this.ElapsedPeriodTypeDropdownConfig.Errors = [elapsedPeriodTypeError];

    const handlingDateError = new ErrorDto;
    handlingDateError.validation = "required";
    handlingDateError.isModelError = true;
    handlingDateError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.handlingDate');
    this.HandlingDateDropdownConfig.required = true;
    this.HandlingDateDropdownConfig.Errors = [handlingDateError];

    const actionNameError = new ErrorDto;
    actionNameError.validation = "required";
    actionNameError.isModelError = true;
    actionNameError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.actionName');
    this.ActionNameDropdownConfig.required = true;
    this.ActionNameDropdownConfig.Errors = [actionNameError];

    const templateNameError = new ErrorDto;
    templateNameError.validation = "required";
    templateNameError.isModelError = true;
    templateNameError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.templateName');
    this.TemplateNameDropdownConfig.required = true;
    this.TemplateNameDropdownConfig.Errors = [templateNameError];

    const communicationMediumError = new ErrorDto;
    communicationMediumError.validation = "required";
    communicationMediumError.isModelError = true;
    communicationMediumError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.communicationMedium');
    this.CommunicationMediumDropdownConfig.required = true;
    this.CommunicationMediumDropdownConfig.Errors = [communicationMediumError];

    const serviceActionNameError = new ErrorDto;
    serviceActionNameError.validation = "required";
    serviceActionNameError.isModelError = true;
    serviceActionNameError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.serviceActionName');
    this.ServiceActionNameDropdownConfig.required = true;
    this.ServiceActionNameDropdownConfig.Errors = [serviceActionNameError];

    const followUpEventError = new ErrorDto;
    followUpEventError.validation = "required";
    followUpEventError.isModelError = true;
    followUpEventError.validationMessage = this.translate.instant('process.managefllowup.validationErrors.event');
    this.FollowUpEventDropdownConfig.required = true;
    this.FollowUpEventDropdownConfig.Errors = [followUpEventError];

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('process.managefllowup.validationErrors.numberInt32Check');
    this.maxErrorDto = [maxLimitValidation];
    this.elapsedPeriodTextBoxconfig.maxValueValidation = this.translate.instant('process.managefllowup.validationErrors.InputIncorrect');
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.followUpList.items.findIndex(x => x.state == 1 || x.state == 3 || x.isLastEdited);
    if (updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(followUpList: FollowUpProcedureDto[]) {
    this.showDialog = false;
    this.onSave(followUpList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.RemoveExternalError();
    this.RemoveStepExternalError();
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.actionNameUnique'))
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.oneRoleType'))
    this.RemoveBusinessError(this.translate.instant('process.managefllowup.businessErrors.onlyOneRoleType'));
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }
  onClickCancel() {
    this.showDialog = false;
  }
}
