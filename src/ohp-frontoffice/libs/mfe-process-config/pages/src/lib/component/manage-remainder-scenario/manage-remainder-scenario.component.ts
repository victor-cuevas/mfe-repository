import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidRadioButtonConfig,
  FluidTextAreaConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { RemainderScenarioSteps } from './Models/remainder-scenario-steps.model';
import { RemainderScenarios } from './Models/remainder-scenariodto.model';
import { ReminderScenariosCodeTablesDto } from './Models/reminder-scenarios-codeTablesDto.model';
import { Dtostate } from './Models/dtobase.model';
import { ScenarioTxelTypeDto } from './Models/scenarion-txel.model';
import { CodeTable } from './Models/code-table.model';
import { ManageRemainderScenarioService } from './Service/manage-remainder-scenario.service';
import { CloseActionDto } from './Models/close-action.model';
import { ActionsForReminderStepDto } from './Models/action-remainderstepDto.model';
import { FollowupEventsForReminderStepDto } from './Models/followupEvents-reminder-StepDto.model';
import { CommunicationsDto } from './Models/communication.model';
import { ReminderCommunicationsDto } from './Models/remainder-communication.model';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mprsc-manage-remainder-scenario',
  templateUrl: './manage-remainder-scenario.component.html',
  styleUrls: ['./manage-remainder-scenario.component.scss']
})
export class ManageRemainderScenarioComponent implements OnInit {
  @ViewChild('remainderScenarioForm', { static: true }) remainderScenarioForm!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public RadioButtonConfig: FluidRadioButtonConfig = this.fluidService.FluidRadioButtonConfig;
  public TextAreaConfig: FluidTextAreaConfig = this.fluidService.FluidTextAreaConfig;

  public RequiredStartDate: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public RequiredMinPeriod: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredScenarioName: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTxelType: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredRemainderDue: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredPeriodBase: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  public RequiredStepName: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredElapsedPeriod: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredDuedate: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredAction: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredTemplate: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredContactMedium: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredTargetCreditstatus: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredBlockSending: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  placeholder = 'Select';

  EventHeader!: any[];
  TemplateHeader!: any[];
  ActionHeader!: any[];
  scenariosHeader!: any[];
  ProductHeader!: any[];
  stepoverviewHeader!: any[];

  //others
  showScenarioscreen!: boolean;
  showStepScreen!: boolean;
  showDialog!: boolean;
  showBackDialog!: boolean;
  numberOfDueDates!: string;
  defaultDate = new Date('01/01/1900');
  minDate!: Date;

  showActioncard = false;
  showActionGrid = true;

  showTemplatecard = false;
  showTemplateGrid = true;

  actionbusinessError!: string;
  businessError!: string;
  validationHeader!: string;
  txelBusinessError!: string;

  SelectedTabIndex!: number;
  intMaxValue = 2147483647;
  stepIntMax = 2147483647;
  dueIntMax = 2147483647;
  numberErrorDto: ErrorDto[] = [];
  blockingNumberErrorDto: ErrorDto[] = [];
  navigateURL: any;
  elapsedErrorDto: ErrorDto[] = [];
  duedateErrorDto: ErrorDto[] = [];

  //RemainderScenario Dto
  remainderScenarioList!: RemainderScenarios[];
  remainderScenarioData: RemainderScenarios = new RemainderScenarios();
  remainderScenarioCodeTable: ReminderScenariosCodeTablesDto = new ReminderScenariosCodeTablesDto();
  selectedRemainderScenario = new RemainderScenarios();
  deletedArray: RemainderScenarios[] = [];
  highlightRemainderScenario = new RemainderScenarios();

  //RemainderStep Dto
  remainderStepData: RemainderScenarioSteps = new RemainderScenarioSteps();
  highlightRemainderStepData = new RemainderScenarioSteps();
  /*Action Tab */
  tempAction: ActionsForReminderStepDto = new ActionsForReminderStepDto();
  actionrowIndex!: number;
  editedRow = false;
  newRow = false;
  actionData: ActionsForReminderStepDto = new ActionsForReminderStepDto();

  /*Communication Tab */
  newcommunicationRow = false;
  editcommuncationRow = false;
  tempcommuncationData = new CommunicationsDto();
  communcationRowIndex!: number;
  communicationData = new CommunicationsDto();
  exceptionBox !: boolean;
  errorCode !: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public datePipe: DatePipe,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public validationService: fluidValidationService,
    public remainderService: ManageRemainderScenarioService,
    public router: Router,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('process.Validation.Header');
    this.businessError = this.translate.instant('process.manage-remainder.ValidationError.buisnessError');
    this.actionbusinessError = this.translate.instant('process.manage-remainder.ValidationError.actionBusinessError');
    this.txelBusinessError = this.translate.instant('process.manage-remainder.ValidationError.TxelbusinessError');

    this.validationService.ActivateTabEvent.subscribe((selectedTabIndex: number) => {
      this.SelectedTabIndex = selectedTabIndex;
    });
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.showScenarioscreen = true;
    this.showStepScreen = false;
    this.buildConfiguration();

    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);

      /*CodeTableBinding */
      this.remainderScenarioCodeTable = data.remainderScenarioData.reminderScenarioCodeTables;

      /*RemainderScenario Data Binding */

      const updateRemainderScenarios = data.remainderScenarioData.reminderScenarioList.map((scenarioData: RemainderScenarios) => {
        const updatetxelList = scenarioData.txElTypes.map(x => {
          return { ...x, isDeleted: false };
        });

        return {
          ...scenarioData,
          startDate: new Date(scenarioData?.startDate),
          modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
          endDate: new Date(scenarioData.endDate as Date),
          modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
          randomNumber: this.generateRandomNumber(),
          isRowSelected: false,
          txElTypes: updatetxelList
        };
      });
      updateRemainderScenarios.forEach((x: RemainderScenarios) => {
        if (x.modifiedEndDate == null) x.endDate = null;
      });
      this.remainderScenarioList = [...updateRemainderScenarios];

      this.remainderScenarioList[0].isRowSelected = true;
      this.remainderScenarioData = this.remainderScenarioList[0];
      this.highlightRemainderScenario = this.remainderScenarioList[0];
      this.minDate = new Date(this.remainderScenarioData.startDate);
      this.minDate.setDate(this.minDate.getDate() + 1);
    });

    this.headervalues();
  }

  headervalues() {
    this.scenariosHeader = [
      { header: this.translate.instant('process.manage-remainder.tabel.scenarioname'), field: 'scenarioName', width: '45%' },
      {
        header: this.translate.instant('process.manage-remainder.tabel.startdate'),
        field: 'modifiedStartDate',
        dateSort: 'startDate',
        width: '25%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.enddate'),
        field: 'modifiedEndDate',
        dateSort: 'endDate',
        width: '25%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.'),
        field: 'remaindercustomizeDeleteButton',
        width: '5%',
        fieldType: 'remaindercustomizeDeleteButton',
        pSortableColumnDisabled: true
      }
    ];

    this.ProductHeader = [
      {
        header: this.translate.instant('process.manage-remainder.tabel.commercialName'),
        field: 'product.commercialName.caption',
        width: '50%'
      },
      { header: this.translate.instant('process.manage-remainder.tabel.creditStatus'), field: 'creditStatus.caption', width: '50%' }
    ];

    this.stepoverviewHeader = [
      {
        header: this.translate.instant('process.manage-remainder.tabel.stepseq'),
        field: 'seqNr',
        property: 'seqNr',
        width: '25%',
        hideColumn: false
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.stepName'),
        field: 'name',
        property: 'name',
        width: '25%',
        hideColumn: false
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.ElapsedPeriod'),
        field: 'elapsedPeriod',
        property: 'elapsedPeriod',
        width: '25%',
        hideColumn: false
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.OfDueDate'),
        field: 'numberOfDueDates',
        property: 'numberOfDueDates',
        width: '25%',
        hideColumn: false
      }
    ];

    this.ActionHeader = [
      {
        header: this.translate.instant('process.manage-remainder.tabel.ActionName'),
        field: 'ActionName',
        property: 'actionNamecaption',
        width: '25%',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.ActionReceiver'),
        field: 'action.actionReceiverTypeName.caption',
        property: 'actionReceiverTypeName',
        width: '25%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.ActionType'),
        field: 'action.actionType.caption',
        property: 'actionType',
        width: '25%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.'),
        field: 'edit',
        property: 'edit',
        pSortableColumnDisabled: true,
        width: '20%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.'),
        field: 'delete',
        property: 'delete',
        pSortableColumnDisabled: true,
        width: '5%'
      }
    ];

    this.TemplateHeader = [
      {
        header: this.translate.instant('process.manage-remainder.tabel.TemplateName'),
        field: 'communication.documentTemplate.name',
        property: 'documentTemplateName',
        width: '35%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.ContactMedium'),
        field: 'communication.communicationMedium.caption',
        property: 'communicationMedium',
        width: '35%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.'),
        field: 'edit',
        property: 'edit',
        pSortableColumnDisabled: true,
        width: '25%'
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.'),
        field: 'delete',
        property: 'delete',
        pSortableColumnDisabled: true,
        width: '5%'
      }
    ];

    this.EventHeader = [
      {
        header: this.translate.instant('process.manage-remainder.tabel.FollowupEventName'),
        field: 'FollowupEventName',
        property: 'dropdown',
        width: '95%',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('process.manage-remainder.tabel.'),
        field: 'delete',
        property: 'delete',
        width: '5%',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const startDateError = new ErrorDto();
    startDateError.validation = 'required';
    startDateError.isModelError = true;
    startDateError.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.startDate');
    this.RequiredStartDate.required = true;
    this.RequiredStartDate.Errors = [startDateError];

    const maxCalDayValidation = new ErrorDto();
    maxCalDayValidation.validation = 'maxError';
    maxCalDayValidation.isModelError = true;
    maxCalDayValidation.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.numberInt32Check');
    this.numberErrorDto = [maxCalDayValidation];
    const minPeriodError = new ErrorDto();
    minPeriodError.validation = 'required';
    minPeriodError.isModelError = true;
    minPeriodError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.minPeriod') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredMinPeriod.invalidDefaultValidation =
      this.translate.instant('process.manage-remainder.ValidationError.minPeriod') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredMinPeriod.required = true;
    this.RequiredMinPeriod.Errors = [minPeriodError];
    this.RequiredMinPeriod.maxValueValidation = this.translate.instant('process.manage-remainder.ValidationError.InputIncorrect');

    const reminderDaysPostDueDateError = new ErrorDto();
    reminderDaysPostDueDateError.validation = 'required';
    reminderDaysPostDueDateError.isModelError = true;
    reminderDaysPostDueDateError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.reminder') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredRemainderDue.required = true;
    this.RequiredRemainderDue.Errors = [reminderDaysPostDueDateError];

    const scenarioNameError = new ErrorDto();
    scenarioNameError.validation = 'required';
    scenarioNameError.isModelError = true;
    scenarioNameError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.scenarioName') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredScenarioName.required = true;
    this.RequiredScenarioName.Errors = [scenarioNameError];

    const txelError = new ErrorDto();
    txelError.validation = 'required';
    txelError.isModelError = true;
    txelError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.txel') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredTxelType.required = true;
    this.RequiredTxelType.Errors = [txelError];

    const periodBaseError = new ErrorDto();
    periodBaseError.validation = 'required';
    periodBaseError.isModelError = true;
    periodBaseError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.period') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredPeriodBase.required = true;
    this.RequiredPeriodBase.Errors = [periodBaseError];

    const stepnameNameError = new ErrorDto();
    stepnameNameError.validation = 'required';
    stepnameNameError.isModelError = true;
    stepnameNameError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.Name') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredStepName.required = true;
    this.RequiredStepName.Errors = [stepnameNameError];

    const elapsePeriodMaxValidation = new ErrorDto();
    elapsePeriodMaxValidation.validation = 'maxError';
    elapsePeriodMaxValidation.isModelError = true;
    elapsePeriodMaxValidation.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.numberInt32Check');
    this.elapsedErrorDto = [elapsePeriodMaxValidation];
    const elapsedPeriodError = new ErrorDto();
    elapsedPeriodError.validation = 'required';
    elapsedPeriodError.isModelError = true;
    elapsedPeriodError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.ElapsedPeriod') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredElapsedPeriod.invalidDefaultValidation =
      this.translate.instant('process.manage-remainder.ValidationError.ElapsedPeriod') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredElapsedPeriod.required = true;
    this.RequiredElapsedPeriod.Errors = [elapsedPeriodError];
    this.RequiredElapsedPeriod.maxValueValidation = this.translate.instant('process.manage-remainder.ValidationError.InputIncorrect');

    const noofDueDatMaxValidation = new ErrorDto();
    noofDueDatMaxValidation.validation = 'maxError';
    noofDueDatMaxValidation.isModelError = true;
    noofDueDatMaxValidation.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.numberInt32Check');
    this.duedateErrorDto = [noofDueDatMaxValidation];
    const noofDueDateError = new ErrorDto();
    noofDueDateError.validation = 'required';
    noofDueDateError.isModelError = true;
    noofDueDateError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.numberOf') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredDuedate.invalidDefaultValidation =
      this.translate.instant('process.manage-remainder.ValidationError.numberOf') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredDuedate.required = true;
    this.RequiredDuedate.Errors = [noofDueDateError];
    this.RequiredDuedate.maxValueValidation = this.translate.instant('process.manage-remainder.ValidationError.InputIncorrect');

    const actionError = new ErrorDto();
    actionError.validation = 'required';
    actionError.isModelError = true;
    actionError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.Actions') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredAction.required = true;
    this.RequiredAction.Errors = [actionError];

    const TemplateError = new ErrorDto();
    TemplateError.validation = 'required';
    TemplateError.isModelError = true;
    TemplateError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.Templates') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredTemplate.required = true;
    this.RequiredTemplate.Errors = [TemplateError];

    const ContactMediumError = new ErrorDto();
    ContactMediumError.validation = 'required';
    ContactMediumError.isModelError = true;
    ContactMediumError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.ContactMedium') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredContactMedium.required = true;
    this.RequiredContactMedium.Errors = [ContactMediumError];

    const TargetCreditError = new ErrorDto();
    TargetCreditError.validation = 'required';
    TargetCreditError.isModelError = true;
    TargetCreditError.validationMessage =
      this.translate.instant('process.manage-remainder.ValidationError.TargetStatus') +
      this.translate.instant('process.manage-remainder.ValidationError.required');
    this.RequiredTargetCreditstatus.required = false;
    this.RequiredTargetCreditstatus.Errors = [TargetCreditError];

    const blockSendingValidation = new ErrorDto();
    blockSendingValidation.validation = 'maxError';
    blockSendingValidation.isModelError = true;
    blockSendingValidation.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.numberInt32Check');
    this.blockingNumberErrorDto = [blockSendingValidation];
    const blockSendingError = new ErrorDto();
    blockSendingError.validation = 'required';
    blockSendingError.isModelError = true;
    this.RequiredBlockSending.required = true;
    this.RequiredBlockSending.Errors = [blockSendingError];
    this.RequiredBlockSending.maxValueValidation = this.translate.instant('process.manage-remainder.ValidationError.InputIncorrect');
  }

  /*Scenario Grid Selection */
  onscenarioRowSelected(event: RemainderScenarios) {
    const isEmptyTxel = this.onTxelValidCheck();
    const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

    const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

    if ((this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) || event.isRowSelected) {
      this.RemoveBusinessError(this.txelBusinessError);
      this.RemoveBusinessError(this.businessError);
      let updateRemainderData = this.remainderScenarioList;
      const prevIndex = updateRemainderData.findIndex(x => x.isRowSelected);
      updateRemainderData = this.rowDeselectData(updateRemainderData);

      this.remainderScenarioList[prevIndex].isRowSelected = updateRemainderData[prevIndex].isRowSelected;

      const selectedIndex = updateRemainderData.findIndex(x => x.randomNumber == event.randomNumber);

      this.remainderScenarioList[selectedIndex].isRowSelected = true;
      this.remainderScenarioData = this.remainderScenarioList[selectedIndex];
      this.highlightRemainderScenario = this.remainderScenarioList[selectedIndex];
      this.minDate = new Date(this.remainderScenarioData.startDate);
      this.minDate.setDate(this.minDate.getDate() + 1);
    } else {
      if (isDuplicateName || isDuplicateTxel) {
        if (isDuplicateTxel) {
          this.throwBusinessError(this.txelBusinessError);
          this.throwValidationError();
        }
        if (isDuplicateName) {
          this.throwBusinessError(this.businessError);
          this.throwValidationError();
        }
      } else {
        this.throwValidationError();
      }
    }
  }

  rowDeselectData(remainderList: RemainderScenarios[]) {
    const deSelectData = remainderList;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: RemainderScenarios) => {
            return {
              ...x,
              isRowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Add New Row */
  addNewScenario() {
    const isEmptyTxel = this.onTxelValidCheck();
    const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

    const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

    if (this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) {
      this.resetScenarioError();
      this.RemoveBusinessError(this.txelBusinessError);
      this.RemoveBusinessError(this.businessError);
      let updateScenarioList = [...this.remainderScenarioList];
      updateScenarioList = this.rowDeselectData(updateScenarioList);
      this.remainderScenarioData = new RemainderScenarios();
      this.remainderScenarioData.scenarioType = this.remainderScenarioCodeTable.scenarioTypeList[1];
      this.remainderScenarioData.isSelectedNumberOfDueDays = true;
      this.remainderScenarioData.txElTypes = [];
      const txeELdata = new ScenarioTxelTypeDto();
      txeELdata.state = 1;
      txeELdata.isDeleted = false;
      this.remainderScenarioData.txElTypes.push({ ...txeELdata });

      updateScenarioList.push({
        ...this.remainderScenarioData,
        randomNumber: this.generateRandomNumber(),
        state: 1,
        isRowSelected: true
      });

      this.remainderScenarioList = [...updateScenarioList];
      this.highlightRemainderScenario = this.remainderScenarioList[this.remainderScenarioList.length - 1];
    } else {
      if (isDuplicateName || isDuplicateTxel) {
        if (isDuplicateTxel) {
          this.throwBusinessError(this.txelBusinessError);
          this.throwValidationError();
        }
        if (isDuplicateName) {
          this.throwBusinessError(this.businessError);
          this.throwValidationError();
        }
      } else {
        this.throwValidationError();
      }
    }
  }

  onRowDelete(event: RemainderScenarios, remainderScenarioList: RemainderScenarios[]) {
    const isEmptyTxel = this.onTxelValidCheck();
    const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

    const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

    if ((this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) || event.isRowSelected) {
      const remainderList = [...remainderScenarioList];

      const todeleteIndex = remainderList.findIndex((data: RemainderScenarios) => {
        return data.randomNumber === event.randomNumber;
      });

      if (todeleteIndex != remainderList.length - 1) {
        if (remainderList[todeleteIndex].state == 1) {
          remainderList.splice(todeleteIndex, 1);
          this.removeScenarioError();
          this.RemoveBusinessError(this.businessError);
          this.RemoveBusinessError(this.txelBusinessError);
        } else {
          remainderList[todeleteIndex].state = 4;
          this.deletedArray.push({ ...remainderList[todeleteIndex] });
          remainderList.splice(todeleteIndex, 1);
          this.removeScenarioError();
          this.RemoveBusinessError(this.businessError);
          this.RemoveBusinessError(this.txelBusinessError);
        }

        if (remainderList.length > 0) {
          this.remainderScenarioList = this.rowDeselectData(remainderList);
          this.remainderScenarioList[0].isRowSelected = true;
          this.remainderScenarioData = this.remainderScenarioList[0];
          this.highlightRemainderScenario = this.remainderScenarioList[0];
        } else {
          this.remainderScenarioList = [];
          this.remainderScenarioData = new RemainderScenarios();
        }
      } else {
        if (remainderList[todeleteIndex].state == 1) {
          remainderList.splice(todeleteIndex, 1);
          this.removeScenarioError();
          this.RemoveBusinessError(this.businessError);
          this.RemoveBusinessError(this.txelBusinessError);
        } else {
          remainderList[todeleteIndex].state = 4;
          this.deletedArray.push({ ...remainderList[todeleteIndex] });
          remainderList.splice(todeleteIndex, 1);
          this.removeScenarioError();
          this.RemoveBusinessError(this.businessError);
          this.RemoveBusinessError(this.txelBusinessError);
        }

        if (remainderList.length > 0) {
          this.remainderScenarioList = this.rowDeselectData(remainderList);
          this.remainderScenarioList[remainderList.length - 1].isRowSelected = true;
          const lastIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
          this.remainderScenarioData = this.remainderScenarioList[lastIndex];
          this.highlightRemainderScenario = this.remainderScenarioList[lastIndex];
        } else {
          this.remainderScenarioList = [];
          this.remainderScenarioData = new RemainderScenarios();
        }
      }
    } else {
      if (isDuplicateName || isDuplicateTxel) {
        if (isDuplicateTxel) {
          this.throwBusinessError(this.txelBusinessError);
          this.throwValidationError();
        }
        if (isDuplicateName) {
          this.throwBusinessError(this.businessError);
          this.throwValidationError();
        }
      } else {
        this.throwValidationError();
      }
    }
  }
  /*Scenario Change Event */
  onScenarioNameChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);

    if (event.target.value != '') {
      if (selectedIndex >= 0) {
        const updateData = this.remainderScenarioList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.scenarioName = event.target.value;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.remainderScenarioList[selectedIndex].scenarioName = updategrid.scenarioName;
        this.remainderScenarioList[selectedIndex].state = updategrid.state;
        this.remainderScenarioData.scenarioName = event.target.value;
        this.RemoveBusinessError(this.businessError);
      }
    } else if (event.target.value == '') {
      if (selectedIndex >= 0) {
        const updateData = this.remainderScenarioList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.scenarioName = null;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.remainderScenarioList[selectedIndex].scenarioName = updategrid.scenarioName;
        this.remainderScenarioList[selectedIndex].state = updategrid.state;
        this.remainderScenarioData.scenarioName = null;
        this.RequiredScenarioName.externalError = true;
      }
    }
  }
  onStartDateChange(event: Date) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (event) {
      const displaystartDate = this.datePipe.transform(event, 'dd/MM/yyyy');
      if (selectedIndex >= 0) {
        const updateData = this.remainderScenarioList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.startDate = event;
        updategrid.modifiedStartDate = displaystartDate;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.remainderScenarioList[selectedIndex].startDate = updategrid.startDate;
        this.remainderScenarioList[selectedIndex].modifiedStartDate = updategrid.modifiedStartDate;
        this.remainderScenarioList[selectedIndex].state = updategrid.state;

        this.remainderScenarioData.startDate = event;
        this.minDate = new Date(this.remainderScenarioData.startDate);
        this.minDate.setDate(this.minDate.getDate() + 1);
      }
    } else {
      if (this.remainderScenarioList[selectedIndex].state != Dtostate.Created) {
        this.remainderScenarioList[selectedIndex].state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].startDate = event;
      this.remainderScenarioList[selectedIndex].modifiedStartDate = null;
      this.remainderScenarioData.startDate = event;
      this.RequiredStartDate.externalError = true;
    }
  }
  onEndDateChange(event: Date) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (event) {
      const displayEndDate = this.datePipe.transform(event, 'dd/MM/yyyy');
      if (selectedIndex >= 0) {
        const updateData = this.remainderScenarioList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.endDate = event;
        updategrid.modifiedEndDate = displayEndDate;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.remainderScenarioList[selectedIndex].endDate = updategrid.endDate;
        this.remainderScenarioList[selectedIndex].modifiedEndDate = updategrid.modifiedEndDate;
        this.remainderScenarioList[selectedIndex].state = updategrid.state;

        this.remainderScenarioData.endDate = event;
      }
    } else {
      if (this.remainderScenarioList[selectedIndex].state != Dtostate.Created) {
        this.remainderScenarioList[selectedIndex].state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].endDate = event;
      this.remainderScenarioList[selectedIndex].modifiedEndDate = null;
      this.remainderScenarioData.modifiedEndDate = event;
    }
  }
  onDueDayChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (selectedIndex >= 0) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.isSelectedNumberOfDueDays = true;
      updategrid.isSelectedElapsedPeriod = false;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].isSelectedNumberOfDueDays = updategrid.isSelectedNumberOfDueDays;
      this.remainderScenarioList[selectedIndex].isSelectedElapsedPeriod = updategrid.isSelectedElapsedPeriod;
      this.remainderScenarioList[selectedIndex].minPeriodBetweenSteps = null as unknown as number;
      this.remainderScenarioList[selectedIndex].reminderDaysPostDueDate = 0;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioList[selectedIndex].reminderScenarioPeriodBase = null;
      this.remainderScenarioList[selectedIndex].scenarioType = this.remainderScenarioCodeTable.scenarioTypeList[1];

      this.remainderScenarioData.isSelectedNumberOfDueDays = updategrid.isSelectedNumberOfDueDays;
      this.remainderScenarioData.isSelectedElapsedPeriod = updategrid.isSelectedElapsedPeriod;
      this.remainderScenarioData.scenarioType = this.remainderScenarioCodeTable.scenarioTypeList[1];
      this.remainderScenarioData.minPeriodBetweenSteps = null as unknown as number;
      this.remainderScenarioData.reminderDaysPostDueDate = 0;
      this.remainderScenarioData.reminderScenarioPeriodBase = null;
      this.removeElapsedPeriodError();
      this.RequiredMinPeriod.externalError = false;
      this.RequiredRemainderDue.externalError = false;
    }
  }

  onElapsedPeriodChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (selectedIndex >= 0) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.isSelectedNumberOfDueDays = false;
      updategrid.isSelectedElapsedPeriod = true;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].isSelectedNumberOfDueDays = updategrid.isSelectedNumberOfDueDays;
      this.remainderScenarioList[selectedIndex].isSelectedElapsedPeriod = updategrid.isSelectedElapsedPeriod;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioList[selectedIndex].reminderScenarioPeriodBase = null;
      this.remainderScenarioList[selectedIndex].minPeriodBetweenSteps = 0;
      this.remainderScenarioList[selectedIndex].reminderDaysPostDueDate = 0;
      this.remainderScenarioList[selectedIndex].scenarioType = this.remainderScenarioCodeTable.scenarioTypeList[0];

      this.remainderScenarioData.isSelectedElapsedPeriod = updategrid.isSelectedElapsedPeriod;
      this.remainderScenarioData.isSelectedNumberOfDueDays = updategrid.isSelectedNumberOfDueDays;
      this.remainderScenarioData.reminderScenarioPeriodBase = null;
      this.remainderScenarioData.scenarioType = this.remainderScenarioCodeTable.scenarioTypeList[0];
      this.remainderScenarioData.minPeriodBetweenSteps = 0;
      this.remainderScenarioData.reminderDaysPostDueDate = 0;
      this.removeDueErrors();
      this.RequiredPeriodBase.externalError = false;
    }
  }

  onCreditStatusChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (selectedIndex >= 0) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.setCreditStatusBackToNormal = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].setCreditStatusBackToNormal = updategrid.setCreditStatusBackToNormal;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.setCreditStatusBackToNormal = event;
    }
  }

  onUnblockPaymentChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (selectedIndex >= 0) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.unblockOutgoingPayments = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].unblockOutgoingPayments = updategrid.unblockOutgoingPayments;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.unblockOutgoingPayments = event;
    }
  }

  onresumeCommisionChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    if (selectedIndex >= 0) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.resumeCommissionPayments = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].resumeCommissionPayments = updategrid.resumeCommissionPayments;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.resumeCommissionPayments = event;
    }
  }
  onMinPeriodChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);

    if (event != null && event != '' && +event != 0) {
      if (selectedIndex >= 0) {
        if (+event > this.intMaxValue) {
          const updateData = this.remainderScenarioList;
          const updategrid = { ...updateData[selectedIndex] };
          updategrid.minPeriodBetweenSteps = +event;
          if (updategrid.state != Dtostate.Created) {
            updategrid.state = Dtostate.Dirty;
          }
          this.remainderScenarioList[selectedIndex].minPeriodBetweenSteps = updategrid.minPeriodBetweenSteps;
          this.remainderScenarioList[selectedIndex].state = updategrid.state;
          this.remainderScenarioData.minPeriodBetweenSteps = +event;
          this.RequiredMinPeriod.externalError = true;
        } else {
          const updateData = this.remainderScenarioList;
          const updategrid = { ...updateData[selectedIndex] };
          updategrid.minPeriodBetweenSteps = +event;
          if (updategrid.state != Dtostate.Created) {
            updategrid.state = Dtostate.Dirty;
          }
          this.remainderScenarioList[selectedIndex].minPeriodBetweenSteps = updategrid.minPeriodBetweenSteps;
          this.remainderScenarioList[selectedIndex].state = updategrid.state;
          this.remainderScenarioData.minPeriodBetweenSteps = +event;
        }
      }
    } else {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].minPeriodBetweenSteps = null as unknown as number;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.minPeriodBetweenSteps = null as unknown as number;
      this.remainderScenarioForm.controls['minPeriod'].setValue('');
      this.RequiredMinPeriod.externalError = true;
    }
  }
  onPostDueDateChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);

    if (event != '') {
      if (selectedIndex >= 0) {
        const updateData = this.remainderScenarioList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.reminderDaysPostDueDate = +event;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.remainderScenarioList[selectedIndex].reminderDaysPostDueDate = updategrid.reminderDaysPostDueDate;
        this.remainderScenarioList[selectedIndex].state = updategrid.state;
        this.remainderScenarioData.reminderDaysPostDueDate = +event;
      }
    }
    if (event == '') {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.reminderDaysPostDueDate = null as unknown as number;
      if (selectedIndex >= 0) {
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.remainderScenarioList[selectedIndex].reminderDaysPostDueDate = updategrid.reminderDaysPostDueDate;
        this.remainderScenarioList[selectedIndex].state = updategrid.state;
        this.remainderScenarioData.reminderDaysPostDueDate = null as unknown as number;

        this.RequiredRemainderDue.externalError = true;
      }
    }
  }
  onPeriodBaseChange(event: any) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);

    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.reminderScenarioPeriodBase = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].reminderScenarioPeriodBase = updategrid.reminderScenarioPeriodBase;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.reminderScenarioPeriodBase = event.value;
    } else if (event?.value == null) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.reminderScenarioPeriodBase = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].reminderScenarioPeriodBase = null;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.reminderScenarioPeriodBase = null;
      this.RequiredPeriodBase.externalError = true;
    }
  }
  ontxelChange(event: any, index: number) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);

    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.txElTypes[index].txElType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].txElTypes[index].txElType = updategrid.txElTypes[index].txElType;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.txElTypes[index].txElType = event.value;
    } else if (event?.value == null) {
      const updateData = this.remainderScenarioList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.txElTypes[index].txElType = event?.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.remainderScenarioList[selectedIndex].txElTypes[index].txElType = null;
      this.remainderScenarioList[selectedIndex].state = updategrid.state;
      this.remainderScenarioData.txElTypes[index].txElType = null;
      this.RequiredTxelType.externalError = true;
    }
  }
  /* ChangeEventEnds */

  /*TxelAdd*/
  onAddTxel() {
    const isEmptyTxel = this.onTxelValidCheck();
    const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

    const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

    if (this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) {
      this.RequiredTxelType.externalError = false;
      this.RemoveBusinessError(this.txelBusinessError);
      const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
      const txeELdata = new ScenarioTxelTypeDto();
      txeELdata.state = 1;
      txeELdata.isDeleted = false;

      this.remainderScenarioList[selectedIndex].txElTypes.push({ ...txeELdata });
      this.remainderScenarioData.txElTypes = this.remainderScenarioList[selectedIndex].txElTypes;
    } else {
      if (isDuplicateName || isDuplicateTxel) {
        if (isDuplicateTxel) {
          this.throwBusinessError(this.txelBusinessError);
          this.throwValidationError();
        }
        if (isDuplicateName) {
          this.throwBusinessError(this.businessError);
          this.throwValidationError();
        }
      } else {
        this.throwValidationError();
      }
    }
  }
  /*TxelAdd Ends */

  /*TXEL Delete */
  ontxelDelete(event: ScenarioTxelTypeDto, index: number) {
    const selectedIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    event.txElType = <CodeTable>{};
    setTimeout(() => {
      this.spliceProductDropdown(this.remainderScenarioList[selectedIndex].txElTypes, index);
    }, 100);

    if (this.remainderScenarioList[selectedIndex].state == Dtostate.Created) {
      this.remainderScenarioList[selectedIndex].state = Dtostate.Created;
    } else {
      this.remainderScenarioList[selectedIndex].state = Dtostate.Dirty;
    }
  }
  spliceProductDropdown(remainderScenariodata: ScenarioTxelTypeDto[], index: number) {
    this.RemoveBusinessError(this.txelBusinessError);
    remainderScenariodata[index].isDeleted = true;
  }

  duplicateTxelName(scenarioTxel: ScenarioTxelTypeDto[]) {
    const removeNullDateValue = scenarioTxel.filter((txelData: ScenarioTxelTypeDto) => txelData?.txElType && txelData?.txElType !== null);
    const uniqueValues = [...new Set(removeNullDateValue.map((txelData: ScenarioTxelTypeDto) => txelData?.txElType?.caption))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  onSaveandNext(scenarioList: RemainderScenarios[]) {
    const isEmptyTxel = this.onTxelValidCheck();
    const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

    const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
    const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

    if (this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) {
      scenarioList.forEach(x => {
        const notDeleted = x.txElTypes.filter(y => y.isDeleted == false);
        x.txElTypes = notDeleted;
      });

      scenarioList.map(scenarioData => {
        if (scenarioData.state != 0) {
          scenarioData.startDate = new Date(
            Date.UTC(scenarioData.startDate.getFullYear(), scenarioData.startDate.getMonth(), scenarioData.startDate.getDate(), 0, 0, 0)
          );

          if (scenarioData.endDate && scenarioData.modifiedEndDate != null) {
            scenarioData.endDate = new Date(
              Date.UTC(scenarioData.endDate.getFullYear(), scenarioData.endDate.getMonth(), scenarioData.endDate.getDate(), 0, 0, 0)
            );
          }
          this.deletedArray.push({ ...scenarioData });
        }
      });

      const selectedList = this.remainderScenarioList.filter(x => x.isRowSelected);

      this.remainderService.saveRemainderScenario(this.deletedArray).subscribe(
        scenarioresponse => {
          this.spinnerService.setIsLoading(false);
          this.showScenarioscreen = false;
          this.showStepScreen = true;
          this.deletedArray = [];
          const updateRemainderScenarios = scenarioresponse.map((scenarioData: RemainderScenarios) => {
            let updatetxelList: ScenarioTxelTypeDto[] = [];

            if (scenarioData.txElTypes.length > 0) {
              updatetxelList = scenarioData.txElTypes.map(x => {
                return { ...x, isDeleted: false, state: 0 };
              });
            }

            return {
              ...scenarioData,
              startDate: new Date(scenarioData?.startDate),
              modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
              endDate: new Date(scenarioData.endDate as Date),
              modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
              randomNumber: this.generateRandomNumber(),
              isRowSelected: false,
              txElTypes: updatetxelList,
              state: 0
            };
          });
          updateRemainderScenarios.forEach((x: RemainderScenarios) => {
            if (x.modifiedEndDate == null) x.endDate = null;
          });

          this.remainderScenarioList = [...updateRemainderScenarios];

          const scenarioIndex = this.remainderScenarioList.findIndex(x => x.scenarioName == selectedList[0].scenarioName);
          this.remainderScenarioList[scenarioIndex].isRowSelected = true;

          /*Hide Column Based on Elapsed or DueDate */
          if (this.remainderScenarioList[scenarioIndex].isSelectedElapsedPeriod) {
            const headerIndex = this.stepoverviewHeader.findIndex(x => x.field === 'numberOfDueDates');
            if (headerIndex != -1) this.stepoverviewHeader.splice(headerIndex, 1);
          } else {
            const headerIndex = this.stepoverviewHeader.findIndex(x => x.field === 'elapsedPeriod');
            if (headerIndex != -1) this.stepoverviewHeader.splice(headerIndex, 1);
          }

          this.remainderScenarioData = this.remainderScenarioList[scenarioIndex];

          this.selectedRemainderScenario = this.remainderScenarioList[scenarioIndex];

          if (this.remainderScenarioList[scenarioIndex].reminderScenarioSteps.length > 0) {
            const updateRemainderSteps = this.remainderScenarioList[scenarioIndex].reminderScenarioSteps.map(
              (stepsData: RemainderScenarioSteps) => {
                const updatedList = stepsData.followupEventsForReminderStep.map((x: FollowupEventsForReminderStepDto) => {
                  return { ...x, isDeleted: false, state: 0 };
                });

                const updateActionList = stepsData.actionsForReminderStep.map((actionData: ActionsForReminderStepDto) => {
                  return { ...actionData, isDeleted: false, state: 0 };
                });

                const updateCommuncationList = stepsData.communicationList.map((commmunicationData: ReminderCommunicationsDto) => {
                  return { ...commmunicationData, isDeleted: false, state: 0 };
                });

                return {
                  ...stepsData,
                  randomNumber: this.generateRandomNumber(),
                  isRowSelected: false,
                  followupEventsForReminderStep: updatedList,
                  actionsForReminderStep: updateActionList,
                  communicationList: updateCommuncationList
                };
              }
            );

            updateRemainderSteps[0].isRowSelected = true;

            this.remainderScenarioList[scenarioIndex].reminderScenarioSteps = [...updateRemainderSteps];

            this.remainderStepData = this.remainderScenarioList[scenarioIndex].reminderScenarioSteps[0];
            this.highlightRemainderStepData = this.remainderScenarioList[scenarioIndex].reminderScenarioSteps[0];
            if (this.remainderStepData.changeCreditStatus) {
              this.RequiredTargetCreditstatus.required = true;
            } else {
              this.RequiredTargetCreditstatus.required = false;
            }
          }
        },
        err => {
          this.deletedArray = [];
          if(err?.error?.errorCode){
            this.errorCode = err.error.errorCode;
          }else{
            this.errorCode= 'InternalServiceFault';
          }
          this.spinnerService.setIsLoading(false);
          this.exceptionBox = true;
        }
      );
    } else {
      if (isDuplicateName || isDuplicateTxel) {
        if (isDuplicateTxel) {
          this.throwBusinessError(this.txelBusinessError);
          this.throwValidationError();
        }
        if (isDuplicateName) {
          this.throwBusinessError(this.businessError);
          this.throwValidationError();
        }
      } else {
        this.throwValidationError();
      }
    }
  }

  /*TxelEmpty Check */

  onTxelValidCheck() {
    if (this.remainderScenarioData.txElTypes && this.remainderScenarioData.txElTypes.length > 0) {
      for (let i = 0; i < this.remainderScenarioData.txElTypes.length; i++) {
        if (!this.remainderScenarioData.txElTypes[i].txElType || this.remainderScenarioData.txElTypes[i].txElType === <CodeTable>{}) {
          return true;
        }
      }
    }
    return false;
  }

  /*Validation */
  throwBusinessError(ErrorMessage: string) {
    if (this.validationService.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage;
      });
      if (index == -1) {
        this.validationService.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
      }
    } else {
      this.validationService.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.validationService.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError
      );

      if (Index >= 0) {
        this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }

  throwValidationError() {
    this.RequiredStartDate.externalError = true;
    this.RequiredMinPeriod.externalError = true;
    this.RequiredScenarioName.externalError = true;
    this.RequiredRemainderDue.externalError = true;
    this.RequiredPeriodBase.externalError = true;
    this.RequiredTxelType.externalError = true;
  }
  resetScenarioError() {
    this.RequiredStartDate.externalError = false;
    this.RequiredMinPeriod.externalError = false;
    this.RequiredScenarioName.externalError = false;
    this.RequiredRemainderDue.externalError = false;
    this.RequiredPeriodBase.externalError = false;
    this.RequiredTxelType.externalError = false;
  }

  removeScenarioError() {
    const removeTxel = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.txel') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeTxel >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeTxel, 1);
    }
  }

  removeElapsedPeriodError() {
    const removePeriodBase = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.period') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removePeriodBase >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removePeriodBase, 1);
    }
  }

  removeDueErrors() {
    const removeMinPeriodError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.minPeriod') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeMinPeriodError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeMinPeriodError, 1);
    }

    const removePostDue = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.reminder') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removePostDue >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removePostDue, 1);
    }
  }

  isDuplicateScenarioNameExists(newgridDate: RemainderScenarios[]) {
    const removeNullDateValue = newgridDate.filter((date: RemainderScenarios) => date?.scenarioName && date?.scenarioName !== '');
    const uniqueValues = [...new Set(removeNullDateValue.map((date: RemainderScenarios) => date?.scenarioName))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  /*StepRowSelect */

  onStepRowClicked(event: RemainderScenarioSteps) {
    const duplicateStepName = this.duplicateStepName(this.selectedRemainderScenario.reminderScenarioSteps);

    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
    const isduplicateActionExist = this.isDuplicateActionNameExists(
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep
    );

    if (this.remainderScenarioForm.valid && !duplicateStepName && !isduplicateActionExist) {
      this.RemoveBusinessError(this.businessError);
      this.RemoveBusinessError(this.actionbusinessError);

      const selectedScenarioIndex = this.remainderScenarioList.findIndex(x => x.isRowSelected);
      let scenarioStepList = this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps;
      const prevIndex = scenarioStepList.findIndex(x => x.isRowSelected);
      scenarioStepList = this.rowDeselectSteps(scenarioStepList);

      this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps[prevIndex].isRowSelected =
        scenarioStepList[prevIndex].isRowSelected;

      const selectedStepIndex = scenarioStepList.findIndex(x => x.randomNumber == event.randomNumber);
      this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps[selectedStepIndex].isRowSelected = true;
      this.remainderStepData = this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps[selectedStepIndex];
      this.highlightRemainderStepData = this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps[selectedStepIndex];
      if (this.remainderStepData.changeCreditStatus) {
        this.RequiredTargetCreditstatus.required = true;
      } else {
        this.RequiredTargetCreditstatus.required = false;
      }
    } else {
      if (duplicateStepName || isduplicateActionExist) {
        if (isduplicateActionExist) {
          this.throwBusinessError(this.actionbusinessError);
          this.throwStepValidationError();
        }
        if (duplicateStepName) {
          this.throwBusinessError(this.businessError);
          this.throwStepValidationError();
        }
      } else {
        this.throwStepValidationError();
      }
    }
  }

  rowDeselectSteps(stepList: RemainderScenarioSteps[]) {
    const deSelectData = stepList;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: RemainderScenarioSteps) => {
            return {
              ...x,
              isRowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Add New Step */
  onNewStep() {
    const duplicateStepName = this.duplicateStepName(this.selectedRemainderScenario.reminderScenarioSteps);
    let isduplicateActionExist = false;
    if (this.selectedRemainderScenario.reminderScenarioSteps.length > 0) {
      const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
      isduplicateActionExist = this.isDuplicateActionNameExists(
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep
      );
    }

    if (this.remainderScenarioForm.valid && !duplicateStepName && !isduplicateActionExist) {
      this.removeStepValidationError();
      this.RemoveBusinessError(this.businessError);
      const selectedScenarioIndex = this.remainderScenarioList.findIndex(x => x.isRowSelected);
      let scenarioStepList = this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps;
      scenarioStepList = this.rowDeselectSteps(scenarioStepList);
      this.remainderStepData = new RemainderScenarioSteps();
      this.remainderStepData.communicationList = [];
      this.remainderStepData.actionsForReminderStep = [];
      this.remainderStepData.followupEventsForReminderStep = [];
      this.remainderStepData.scenarioType = this.remainderScenarioList[selectedScenarioIndex].scenarioType;

      if (this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps.length == 0) {
        this.remainderStepData.seqNr = 1;
      } else {
        const maxSeqNr = Math.max(...this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps.map(o => o.seqNr), 0);
        this.remainderStepData.seqNr = maxSeqNr + 1;
      }

      if (this.remainderStepData?.changeCreditStatus == true) {
        this.RequiredTargetCreditstatus.required = true;
      } else {
        this.RequiredTargetCreditstatus.required = false;
      }

      scenarioStepList.push({
        ...this.remainderStepData,
        randomNumber: this.generateRandomNumber(),
        state: 1,
        isRowSelected: true
      });

      this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps = [...scenarioStepList];
      this.selectedRemainderScenario.state = 3;
      this.highlightRemainderStepData =
        this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps[
          this.remainderScenarioList[selectedScenarioIndex].reminderScenarioSteps.length - 1
        ];
    } else {
      if (duplicateStepName || isduplicateActionExist) {
        if (isduplicateActionExist) {
          this.throwBusinessError(this.actionbusinessError);
          this.throwStepValidationError();
        }
        if (duplicateStepName) {
          this.throwBusinessError(this.businessError);
          this.throwStepValidationError();
        }
      } else {
        this.throwStepValidationError();
      }
    }
  }

  /*StepOverview ChangeEvent */
  onstepNameChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (event.target.value != '') {
      if (selectedStepIndex >= 0) {
        const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
        const updategrid = { ...updateData[selectedStepIndex] };
        updategrid.name = event.target.value;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].name = updategrid.name;
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
        this.selectedRemainderScenario.state = Dtostate.Dirty;
        this.remainderStepData.name = event.target.value;
      }
    } else if (event.target.value == '') {
      if (selectedStepIndex >= 0) {
        const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
        const updategrid = { ...updateData[selectedStepIndex] };
        updategrid.name = null;
        if (updategrid.state != Dtostate.Created) {
          updategrid.state = Dtostate.Dirty;
        }
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].name = null;
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
        this.selectedRemainderScenario.state = Dtostate.Dirty;
        this.remainderStepData.name = null;
        this.RequiredStepName.externalError = true;
      }
    }
  }

  onDueElapsedChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
    if (event != '' && +event != 0 && +event.length < 10) {
      if (selectedStepIndex >= 0) {
        if (+event > 2147483647) {
          this.stepIntMax = 2147483647;
          const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
          const updategrid = { ...updateData[selectedStepIndex] };
          updategrid.elapsedPeriod = +event;
          if (updategrid.state != Dtostate.Created) {
            updategrid.state = Dtostate.Dirty;
          }
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].elapsedPeriod = updategrid.elapsedPeriod;
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
          this.selectedRemainderScenario.state = Dtostate.Dirty;
          this.remainderStepData.elapsedPeriod = +event;

          const elapsePeriodMaxValidation = new ErrorDto();
          elapsePeriodMaxValidation.validation = 'maxError';
          elapsePeriodMaxValidation.isModelError = true;
          elapsePeriodMaxValidation.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.numberInt32Check');
          this.elapsedErrorDto = [elapsePeriodMaxValidation];
          this.RequiredElapsedPeriod.maxValueValidation = this.translate.instant('process.manage-remainder.ValidationError.InputIncorrect');

          this.RequiredElapsedPeriod.externalError = true;
        } else {
          if (+event.length >= 7) {
            this.stepIntMax = 999999;
            const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
            const updategrid = { ...updateData[selectedStepIndex] };
            updategrid.elapsedPeriod = +event;
            if (updategrid.state != Dtostate.Created) {
              updategrid.state = Dtostate.Dirty;
            }
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].elapsedPeriod = updategrid.elapsedPeriod;
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
            this.selectedRemainderScenario.state = Dtostate.Dirty;
            this.remainderStepData.elapsedPeriod = +event;
            const elapsePeriodMaxValidation = new ErrorDto();
            elapsePeriodMaxValidation.validation = 'maxError';
            elapsePeriodMaxValidation.isModelError = true;
            elapsePeriodMaxValidation.validationMessage = this.translate.instant(
              'process.manage-remainder.ValidationError.ElapsedMaxValdation'
            );
            this.elapsedErrorDto = [elapsePeriodMaxValidation];
            this.RequiredElapsedPeriod.maxValueValidation = this.translate.instant(
              'process.manage-remainder.ValidationError.ElapsedMaxValdation'
            );
            this.RequiredElapsedPeriod.externalError = true;
          } else {
            const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
            const updategrid = { ...updateData[selectedStepIndex] };
            updategrid.elapsedPeriod = +event;
            if (updategrid.state != Dtostate.Created) {
              updategrid.state = Dtostate.Dirty;
            }
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].elapsedPeriod = updategrid.elapsedPeriod;
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
            this.selectedRemainderScenario.state = Dtostate.Dirty;
            this.remainderStepData.elapsedPeriod = +event;
          }
        }
      }
    } else {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].elapsedPeriod = null as unknown as number;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.elapsedPeriod = null as unknown as number;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
      this.remainderScenarioForm.controls['dueElapsed'].setValue('');
      this.RequiredElapsedPeriod.externalError = true;
    }
  }

  onNumberofDueChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
    if (event != '' && event != null) {
      if (selectedStepIndex >= 0) {
        if (+event > 2147483647) {
          this.dueIntMax = 2147483647;
          const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
          const updategrid = { ...updateData[selectedStepIndex] };
          updategrid.numberOfDueDates = +event;
          if (updategrid.state != Dtostate.Created) {
            updategrid.state = Dtostate.Dirty;
          }
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].numberOfDueDates = updategrid.numberOfDueDates;
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
          this.selectedRemainderScenario.state = Dtostate.Dirty;
          this.remainderStepData.numberOfDueDates = +event;

          const DueDateMaxValidation = new ErrorDto();
          DueDateMaxValidation.validation = 'maxError';
          DueDateMaxValidation.isModelError = true;
          DueDateMaxValidation.validationMessage = this.translate.instant('process.manage-remainder.ValidationError.numberInt32Check');
          this.duedateErrorDto = [DueDateMaxValidation];
          this.RequiredDuedate.maxValueValidation = this.translate.instant('process.manage-remainder.ValidationError.InputIncorrect');

          this.RequiredDuedate.externalError = true;
        } else {
          if (+event.length >= 7) {
            this.dueIntMax = 999999;
            const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
            const updategrid = { ...updateData[selectedStepIndex] };
            updategrid.numberOfDueDates = +event;
            if (updategrid.state != Dtostate.Created) {
              updategrid.state = Dtostate.Dirty;
            }
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].numberOfDueDates = updategrid.numberOfDueDates;
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
            this.selectedRemainderScenario.state = Dtostate.Dirty;
            this.remainderStepData.numberOfDueDates = +event;

            const DueDateMaxValidation = new ErrorDto();
            DueDateMaxValidation.validation = 'maxError';
            DueDateMaxValidation.isModelError = true;
            DueDateMaxValidation.validationMessage = this.translate.instant(
              'process.manage-remainder.ValidationError.DueAmountMaxValdation'
            );
            this.duedateErrorDto = [DueDateMaxValidation];
            this.RequiredDuedate.maxValueValidation = this.translate.instant(
              'process.manage-remainder.ValidationError.DueAmountMaxValdation'
            );

            this.RequiredDuedate.externalError = true;
          } else {
            const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
            const updategrid = { ...updateData[selectedStepIndex] };
            updategrid.numberOfDueDates = +event;
            if (updategrid.state != Dtostate.Created) {
              updategrid.state = Dtostate.Dirty;
            }
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].numberOfDueDates = updategrid.numberOfDueDates;
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
            this.selectedRemainderScenario.state = Dtostate.Dirty;
            this.remainderStepData.numberOfDueDates = +event;
          }
        }
      }
    } else {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].numberOfDueDates = null as unknown as number;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.numberOfDueDates = null as unknown as number;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
      this.remainderScenarioForm.controls['numberofdue'].setValue('');
      this.RequiredDuedate.externalError = true;
    }
  }
  onMinDueChange(event: any, ischanged: boolean) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (event != null && event != '') {
      if (!ischanged) {
        const eventConversion = event.toString().split('.').join('');
        const value = eventConversion.toString().replace(',', '.');
        const floatValue = parseFloat(value).toFixed(2);
        // const floatValueReplaced = floatValue.toString().replace('.', ',')

        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].minDueAmount = parseFloat(floatValue);
        this.selectedRemainderScenario.state = Dtostate.Dirty;
      }
    } else {
      setTimeout(() => {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].minDueAmount = 0;
        this.selectedRemainderScenario.state = Dtostate.Dirty;
      }, 4);
    }
  }

  onCreditBureauChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.notifyCreditBureau = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].notifyCreditBureau = updategrid.notifyCreditBureau;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.notifyCreditBureau = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }

  oncbActionCodeChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0 && event?.value != null) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.cbActionCode = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].cbActionCode = updategrid.cbActionCode;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.cbActionCode = event.value;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    } else if (event?.value == null) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.cbActionCode = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].cbActionCode = null;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.cbActionCode = null;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }

  onReminderChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.isReminder = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].isReminder = updategrid.isReminder;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.isReminder = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }

  onChargeIOAChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.chargeIOA = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].chargeIOA = updategrid.chargeIOA;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.chargeIOA = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }

  isFormalNoticeChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.isFormalNotice = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].isFormalNotice = updategrid.isFormalNotice;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.isFormalNotice = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  onStopCommissionChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.stopCommission = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].stopCommission = updategrid.stopCommission;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.stopCommission = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }

  oncreditstatusChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (event) {
      this.RequiredTargetCreditstatus.required = true;
      // this.RequiredTargetCreditstatus.externalError = true;
    } else {
      this.RequiredTargetCreditstatus.required = false;
      this.RequiredTargetCreditstatus.externalError = false;
    }

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.changeCreditStatus = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].changeCreditStatus = updategrid.changeCreditStatus;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.changeCreditStatus = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  onTargetCreditStatus(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0 && event?.value != null) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.targetCreditStatus = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].targetCreditStatus = updategrid.targetCreditStatus;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.targetCreditStatus = event.value;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    } else if (event?.value == null) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.targetCreditStatus = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].targetCreditStatus = null;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.targetCreditStatus = null;

      this.selectedRemainderScenario.state = Dtostate.Dirty;
      if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].changeCreditStatus) {
        this.RequiredTargetCreditstatus.externalError = true;
      } else {
        this.RequiredTargetCreditstatus.externalError = false;
      }
    }
  }
  onNotifyCreditChanged(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.notifyCreditInsurer = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].notifyCreditInsurer = updategrid.notifyCreditInsurer;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.notifyCreditInsurer = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  onSuspendDirectDebitChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.suspendDirectDebit = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].suspendDirectDebit = updategrid.suspendDirectDebit;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.suspendDirectDebit = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  onBlockOutgoingChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.blockOutgoingPayments = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].blockOutgoingPayments = updategrid.blockOutgoingPayments;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.blockOutgoingPayments = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  onSetServicingchange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.setServicingNoticeUponDebtorDate = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].setServicingNoticeUponDebtorDate =
        updategrid.setServicingNoticeUponDebtorDate;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.setServicingNoticeUponDebtorDate = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  /*StepOverview ChangeEvent Ends */

  /*Add Action */
  onAddAction() {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    const isduplicateExist = this.isDuplicateActionNameExists(
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep
    );
    if (!isduplicateExist) {
      this.showActioncard = true;
      this.showActionGrid = false;

      this.RequiredAction.externalError = false;
      const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
      const actionremainderdata = new ActionsForReminderStepDto();
      const closeAction = new CloseActionDto();
      actionremainderdata.action = closeAction;
      actionremainderdata.state = 1;
      actionremainderdata.isDeleted = false;
      this.newRow = true;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep.push({ ...actionremainderdata });
      if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state != 1) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = 3;
      }

      this.selectedRemainderScenario.state = 3;

      this.actionrowIndex = this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep.length - 1;
    } else {
      this.throwBusinessError(this.actionbusinessError);
    }
  }

  /*SaveAction */
  onSaveAction() {
    if (this.actionData.action != null) {
      this.showActioncard = false;
      this.showActionGrid = true;
      const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
      if (this.actionrowIndex >= 0 && this.tempAction) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep[this.actionrowIndex].action =
          this.tempAction.action;

        if (
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep[this.actionrowIndex].state != 1
        ) {
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep[this.actionrowIndex].state = 3;

          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = 3;

          this.selectedRemainderScenario.state = 3;
        }
      }
      this.actionrowIndex = null as unknown as number;
      this.tempAction.action = null;
      this.editedRow = false;
      this.newRow = false;
      this.actionData = new ActionsForReminderStepDto();
    } else {
      this.RequiredAction.externalError = true;
    }
  }

  /*cancelAction */
  onCancelAction() {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (this.actionrowIndex >= 0 && this.newRow) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep.splice(this.actionrowIndex, 1);
    }

    this.RemoveActionError();
    this.showActionGrid = true;
    this.showActioncard = false;
    this.tempAction.action = null;
    this.editedRow = false;
    this.newRow = false;
    this.actionrowIndex = null as unknown as number;
    this.actionData = new ActionsForReminderStepDto();
    this.RequiredAction.externalError = false;
  }

  /*ActionTab ChangeEvent */

  onActionChange(event: any) {
    if (event.value != null) {
      this.tempAction.action = event?.value;
      this.actionData.action = event?.value;
    } else {
      this.actionData.action = null;
      this.tempAction.action = null;
      this.RequiredAction.externalError = true;
    }
  }

  /*ActionTabEditData */
  onEditAction(rowData: ActionsForReminderStepDto, index: number) {
    this.showActioncard = true;
    this.showActionGrid = false;
    this.actionData.action = rowData?.action;
    this.tempAction.action = rowData.action;
    this.actionrowIndex = index;
    this.editedRow = true;
  }
  /*ActionTabEditData Ends*/

  onDeleteAction(rowData: ActionsForReminderStepDto, index: number) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    setTimeout(() => {
      this.spliceAction(this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].actionsForReminderStep, index);
    }, 100);

    if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state == Dtostate.Created) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Created;
    } else {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Dirty;
    }
    this.selectedRemainderScenario.state = 3;
  }

  spliceAction(actionData: ActionsForReminderStepDto[], index: number) {
    actionData[index].isDeleted = true;
    this.RemoveBusinessError(this.actionbusinessError);
  }

  /*Add New Row in Communication */

  onAddTemplate() {
    this.showTemplatecard = true;
    this.showTemplateGrid = false;
    this.RequiredContactMedium.externalError = false;
    this.RequiredTemplate.externalError = false;
    this.RequiredBlockSending.externalError = false;

    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
    const remaindercommunication = new ReminderCommunicationsDto();
    const communication = new CommunicationsDto();
    remaindercommunication.communication = communication;
    remaindercommunication.communication.state = 1;
    remaindercommunication.state = 1;
    remaindercommunication.isDeleted = false;

    this.newcommunicationRow = true;
    this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList.push({ ...remaindercommunication });
    if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state != 1) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = 3;
    }
    this.selectedRemainderScenario.state = 3;

    this.communcationRowIndex = this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList.length - 1;
  }

  /*Communication Tab ChangeEvent*/
  onTemplateNameChange(event: any) {
    if (event.value != null) {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.documentTemplate = event.value;
      this.communicationData.documentTemplate = event.value;
    } else {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.documentTemplate = null;
      this.communicationData.documentTemplate = null;
      this.RequiredTemplate.externalError = true;
    }
  }

  onContactMediumChange(event: any) {
    if (event.value != null) {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.communicationMedium = event.value;
      this.communicationData.communicationMedium = event.value;
    } else {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.communicationData.communicationMedium = null;
      this.tempcommuncationData.communicationMedium = null;

      this.RequiredContactMedium.externalError = true;
    }
  }

  onRoleTypeChange(event: any) {
    if (event.value != null) {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.roleType = event.value;
      this.communicationData.roleType = event.value;
    } else {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.roleType = null;
      this.communicationData.roleType = null;
    }
  }

  onAdminRoleChange(event: any) {
    if (event.value != null) {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.adminRoleType = event.value;
      this.communicationData.adminRoleType = event.value;
    } else {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.adminRoleType = null;
      this.communicationData.adminRoleType = null;
    }
  }

  onCollectionRoleChange(event: any) {
    if (event.value != null) {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.collectionsRoleType = event.value;
      this.communicationData.collectionsRoleType = event.value;
    } else {
      if (this.communicationData.state != 1) {
        this.communicationData.state = 3;
        this.tempcommuncationData.state = 3;
      }
      this.tempcommuncationData.collectionsRoleType = null;
      this.communicationData.collectionsRoleType = null;
    }
  }

  onRegisterSendChange(event: any) {
    if (this.communicationData.state != 1) {
      this.communicationData.state = 3;
      this.tempcommuncationData.state = 3;
    }
    this.tempcommuncationData.registeredLetter = event;
  }

  onBlockSendingChange(event: any) {
    if (this.communicationData.state != 1) {
      this.communicationData.state = 3;
      this.tempcommuncationData.state = 3;
    }
    this.tempcommuncationData.onlySendAfterPeriod = event;
  }

  periodToverifyChange(event: any) {
    if (this.communicationData.state != 1) {
      this.communicationData.state = 3;
      this.tempcommuncationData.state = 3;
    }
    if (+event > this.intMaxValue) {
      this.tempcommuncationData.periodToVerify = +event;
      this.RequiredBlockSending.externalError = true;
    } else {
      this.tempcommuncationData.periodToVerify = +event;
    }
  }

  /*Communication Tab ChangeEvent Ends*/

  /*Communcation Tab EditData */
  onEditCommunication(rowData: ReminderCommunicationsDto, index: number) {
    this.showTemplatecard = true;
    this.showTemplateGrid = false;
    rowData.communication.state = 3;
    this.tempcommuncationData = { ...rowData.communication };
    this.communicationData = { ...rowData.communication };
    this.communcationRowIndex = index;
    this.editcommuncationRow = true;
    this.newcommunicationRow = false;
  }
  /*Communcation Tab EditData Ends */

  onDeleteCommuncation(rowData: ReminderCommunicationsDto, index: number) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    setTimeout(() => {
      this.spliceCommunication(this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList, index);
    }, 100);

    if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state == Dtostate.Created) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Created;
    } else {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Dirty;
    }

    this.selectedRemainderScenario.state = 3;
  }

  spliceCommunication(communicationData: ReminderCommunicationsDto[], deleteIndex: number) {
    communicationData[deleteIndex].isDeleted = true;
  }

  /*Communication Tab Save and Cancel*/
  onTemplateSave() {
    if (this.communicationData.documentTemplate != null && this.communicationData.communicationMedium != null) {
      this.showTemplatecard = false;
      this.showTemplateGrid = true;
      const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);
      if (this.communcationRowIndex >= 0 && this.tempcommuncationData) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList[this.communcationRowIndex].communication =
          this.tempcommuncationData;

        if (
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList[this.communcationRowIndex].state != 1
        ) {
          this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList[this.communcationRowIndex].state = 3;

          if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state != 1) {
            this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = 3;
          }

          this.selectedRemainderScenario.state = 3;
        }
      }
      this.communcationRowIndex = null as unknown as number;
      this.tempcommuncationData = new CommunicationsDto();
      this.editcommuncationRow = false;
      this.newcommunicationRow = false;
      this.communicationData = new CommunicationsDto();
    } else {
      this.RequiredTemplate.externalError = true;
      this.RequiredContactMedium.externalError = true;
    }
  }

  onTemplateCancel() {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (this.communcationRowIndex >= 0 && this.newcommunicationRow) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].communicationList.splice(this.communcationRowIndex, 1);
    }

    this.RemoveCommunicationError();
    this.communcationRowIndex = null as unknown as number;
    this.tempcommuncationData = new CommunicationsDto();
    this.editcommuncationRow = false;
    this.newcommunicationRow = false;
    this.communicationData = new CommunicationsDto();
    this.showTemplatecard = false;
    this.showTemplateGrid = true;
  }

  /*Add FollowUpEvent */
  onAddEvent() {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    const FollowUpEvent = new FollowupEventsForReminderStepDto();
    FollowUpEvent.state = 1;
    FollowUpEvent.isDeleted = false;

    this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep.push({ ...FollowUpEvent });

    this.remainderStepData.followupEventsForReminderStep = [
      ...this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep
    ];
  }

  /*FollowUpEvent Tab Change*/
  onFollowUpEventChange(event: any, index: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (event?.value != null) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep[index].eventName = event.value;

      this.remainderStepData.followupEventsForReminderStep[index].eventName = event.value;

      if (
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep[index].state !=
        Dtostate.Created
      ) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep[index].state !=
          Dtostate.Dirty;
      }
      if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state != 1) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Dirty;
      }

      this.selectedRemainderScenario.state = Dtostate.Dirty;
    } else {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep[index].eventName = null;

      this.remainderStepData.followupEventsForReminderStep[index].eventName = null;
      if (
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep[index].state !=
        Dtostate.Created
      ) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep[index].state !=
          Dtostate.Dirty;
      }
      if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state != 1) {
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }
  /* FollowUpEvent Tab Change ends*/

  /*FollowUpEvent Row Delete */
  onFollowUpEventRowDelete(rowData: FollowupEventsForReminderStepDto, index: number) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    rowData.eventName = <CodeTable>{};
    setTimeout(() => {
      this.spliceFollowUpEvent(
        this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].followupEventsForReminderStep,
        index
      );
    }, 100);

    if (this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state == Dtostate.Created) {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Created;
    } else {
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = Dtostate.Dirty;
    }
    this.selectedRemainderScenario.state = 3;
  }

  spliceFollowUpEvent(followUpList: FollowupEventsForReminderStepDto[], index: number) {
    followUpList[index].isDeleted = true;
  }

  /*FollowUpEvent Row Delete Ends*/

  /*Notes Tab EventChange */
  onNotesChange(event: any) {
    const selectedStepIndex = this.selectedRemainderScenario.reminderScenarioSteps.findIndex(x => x.isRowSelected);

    if (selectedStepIndex >= 0) {
      const updateData = this.selectedRemainderScenario.reminderScenarioSteps;
      const updategrid = { ...updateData[selectedStepIndex] };
      updategrid.notes = event;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].notes = updategrid.notes;
      this.selectedRemainderScenario.reminderScenarioSteps[selectedStepIndex].state = updategrid.state;
      this.remainderStepData.notes = event;
      this.selectedRemainderScenario.state = Dtostate.Dirty;
    }
  }

  onBack(remainderScenarioList: RemainderScenarios[]) {
    const IsDirty = remainderScenarioList.filter(x => x.state != 0);
    if (IsDirty.length > 0) {
      this.showBackDialog = true;
    } else {
      this.spinnerService.setIsLoading(false);
      this.remainderService.getRemainderScenario().subscribe((data: any) => {
        this.spinnerService.setIsLoading(false);
        /*CodeTableBinding */
        this.remainderScenarioCodeTable = data.reminderScenarioCodeTables;

        // /*RemainderScenario Data Binding */

        const updateRemainderScenarios = data.reminderScenarioList.map((scenarioData: RemainderScenarios) => {
          this.showScenarioscreen = true;
          this.showStepScreen = false;
          const updatetxelList = scenarioData.txElTypes.map(x => {
            return { ...x, isDeleted: false };
          });

          return {
            ...scenarioData,
            startDate: new Date(scenarioData?.startDate),
            modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
            endDate: new Date(scenarioData.endDate as Date),
            modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
            randomNumber: this.generateRandomNumber(),
            isRowSelected: false,
            txElTypes: updatetxelList
          };
        });
        updateRemainderScenarios.forEach((x: RemainderScenarios) => {
          if (x.modifiedEndDate == null) x.endDate = null;
        });
        this.remainderScenarioList = [...updateRemainderScenarios];

        const remainderIndex = this.remainderScenarioList.findIndex(x => x.scenarioName == this.selectedRemainderScenario.scenarioName);

        this.remainderScenarioList[remainderIndex].isRowSelected = true;

        this.remainderScenarioData = this.remainderScenarioList[remainderIndex];
        this.highlightRemainderScenario = this.remainderScenarioList[remainderIndex];
        this.minDate = new Date(this.remainderScenarioData.startDate);
        this.minDate.setDate(this.minDate.getDate() + 1);
        this.headervalues();
      },err=>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
      });
    }
  }

  onClose() {
    const isChangedIndexExist = this.remainderScenarioList.findIndex(x => x.state == 3 || x.state == 1);
    const isTxelChange = this.remainderScenarioData.txElTypes.findIndex(x => x.state == 3 || x.state == 1);
    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0 || isTxelChange >= 0) {
      this.showDialog = true;
    } else {
      this.removeScenarioError();
      this.RemoveBusinessError(this.businessError);
      this.RemoveBusinessError(this.txelBusinessError);
      this.removeStepValidationError();
      this.RemoveStepOverviewError();
      this.RemoveCommunicationError();
      this.RemoveActionError();
      this.RemoveBusinessError(this.actionbusinessError);
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
    this.showBackDialog = false;
  }

  onDialogYes(remainderScenarioList: RemainderScenarios[]) {
    this.showDialog = false;
    if (this.showScenarioscreen) {
      const isEmptyTxel = this.onTxelValidCheck();
      const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

      const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
      const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

      if (this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) {
        this.onSave(remainderScenarioList);
        window.location.assign(this.navigateURL);
      } else {
        if (isDuplicateName || isDuplicateTxel) {
          if (isDuplicateTxel) {
            this.throwBusinessError(this.txelBusinessError);
            this.throwValidationError();
          }
          if (isDuplicateName) {
            this.throwBusinessError(this.businessError);
            this.throwValidationError();
          }
        } else {
          this.throwValidationError();
        }
      }
    } else if (this.showStepScreen) {
      const selectedIndex = remainderScenarioList.findIndex(x => x.isRowSelected);

      const isDuplicateStepName = this.duplicateStepName(remainderScenarioList[selectedIndex].reminderScenarioSteps);
      let isDuplicateActionExist = false;
      for (let i = 0; i < remainderScenarioList[selectedIndex].reminderScenarioSteps.length; i++) {
        const isDupExist = this.isDuplicateActionNameExists(
          remainderScenarioList[selectedIndex].reminderScenarioSteps[i].actionsForReminderStep
        );
        if (isDupExist) {
          isDuplicateActionExist = true;
          break;
        }
      }

      if (this.remainderScenarioForm.valid && !isDuplicateStepName && !isDuplicateActionExist) {
        this.onSave(remainderScenarioList);
        window.location.assign(this.navigateURL);
      } else {
        if (isDuplicateStepName || isDuplicateActionExist) {
          if (isDuplicateStepName) {
            this.throwBusinessError(this.businessError);
            this.throwStepValidationError();
          }
          if (isDuplicateActionExist) {
            this.throwBusinessError(this.actionbusinessError);
            this.throwStepValidationError();
          }
        } else {
          this.throwStepValidationError();
        }
      }
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeScenarioError();
    this.RemoveBusinessError(this.businessError);
    this.RemoveBusinessError(this.txelBusinessError);
    this.removeStepValidationError();
    this.RemoveStepOverviewError();
    this.RemoveCommunicationError();
    this.RemoveActionError();
    this.RemoveBusinessError(this.actionbusinessError);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  /*Back Dialog Functionality */

  onBackDialogYes(scenarioList: RemainderScenarios[]) {
    this.showBackDialog = false;

    const selectedIndex = scenarioList.findIndex(x => x.isRowSelected);

    const isDuplicateStepName = this.duplicateStepName(scenarioList[selectedIndex].reminderScenarioSteps);
    let isDuplicateActionExist = false;
    for (let i = 0; i < scenarioList[selectedIndex].reminderScenarioSteps.length; i++) {
      const isDupExist = this.isDuplicateActionNameExists(scenarioList[selectedIndex].reminderScenarioSteps[i].actionsForReminderStep);
      if (isDupExist) {
        isDuplicateActionExist = true;
        break;
      }
    }

    if (this.remainderScenarioForm.valid && !isDuplicateStepName && !isDuplicateActionExist) {
      this.hideCard();
      const UpdatedScenarioList: RemainderScenarios[] = [];
      let StepList: RemainderScenarioSteps[] = [];

      const IsDirtyScenarioList = scenarioList.filter(x => x.state != 0);

      if (IsDirtyScenarioList.length > 0) {
        IsDirtyScenarioList.map(scenarioData => {
          if (scenarioData.state != 0) {
            scenarioData.startDate = new Date(
              Date.UTC(scenarioData.startDate.getFullYear(), scenarioData.startDate.getMonth(), scenarioData.startDate.getDate(), 0, 0, 0)
            );

            if (scenarioData.endDate && scenarioData.modifiedEndDate != null) {
              scenarioData.endDate = new Date(
                Date.UTC(scenarioData.endDate.getFullYear(), scenarioData.endDate.getMonth(), scenarioData.endDate.getDate(), 0, 0, 0)
              );
            }
            UpdatedScenarioList.push({ ...scenarioData });
          }
        });

        StepList = UpdatedScenarioList[0].reminderScenarioSteps;

        StepList.forEach((stepData: RemainderScenarioSteps) => {
          const communicationList = stepData.communicationList.filter(y => y.isDeleted == false);
          stepData.communicationList = communicationList;

          const actionList = stepData.actionsForReminderStep.filter(y => y.isDeleted == false);
          stepData.actionsForReminderStep = actionList;

          const followupevent = stepData.followupEventsForReminderStep.filter(y => y.isDeleted == false);
          stepData.followupEventsForReminderStep = followupevent;
        });

        UpdatedScenarioList[0].reminderScenarioSteps = StepList;

        this.remainderService.saveRemainderScenario(UpdatedScenarioList).subscribe(
          saveResponse => {
            this.spinnerService.setIsLoading(false);
            this.remainderService.getRemainderScenario().subscribe(
              (data: any) => {
                this.spinnerService.setIsLoading(false);
                this.showStepScreen = false;
                this.showScenarioscreen = true;

                /*CodeTableBinding */
                this.remainderScenarioCodeTable = data.reminderScenarioCodeTables;

                // /*RemainderScenario Data Binding */

                const updateRemainderScenarios = data.reminderScenarioList.map((scenarioData: RemainderScenarios) => {
                  const updatetxelList = scenarioData.txElTypes.map(x => {
                    return { ...x, isDeleted: false };
                  });

                  return {
                    ...scenarioData,
                    startDate: new Date(scenarioData?.startDate),
                    modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
                    endDate: new Date(scenarioData.endDate as Date),
                    modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
                    randomNumber: this.generateRandomNumber(),
                    isRowSelected: false,
                    txElTypes: updatetxelList
                  };
                });
                updateRemainderScenarios.forEach((x: RemainderScenarios) => {
                  if (x.modifiedEndDate == null) x.endDate = null;
                });
                this.remainderScenarioList = [...updateRemainderScenarios];

                const scenarioIndex = this.remainderScenarioList.findIndex(x => x.scenarioName == UpdatedScenarioList[0].scenarioName);

                this.remainderScenarioList[scenarioIndex].isRowSelected = true;

                this.remainderScenarioData = this.remainderScenarioList[scenarioIndex];
                this.highlightRemainderScenario = this.remainderScenarioList[scenarioIndex];
                this.minDate = new Date(this.remainderScenarioData.startDate);
                this.minDate.setDate(this.minDate.getDate() + 1);

                this.headervalues();
              },
              err => {
                if(err?.error?.errorCode){
                  this.errorCode = err.error.errorCode;
                }else{
                  this.errorCode= 'InternalServiceFault';
                }
                this.spinnerService.setIsLoading(false);
                this.exceptionBox = true;
              }
            );
          },
          err => {
            if(err?.error?.errorCode){
              this.errorCode = err.error.errorCode;
            }else{
              this.errorCode= 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          }
        );
      }
    } else {
      if (isDuplicateStepName || isDuplicateActionExist) {
        if (isDuplicateStepName) {
          this.throwBusinessError(this.businessError);
          this.throwStepValidationError();
        }
        if (isDuplicateActionExist) {
          this.throwBusinessError(this.actionbusinessError);
          this.throwStepValidationError();
        }
      } else {
        this.throwStepValidationError();
      }
    }
  }

  onBackDialogNo() {
    this.showBackDialog = false;
    this.removeStepValidationError();
    this.RemoveStepOverviewError();
    this.RemoveCommunicationError();
    this.RemoveActionError();
    this.resetScenarioError();
    this.RemoveBusinessError(this.actionbusinessError);
    this.hideCard();
    this.remainderService.getRemainderScenario().subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.showStepScreen = false;
      this.showScenarioscreen = true;
      /*CodeTableBinding */
      this.remainderScenarioCodeTable = data.reminderScenarioCodeTables;

      // /*RemainderScenario Data Binding */

      const updateRemainderScenarios = data.reminderScenarioList.map((scenarioData: RemainderScenarios) => {
        this.showScenarioscreen = true;
        this.showStepScreen = false;
        const updatetxelList = scenarioData.txElTypes.map(x => {
          return { ...x, isDeleted: false };
        });

        return {
          ...scenarioData,
          startDate: new Date(scenarioData?.startDate),
          modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
          endDate: new Date(scenarioData.endDate as Date),
          modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
          randomNumber: this.generateRandomNumber(),
          isRowSelected: false,
          txElTypes: updatetxelList
        };
      });
      updateRemainderScenarios.forEach((x: RemainderScenarios) => {
        if (x.modifiedEndDate == null) x.endDate = null;
      });
      this.remainderScenarioList = [...updateRemainderScenarios];

      const remainderIndex = this.remainderScenarioList.findIndex(x => x.scenarioName == this.selectedRemainderScenario.scenarioName);

      this.remainderScenarioList[remainderIndex].isRowSelected = true;

      this.remainderScenarioData = this.remainderScenarioList[remainderIndex];
      this.minDate = new Date(this.remainderScenarioData.startDate);
      this.highlightRemainderScenario = this.remainderScenarioList[remainderIndex];
      this.minDate.setDate(this.minDate.getDate() + 1);
      this.headervalues();
    },err => {
      if(err.error.errorCode){
        this.errorCode = err.error.errorCode;
      }else{
        this.errorCode= 'InternalServiceFault';
      }
      this.spinnerService.setIsLoading(false);
      this.exceptionBox = true;
    });
  }

  onBackDialogCancel() {
    this.showBackDialog = false;
  }
  /*Back Dialog Functionality Ends */

  onException(){
    this.exceptionBox = false;
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onSave(scenarioList: RemainderScenarios[]) {
    if (this.showScenarioscreen) {
      const isEmptyTxel = this.onTxelValidCheck();
      const isDuplicateName = this.isDuplicateScenarioNameExists(this.remainderScenarioList);

      const scenarioIndex = this.remainderScenarioList.findIndex((x: RemainderScenarios) => x.isRowSelected);
      const isDuplicateTxel = this.duplicateTxelName(this.remainderScenarioList[scenarioIndex].txElTypes);

      if (this.remainderScenarioForm.valid && !isEmptyTxel && !isDuplicateName && !isDuplicateTxel) {
        scenarioList.forEach(x => {
          const notDeleted = x.txElTypes.filter(y => y.isDeleted == false);
          x.txElTypes = notDeleted;
        });

        scenarioList.map(scenarioData => {
          if (scenarioData.state != 0) {
            scenarioData.startDate = new Date(
              Date.UTC(scenarioData.startDate.getFullYear(), scenarioData.startDate.getMonth(), scenarioData.startDate.getDate(), 0, 0, 0)
            );

            if (scenarioData.endDate && scenarioData.modifiedEndDate != null) {
              scenarioData.endDate = new Date(
                Date.UTC(scenarioData.endDate.getFullYear(), scenarioData.endDate.getMonth(), scenarioData.endDate.getDate(), 0, 0, 0)
              );
            }
            this.deletedArray.push({ ...scenarioData });
          }
        });
        const selectedList = this.remainderScenarioList.filter(x => x.isRowSelected);

        this.remainderService.saveRemainderScenario(this.deletedArray).subscribe(
          scenarioresponse => {
            this.spinnerService.setIsLoading(false);
            this.deletedArray = [];

            this.remainderService.getRemainderScenario().subscribe(
              (data: any) => {
                this.spinnerService.setIsLoading(false);
                /*CodeTableBinding */
                this.remainderScenarioCodeTable = data.reminderScenarioCodeTables;

                // /*RemainderScenario Data Binding */

                const updateRemainderScenarios = data.reminderScenarioList.map((scenarioData: RemainderScenarios) => {
                  this.showScenarioscreen = true;
                  this.showStepScreen = false;
                  const updatetxelList = scenarioData.txElTypes.map(x => {
                    return { ...x, isDeleted: false };
                  });

                  return {
                    ...scenarioData,
                    startDate: new Date(scenarioData?.startDate),
                    modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
                    endDate: new Date(scenarioData.endDate as Date),
                    modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
                    randomNumber: this.generateRandomNumber(),
                    isRowSelected: false,
                    txElTypes: updatetxelList
                  };
                });
                updateRemainderScenarios.forEach((x: RemainderScenarios) => {
                  if (x.modifiedEndDate == null) x.endDate = null;
                });
                this.remainderScenarioList = [...updateRemainderScenarios];

                const remainderIndex = this.remainderScenarioList.findIndex(x => x.scenarioName == selectedList[0].scenarioName);

                this.remainderScenarioList[remainderIndex].isRowSelected = true;

                this.remainderScenarioData = this.remainderScenarioList[remainderIndex];
                this.highlightRemainderScenario = this.remainderScenarioList[remainderIndex];
                this.minDate = new Date(this.remainderScenarioData.startDate);
                this.minDate.setDate(this.minDate.getDate() + 1);
              },
              err => {
                this.deletedArray = [];
                if(err.error.errorCode){
                  this.errorCode = err.error.errorCode;
                }else{
                  this.errorCode= 'InternalServiceFault';
                }
                this.spinnerService.setIsLoading(false);
                this.exceptionBox = true;
              }
            );
          },
          err => {
            this.deletedArray = [];
            if(err.error.errorCode){
              this.errorCode = err.error.errorCode;
            }else{
              this.errorCode= 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          }
        );

        this.headervalues();
      } else {
        if (isDuplicateName || isDuplicateTxel) {
          if (isDuplicateTxel) {
            this.throwBusinessError(this.txelBusinessError);
            this.throwValidationError();
          }
          if (isDuplicateName) {
            this.throwBusinessError(this.businessError);
            this.throwValidationError();
          }
        } else {
          this.throwValidationError();
        }
      }
    } else if (this.showStepScreen) {
      const selectedIndex = scenarioList.findIndex(x => x.isRowSelected);

      const isDuplicateStepName = this.duplicateStepName(scenarioList[selectedIndex].reminderScenarioSteps);
      let isDuplicateActionExist = false;
      for (let i = 0; i < scenarioList[selectedIndex].reminderScenarioSteps.length; i++) {
        const isDupExist = this.isDuplicateActionNameExists(scenarioList[selectedIndex].reminderScenarioSteps[i].actionsForReminderStep);
        if (isDupExist) {
          isDuplicateActionExist = true;
          break;
        }
      }

      if (this.remainderScenarioForm.valid && !isDuplicateStepName && !isDuplicateActionExist) {
        const UpdatedScenarioList: RemainderScenarios[] = [];
        let StepList: RemainderScenarioSteps[] = [];

        const IsDirtyScenarioList = scenarioList.filter(x => x.state != 0);

        if (IsDirtyScenarioList.length > 0) {
          IsDirtyScenarioList.map(scenarioData => {
            if (scenarioData.state != 0) {
              scenarioData.startDate = new Date(
                Date.UTC(scenarioData.startDate.getFullYear(), scenarioData.startDate.getMonth(), scenarioData.startDate.getDate(), 0, 0, 0)
              );

              if (scenarioData.endDate && scenarioData.modifiedEndDate != null) {
                scenarioData.endDate = new Date(
                  Date.UTC(scenarioData.endDate.getFullYear(), scenarioData.endDate.getMonth(), scenarioData.endDate.getDate(), 0, 0, 0)
                );
              }
              UpdatedScenarioList.push({ ...scenarioData });
            }
          });

          StepList = UpdatedScenarioList[0].reminderScenarioSteps;

          StepList.forEach((stepData: RemainderScenarioSteps) => {
            const communicationList = stepData.communicationList.filter(y => y.isDeleted == false);
            stepData.communicationList = communicationList;

            const actionList = stepData.actionsForReminderStep.filter(y => y.isDeleted == false);
            stepData.actionsForReminderStep = actionList;

            const followupevent = stepData.followupEventsForReminderStep.filter(y => y.isDeleted == false);
            stepData.followupEventsForReminderStep = followupevent;
          });

          const stepData = StepList.filter(x=>x.isRowSelected);

          UpdatedScenarioList[0].reminderScenarioSteps = StepList;

          this.remainderService.saveRemainderScenario(UpdatedScenarioList).subscribe(
            saveResponse => {
              this.spinnerService.setIsLoading(false);
              this.remainderService.getRemainderScenario().subscribe(
                (data: any) => {
                  /*CodeTableBinding */
                  this.spinnerService.setIsLoading(false);
                  this.remainderScenarioCodeTable = data.reminderScenarioCodeTables;

                  // /*RemainderScenario Data Binding */

                  const updateRemainderScenarios = data.reminderScenarioList.map((scenarioData: RemainderScenarios) => {
                    const updatetxelList = scenarioData.txElTypes.map(x => {
                      return { ...x, isDeleted: false };
                    });

                    return {
                      ...scenarioData,
                      startDate: new Date(scenarioData?.startDate),
                      modifiedStartDate: this.datePipe.transform(scenarioData?.startDate, 'dd/MM/yyyy'),
                      endDate: new Date(scenarioData.endDate as Date),
                      modifiedEndDate: this.datePipe.transform(scenarioData?.endDate, 'dd/MM/yyyy'),
                      randomNumber: this.generateRandomNumber(),
                      isRowSelected: false,
                      txElTypes: updatetxelList
                    };
                  });
                  updateRemainderScenarios.forEach((x: RemainderScenarios) => {
                    if (x.modifiedEndDate == null) x.endDate = null;
                  });
                  this.remainderScenarioList = [...updateRemainderScenarios];

                  const scenarioIndex = this.remainderScenarioList.findIndex(x => x.scenarioName == UpdatedScenarioList[0].scenarioName);

                  this.remainderScenarioList[scenarioIndex].isRowSelected = true;

                  this.remainderScenarioData = this.remainderScenarioList[scenarioIndex];
                  this.minDate = new Date(this.remainderScenarioData.startDate);
                  this.minDate.setDate(this.minDate.getDate() + 1);

                  this.selectedRemainderScenario = this.remainderScenarioList[scenarioIndex];

                  if (this.remainderScenarioList[scenarioIndex].reminderScenarioSteps.length > 0) {
                    const updateRemainderSteps = this.remainderScenarioList[scenarioIndex].reminderScenarioSteps.map(
                      (stepsData: RemainderScenarioSteps) => {
                        const updatedList = stepsData.followupEventsForReminderStep.map((x: FollowupEventsForReminderStepDto) => {
                          return { ...x, isDeleted: false, state: 0 };
                        });

                        const updateActionList = stepsData.actionsForReminderStep.map((actionData: ActionsForReminderStepDto) => {
                          return { ...actionData, isDeleted: false, state: 0 };
                        });

                        const updateCommuncationList = stepsData.communicationList.map((commmunicationData: ReminderCommunicationsDto) => {
                          return { ...commmunicationData, isDeleted: false, state: 0 };
                        });

                        return {
                          ...stepsData,
                          randomNumber: this.generateRandomNumber(),
                          isRowSelected: false,
                          followupEventsForReminderStep: updatedList,
                          actionsForReminderStep: updateActionList,
                          communicationList: updateCommuncationList
                        };
                      }
                    );

                    const stepIndex= updateRemainderSteps.findIndex(x=>x.name == stepData[0].name);

                    updateRemainderSteps[stepIndex].isRowSelected = true;

                    this.remainderScenarioList[scenarioIndex].reminderScenarioSteps = [...updateRemainderSteps];

                    this.remainderStepData = this.remainderScenarioList[scenarioIndex].reminderScenarioSteps[stepIndex];
                    this.highlightRemainderStepData = this.remainderScenarioList[scenarioIndex].reminderScenarioSteps[stepIndex];

                    if (this.remainderStepData.changeCreditStatus) {
                      this.RequiredTargetCreditstatus.required = true;
                    } else {
                      this.RequiredTargetCreditstatus.required = false;
                    }
                  }
                },
                err => {
                  if(err?.error?.errorCode){
                    this.errorCode = err.error.errorCode;
                  }else{
                    this.errorCode= 'InternalServiceFault';
                  }
                  this.spinnerService.setIsLoading(false);
                  this.exceptionBox = true;
                }
              );
            },
            err => {
              if(err?.error?.errorCode){
                this.errorCode = err.error.errorCode;
              }else{
                this.errorCode= 'InternalServiceFault';
              }
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
            }
          );
        }
      } else {
        if (isDuplicateStepName || isDuplicateActionExist) {
          if (isDuplicateStepName) {
            this.throwBusinessError(this.businessError);
            this.throwStepValidationError();
          }
          if (isDuplicateActionExist) {
            this.throwBusinessError(this.actionbusinessError);
            this.throwStepValidationError();
          }
        } else {
          this.throwStepValidationError();
        }
      }
    }
  }

  /*Validation Error For StepScreen */
  throwStepValidationError() {
    this.RequiredStepName.externalError = true;
    this.RequiredTemplate.externalError = true;
    this.RequiredElapsedPeriod.externalError = true;
    this.RequiredDuedate.externalError = true;
    this.RequiredAction.externalError = true;
    this.RequiredTemplate.externalError = true;
    this.RequiredContactMedium.externalError = true;
    this.RequiredTargetCreditstatus.externalError = true;
    this.RequiredBlockSending.externalError = true;
  }

  removeStepValidationError() {
    this.RequiredStepName.externalError = false;
    this.RequiredTemplate.externalError = false;
    this.RequiredElapsedPeriod.externalError = false;
    this.RequiredDuedate.externalError = false;
    this.RequiredAction.externalError = false;
    this.RequiredTemplate.externalError = false;
    this.RequiredContactMedium.externalError = false;
    this.RequiredTargetCreditstatus.externalError = false;
    this.RequiredBlockSending.externalError = true;
  }

  RemoveCommunicationError() {
    const removeTemplateError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.Templates') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeTemplateError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeTemplateError, 1);
    }

    const removeCommunicationError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.ContactMedium') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeCommunicationError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeCommunicationError, 1);
    }
  }

  isDuplicateActionNameExists(newgridDate: ActionsForReminderStepDto[]) {
    const removeNullDateValue = newgridDate.filter(
      (actionData: ActionsForReminderStepDto) => actionData?.action?.name && actionData?.action?.name !== '' && !actionData.isDeleted
    );
    const uniqueValues = [...new Set(removeNullDateValue.map((actionData: ActionsForReminderStepDto) => actionData?.action?.name))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  duplicateStepName(newgridDate: RemainderScenarioSteps[]) {
    const removeNullDateValue = newgridDate.filter((stepData: RemainderScenarioSteps) => stepData.name && stepData?.name !== '');
    const uniqueValues = [...new Set(removeNullDateValue.map((stepData: RemainderScenarioSteps) => stepData?.name))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  RemoveActionError() {
    const removeActionError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.Actions') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeActionError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeActionError, 1);
    }
  }

  RemoveStepOverviewError() {
    const removeStepNameError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.Name') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeStepNameError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeStepNameError, 1);
    }

    const removeElapsedError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.ElapsedPeriod') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeElapsedError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeElapsedError, 1);
    }

    const removedueDateError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.numberOf') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removedueDateError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removedueDateError, 1);
    }

    const removeTargetCreditError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manage-remainder.ValidationError.TargetStatus') +
          this.translate.instant('process.manage-remainder.ValidationError.required')
    );
    if (removeTargetCreditError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(removeTargetCreditError, 1);
    }
  }

  hideCard() {
    this.showActionGrid = true;
    this.showActioncard = false;
    this.showTemplateGrid = true;
    this.showTemplatecard = false;
  }
}
