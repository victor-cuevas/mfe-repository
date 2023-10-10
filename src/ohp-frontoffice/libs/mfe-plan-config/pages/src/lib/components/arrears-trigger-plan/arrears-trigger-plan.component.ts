import { state } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidPickListConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ArrearsTriggerPlanDto } from './Models/arrears-trigger-planDto.model';
import { ArrearsTriggerStepConfig2StartEventDto } from './Models/arrearsTrigger-stepConfig2-startEventDto.model';
import { ArrearsTriggerStepConfigDto } from './Models/arrearsTrigger-stepConfigDto.model';
import { ArrearsTriggerPlan2DebtSourceStatusDto } from './Models/arrearsTriggerPlan2-debtSourceStatusDto.model';
import { ArrearsTriggerPlan2ExternalProductReferenceDto } from './Models/arrearsTriggerPlan2-externalProductReferenceDto.model';
import { CodeTable } from './Models/code-tableDto.model';
import { DebtSourceStatusDto } from './Models/debtSource-statusDto.model';
import { DtoState } from './Models/dtoBase.model';
import { ArrearsTriggerPlanService } from './Services/arrears-trigger-plan.service';

@Component({
  selector: 'mpc-arrears-trigger-plan',
  templateUrl: './arrears-trigger-plan.component.html',
  styleUrls: ['./arrears-trigger-plan.component.scss']
})
export class ArrearsTriggerPlanComponent implements OnInit {
  @ViewChild('arrearTriggerform', { static: true }) arrearTriggerform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredCalculationType: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredContextType: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredExternalProd: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredDaysDue: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredDueDates: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredStartEvent: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  placeholder = 'Select';

  arrear1Header!: any[];
  arrear2Header!: any[];
  arrear3Header!: any[];

  /*PickList*/
  targetList: DebtSourceStatusDto[] = [];
  target: DebtSourceStatusDto[] = [];
  source: any[] = [];
  sourceCaption: any[] = [];
  targetCaption: any[] = [];

  arrearCalculationList: CodeTable[] = [];
  arrearContextList: CodeTable[] = [];
  debtSourceStatusList: CodeTable[] = [];
  followUpEventList: CodeTable[] = [];

  arrearTriggerPlanList: ArrearsTriggerPlanDto[] = [];
  arrearTriggerPlanData: ArrearsTriggerPlanDto = new ArrearsTriggerPlanDto();
  deletedArrearTriggerPlanData: ArrearsTriggerPlanDto[] = [];

  arrearTriggerExternalProductData: ArrearsTriggerPlan2ExternalProductReferenceDto = new ArrearsTriggerPlan2ExternalProductReferenceDto();

  arrearTriggerStartConfigData: ArrearsTriggerStepConfigDto = new ArrearsTriggerStepConfigDto();

  exceptionBox!: boolean;
  showDialog = false;
  validationHeader!: string;

  hideexternalProduct = true;
  hidearrearTriggerPlan = true;
  hideStartEventCard = true;

  intMaxValue = 2147483647;
  daysDueDto: ErrorDto[] = [];
  dueDatesDto: ErrorDto[] = [];
  navigateUrl!: string;
  highlightPlanData: ArrearsTriggerPlanDto = new ArrearsTriggerPlanDto();

  duplicateBusinessError: string;
  emptyStepConfigBusinessError: string;
  emptyDebtsourceBusinessError: string;
  emptyProductBusinessError: string;
  isIndividual : boolean
  readonlyDueDates = true;
  readonlyDaysDue = true;
  readonlyStartEvent = true;
  errorCode !: string;
  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public arrearTriggerPlanService: ArrearsTriggerPlanService,
    public fluidValidation: fluidValidationService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('plan.Validation.Header');
    this.duplicateBusinessError = this.translate.instant('plan.arrearsTrigger.ValidationError.DuplicateError');
    this.emptyStepConfigBusinessError = this.translate.instant('plan.arrearsTrigger.ValidationError.EmptyStepConfigError');
    this.emptyDebtsourceBusinessError = this.translate.instant('plan.arrearsTrigger.ValidationError.EmptyDebtSourceError');
    this.emptyProductBusinessError = this.translate.instant('plan.arrearsTrigger.ValidationError.EmptyProductError');
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
    this.isIndividual = false;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.arrearCalculationList = data.arrearTriggerCalculationList;
      this.arrearContextList = data.arrearTriggerContextList;
      this.debtSourceStatusList = data.debtSourceStatusList;
      this.followUpEventList = data.followUpEventList;

      const UpdatearrearPlanList = data.arrearTriggerPlanList.map((x: ArrearsTriggerPlanDto) => {
        const UpdateExternalProd = x.arrearsTriggerPlan2ExternalProductReferenceList.map(
          (y: ArrearsTriggerPlan2ExternalProductReferenceDto) => {
            return { ...y, externalrowSelected: false, externalrandomNumber: this.generateRandomNumber(), isExternalDeleted: false };
          }
        );

        const UpdateStepConfig = x.arrearsTriggerStepConfigList.map((z: ArrearsTriggerStepConfigDto) => {
          return {
            ...z,
            steprowSelected: false,
            steprandomNumber: this.generateRandomNumber(),
            isDeleted: false
          };
        });

        return {
          ...x,
          rowSelected: false,
          randomNumber: this.generateRandomNumber(),
          arrearsTriggerPlan2ExternalProductReferenceList: UpdateExternalProd,
          arrearsTriggerStepConfigList: UpdateStepConfig
        };
      });

      if (UpdatearrearPlanList.length > 0) {
        UpdatearrearPlanList[0].rowSelected = true;
        this.arrearTriggerPlanList = UpdatearrearPlanList;
        this.arrearTriggerPlanData = UpdatearrearPlanList[0];
        this.highlightPlanData = UpdatearrearPlanList[0];
        this.assigningSourceTarget(0);
        if (this.arrearTriggerPlanList[0].arrearsTriggerContext?.caption == "Individual") {
          this.isIndividual = true;
        }
        else {
          this.isIndividual = false;
        }
        /*Initial Binding for External ProductGrid */
        if (UpdatearrearPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
          UpdatearrearPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList[0].externalrowSelected = true;
          this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList =
            UpdatearrearPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList;
          this.arrearTriggerExternalProductData = UpdatearrearPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList[0];
        } else {
          this.hideexternalProduct = false;
        }

        /*Initial Binding For StepConfig and StartEvent */

        if (UpdatearrearPlanList[0].arrearsTriggerStepConfigList.length > 0) {
          UpdatearrearPlanList[0].arrearsTriggerStepConfigList[0].steprowSelected = true;

          this.arrearTriggerPlanData.arrearsTriggerStepConfigList = UpdatearrearPlanList[0].arrearsTriggerStepConfigList;

          this.arrearTriggerStartConfigData = this.arrearTriggerPlanData.arrearsTriggerStepConfigList[0];
        } else {
          this.hideStartEventCard = false;
        }
      } else {
        this.hidearrearTriggerPlan = false;
      }
    });

    this.arrear1Header = [
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.CalculationType'),
        field: 'arrearsTriggerCalculationType.caption',
        width: '50%'
      },
      { header: this.translate.instant('plan.arrearsTrigger.tabel.Context'), field: 'arrearsTriggerContext.caption', width: '45%' },
      { header: this.translate.instant('plan.arrearsTrigger.tabel.Delete'), field: 'Delete', fieldType: 'deleteButton', width: '5%' }
    ];

    this.arrear2Header = [
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.ExternalProductReference'),
        field: 'externalProductReference',
        property: 'externalProductReference',
        width: '90%'
      },
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.Delete1'),
        field: 'delete1',
        pSortableColumnDisabled: true,
        property: 'delete1Button',
        width: '10%'
      }
    ];

    this.arrear3Header = [
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.Number'),
        field: 'numberOfDaysDueConfig',
        property: 'numberOfDaysDueConfig',
        width: '30%'
      },
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.duedates'),
        field: 'numberOfDueDatesConfig',
        property: 'numberOfDueDatesConfig',
        width: '30%'
      },
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.StartEvent'),
        field: 'startEvent.caption',
        property: 'StartEvent',
        width: '30%'
      },
      {
        header: this.translate.instant('plan.arrearsTrigger.tabel.Delete2'),
        field: 'Delete2',
        property: 'delete2Button',
        width: '10%',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const calculationTypeError = new ErrorDto();
    calculationTypeError.validation = 'required';
    calculationTypeError.isModelError = true;
    calculationTypeError.validationMessage =
      this.translate.instant('plan.arrearsTrigger.ValidationError.CalculationType') +
      this.translate.instant('plan.arrearsTrigger.ValidationError.required');
    this.RequiredCalculationType.required = true;
    this.RequiredCalculationType.Errors = [calculationTypeError];

    const contextTypeError = new ErrorDto();
    contextTypeError.validation = 'required';
    contextTypeError.isModelError = true;
    contextTypeError.validationMessage =
      this.translate.instant('plan.arrearsTrigger.ValidationError.Context') +
      this.translate.instant('plan.arrearsTrigger.ValidationError.required');
    this.RequiredContextType.required = true;
    this.RequiredContextType.Errors = [contextTypeError];

    const externalProdError = new ErrorDto();
    externalProdError.validation = 'required';
    externalProdError.isModelError = true;
    externalProdError.validationMessage =
      this.translate.instant('plan.arrearsTrigger.ValidationError.ExternalProduct') +
      this.translate.instant('plan.arrearsTrigger.ValidationError.required');
    this.RequiredExternalProd.required = true;
    this.RequiredExternalProd.Errors = [externalProdError];

    const DaysDueError = new ErrorDto();
    DaysDueError.validation = 'maxError';
    DaysDueError.isModelError = true;
    DaysDueError.validationMessage = this.translate.instant('plan.arrearsTrigger.ValidationError.numberInt32Check');
    this.daysDueDto = [DaysDueError];
    const dayDueError = new ErrorDto();
    dayDueError.validation = 'required';
    dayDueError.isModelError = true;
    dayDueError.validationMessage =
      this.translate.instant('plan.arrearsTrigger.ValidationError.DaysDue') +
      this.translate.instant('plan.arrearsTrigger.ValidationError.required');
    this.RequiredDaysDue.required = true;
    this.RequiredDaysDue.Errors = [dayDueError];
    this.RequiredDaysDue.maxValueValidation = this.translate.instant('plan.arrearsTrigger.ValidationError.InputIncorrect');

    const DueDatesErrorDto = new ErrorDto();
    DueDatesErrorDto.validation = 'maxError';
    DueDatesErrorDto.isModelError = true;
    DueDatesErrorDto.validationMessage = this.translate.instant('plan.arrearsTrigger.ValidationError.numberInt32Check');
    this.dueDatesDto = [DueDatesErrorDto];
    const dueDatesError = new ErrorDto();
    dueDatesError.validation = 'required';
    dueDatesError.isModelError = true;
    dueDatesError.validationMessage =
      this.translate.instant('plan.arrearsTrigger.ValidationError.DueDates') +
      this.translate.instant('plan.arrearsTrigger.ValidationError.required');
    this.RequiredDueDates.required = true;
    this.RequiredDueDates.Errors = [dueDatesError];
    this.RequiredDueDates.maxValueValidation = this.translate.instant('plan.arrearsTrigger.ValidationError.InputIncorrect');

    const startEventError = new ErrorDto();
    startEventError.validation = 'required';
    startEventError.isModelError = true;
    startEventError.validationMessage =
      this.translate.instant('plan.arrearsTrigger.ValidationError.StartEvent') +
      this.translate.instant('plan.arrearsTrigger.ValidationError.required');
    this.RequiredStartEvent.required = true;
    this.RequiredStartEvent.Errors = [startEventError];
  }

  onAddArrearTriggerPlan() {
    if (this.arrearTriggerform.valid) {
      this.removeArrearTriggerPlanError();
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();
      const isStepConfigEmpty = this.checkStepEvent();
      const isDebtSourceEmpty = this.checkDebtSource();
      const isProductEmpty = this.checkExternalProduct();
      if (!isDuplicateStepExist && !isDuplicateExternalExist && !isStepConfigEmpty && !isDebtSourceEmpty && !isProductEmpty) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        this.RemoveBusinessError(this.emptyProductBusinessError);
        if (this.arrearTriggerPlanList.length == 0) {
          this.hidearrearTriggerPlan = true;
        }
        let updatearrearTriggerPlanList = [...this.arrearTriggerPlanList];

        if (updatearrearTriggerPlanList.length > 0) {
          const planIndex = updatearrearTriggerPlanList.findIndex(x => x.rowSelected);

          updatearrearTriggerPlanList = this.arrearTriggerPlanrowDeselect(updatearrearTriggerPlanList);
          if (updatearrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
            updatearrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList = this.deselectExternalData(
              updatearrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList
            );
          }

          this.hideexternalProduct = false;
          this.hideStartEventCard = false;

          this.arrearTriggerPlanData = new ArrearsTriggerPlanDto();
          this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = [];
          this.arrearTriggerPlanData.arrearsTriggerPlan2DebtSourceStatusList = [];
          this.arrearTriggerPlanData.arrearsTriggerStepConfigList = [];

          this.arrearTriggerExternalProductData = new ArrearsTriggerPlan2ExternalProductReferenceDto();

          updatearrearTriggerPlanList.push({
            ...this.arrearTriggerPlanData,
            randomNumber: this.generateRandomNumber(),
            rowSelected: true,
            state: 1
          });

          this.arrearTriggerPlanList = [...updatearrearTriggerPlanList];

          this.highlightPlanData = this.arrearTriggerPlanList[this.arrearTriggerPlanList?.length - 1];
          this.arrearTriggerform.resetForm();

          const newPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
          this.assigningSourceTarget(newPlanIndex);
        } else {
          const updatearrearTriggerPlanList = [...this.arrearTriggerPlanList];

          this.hideexternalProduct = false;
          this.hideStartEventCard = false;

          this.arrearTriggerPlanData = new ArrearsTriggerPlanDto();
          this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = [];
          this.arrearTriggerPlanData.arrearsTriggerPlan2DebtSourceStatusList = [];
          this.arrearTriggerPlanData.arrearsTriggerStepConfigList = [];

          this.arrearTriggerExternalProductData = new ArrearsTriggerPlan2ExternalProductReferenceDto();

          updatearrearTriggerPlanList.push({
            ...this.arrearTriggerPlanData,
            randomNumber: this.generateRandomNumber(),
            rowSelected: true,
            state: 1
          });

          this.arrearTriggerPlanList = [...updatearrearTriggerPlanList];

          // this.highlightMechanismData = this.fallbackMechanismList[this.fallbackMechanismList?.length - 1];
          this.arrearTriggerform.resetForm();
          //this.removeArrearTriggerPlanError();
          const newPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
          this.assigningSourceTarget(newPlanIndex);
        }
      }
      else {
        if (isDuplicateStepExist || isDuplicateExternalExist)
          this.throwBusinessError(this.duplicateBusinessError);
        else
          this.RemoveBusinessError(this.duplicateBusinessError);
        if (isStepConfigEmpty)
          this.throwBusinessError(this.emptyStepConfigBusinessError);
        else
          this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        if (isDebtSourceEmpty)
          this.throwBusinessError(this.emptyDebtsourceBusinessError);
        else
          this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        if (isProductEmpty)
          this.throwBusinessError(this.emptyProductBusinessError);
        else
          this.RemoveBusinessError(this.emptyProductBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onRowDelete(event: any) {
    if (this.arrearTriggerform.valid || event.rowSelected) {
      this.removeArrearTriggerPlanError();
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();
      const isStepConfigEmpty = this.checkStepEvent();
      const isDebtSourceEmpty = this.checkDebtSource();
      const isProductEmpty = this.checkExternalProduct();

      if (!isDuplicateStepExist && !isDuplicateExternalExist) {
        this.readonlyStartEvent = true;
        this.readonlyDaysDue = true;
        this.readonlyDueDates = true;

        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        this.RemoveBusinessError(this.emptyProductBusinessError);
        const arrearTriggerPlanListData = [...this.arrearTriggerPlanList];

        const todeleteIndex = arrearTriggerPlanListData.findIndex((data: ArrearsTriggerPlanDto) => {
          return data?.randomNumber === event?.randomNumber;
        });

        if (todeleteIndex != arrearTriggerPlanListData.length - 1) {
          if (arrearTriggerPlanListData[todeleteIndex].state == 1) {
            arrearTriggerPlanListData.splice(todeleteIndex, 1);
            this.removeArrearTriggerPlanError();
            this.spliceStartEventError();
          } else {            
            if (!isStepConfigEmpty && !isDebtSourceEmpty && !isProductEmpty) {
              arrearTriggerPlanListData[todeleteIndex].state = 4;
              this.deletedArrearTriggerPlanData.push({ ...arrearTriggerPlanListData[todeleteIndex] });
              arrearTriggerPlanListData.splice(todeleteIndex, 1);
              this.removeArrearTriggerPlanError();
              this.spliceStartEventError();
            }
            else {
              if (isStepConfigEmpty)
                this.throwBusinessError(this.emptyStepConfigBusinessError);
              else
                this.RemoveBusinessError(this.emptyStepConfigBusinessError);
              if (isDebtSourceEmpty)
                this.throwBusinessError(this.emptyDebtsourceBusinessError);
              else
                this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
              if (isProductEmpty)
                this.throwBusinessError(this.emptyProductBusinessError);
              else
                this.RemoveBusinessError(this.emptyProductBusinessError);
            }
          }

          if (arrearTriggerPlanListData.length > 0) {            
            if (!isStepConfigEmpty && !isDebtSourceEmpty && !isProductEmpty) {
              this.arrearTriggerPlanList = this.arrearTriggerPlanrowDeselect(arrearTriggerPlanListData);
              this.arrearTriggerPlanList[0].rowSelected = true;
              this.arrearTriggerPlanData = this.arrearTriggerPlanList[0];
              this.highlightPlanData = this.arrearTriggerPlanList[0];
              this.assigningSourceTarget(0);
              if (this.arrearTriggerPlanList[0].arrearsTriggerContext?.caption == "Individual") {
                this.isIndividual = true;
              }
              else {
                this.isIndividual = false;
              }
              /*Assigning Values To ExternalProduct */
              if (this.arrearTriggerPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
                let rowassigned = false;
                this.hideexternalProduct = true;
                for (let i = 0; i < this.arrearTriggerPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList.length; i++) {
                  if (this.arrearTriggerPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList[i].state != 4) {
                    this.arrearTriggerPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList[i].externalrowSelected = true;
                    this.arrearTriggerExternalProductData = this.arrearTriggerPlanList[0].arrearsTriggerPlan2ExternalProductReferenceList[i];
                    rowassigned = true;
                  }
                  if (rowassigned) break;
                }
              } else {
                this.hideexternalProduct = false;
              }

              /*Assining Values to StepConfig */
              if (this.arrearTriggerPlanList[0].arrearsTriggerStepConfigList.length > 0) {
                this.hideStartEventCard = true;
                for (let i = 0; i < this.arrearTriggerPlanList[0].arrearsTriggerStepConfigList.length; i++) {
                  if (this.arrearTriggerPlanList[0].arrearsTriggerStepConfigList[i].state != 4) {
                    this.arrearTriggerPlanList[0].arrearsTriggerStepConfigList[i].steprowSelected = true;
                    this.arrearTriggerStartConfigData = this.arrearTriggerPlanList[0].arrearsTriggerStepConfigList[i];

                    break;
                  }
                }
              } else {
                this.arrearTriggerStartConfigData = new ArrearsTriggerStepConfigDto();
                this.hideStartEventCard = false;
              }
            }            
          } else {
            this.arrearTriggerPlanList = [];
            this.arrearTriggerPlanData = new ArrearsTriggerPlanDto();
            setTimeout(() => {
              this.hidearrearTriggerPlan = false;
            }, 100);
          }
        } else {
          if (arrearTriggerPlanListData[todeleteIndex].state == 1) {
            arrearTriggerPlanListData.splice(todeleteIndex, 1);
            this.removeArrearTriggerPlanError();
            this.spliceStartEventError();
          } else {
            if (!isStepConfigEmpty && !isDebtSourceEmpty && !isProductEmpty) {
              arrearTriggerPlanListData[todeleteIndex].state = 4;
            this.deletedArrearTriggerPlanData.push({ ...arrearTriggerPlanListData[todeleteIndex] });
            arrearTriggerPlanListData.splice(todeleteIndex, 1);
            this.removeArrearTriggerPlanError();
            this.spliceStartEventError();
            }
            else {
              if (isStepConfigEmpty)
                this.throwBusinessError(this.emptyStepConfigBusinessError);
              else
                this.RemoveBusinessError(this.emptyStepConfigBusinessError);
              if (isDebtSourceEmpty)
                this.throwBusinessError(this.emptyDebtsourceBusinessError);
              else
                this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
              if (isProductEmpty)
                this.throwBusinessError(this.emptyProductBusinessError);
              else
                this.RemoveBusinessError(this.emptyProductBusinessError);
            }
          }

          if (arrearTriggerPlanListData.length > 0) {
            this.arrearTriggerPlanList = this.arrearTriggerPlanrowDeselect(arrearTriggerPlanListData);
            this.arrearTriggerPlanList[this.arrearTriggerPlanList?.length - 1].rowSelected = true;
            const lastIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);

            this.arrearTriggerPlanData = this.arrearTriggerPlanList[lastIndex];
            this.highlightPlanData = this.arrearTriggerPlanList[lastIndex];
            this.assigningSourceTarget(lastIndex);
            if (this.arrearTriggerPlanList[lastIndex].arrearsTriggerContext?.caption == "Individual") {
              this.isIndividual = true;
            }
            else {
              this.isIndividual = false;
            }
            /*Assigning Values To ExternalProduct */
            if (this.arrearTriggerPlanList[lastIndex].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
              let rowassigned = false;
              this.hideexternalProduct = true;
              for (let i = 0; i < this.arrearTriggerPlanList[lastIndex].arrearsTriggerPlan2ExternalProductReferenceList.length; i++) {
                if (this.arrearTriggerPlanList[lastIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].state != 4) {
                  this.arrearTriggerPlanList[lastIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].externalrowSelected = true;
                  this.arrearTriggerExternalProductData =
                    this.arrearTriggerPlanList[lastIndex].arrearsTriggerPlan2ExternalProductReferenceList[i];
                  rowassigned = true;
                }
                if (rowassigned) break;
              }
            } else {
              this.hideexternalProduct = false;
            }

            /*Assining Values to StepConfig */
            if (this.arrearTriggerPlanList[lastIndex].arrearsTriggerStepConfigList.length > 0) {
              this.hideStartEventCard = true;

              for (let i = 0; i < this.arrearTriggerPlanList[lastIndex].arrearsTriggerStepConfigList.length; i++) {
                if (this.arrearTriggerPlanList[lastIndex].arrearsTriggerStepConfigList[i].state != 4) {
                  this.arrearTriggerPlanList[lastIndex].arrearsTriggerStepConfigList[i].steprowSelected = true;
                  this.arrearTriggerStartConfigData = this.arrearTriggerPlanList[lastIndex].arrearsTriggerStepConfigList[i];

                  break;
                }
              }
            } else {
              this.arrearTriggerStartConfigData = new ArrearsTriggerStepConfigDto();
              this.hideStartEventCard = false;
            }
          } else {
            this.arrearTriggerPlanList = [];
            this.arrearTriggerPlanData = new ArrearsTriggerPlanDto();
            setTimeout(() => {
              this.hidearrearTriggerPlan = false;
            }, 100);
          }
        }
      }
      else {
        if (isDuplicateStepExist || isDuplicateExternalExist)
          this.throwBusinessError(this.duplicateBusinessError);
        else
          this.RemoveBusinessError(this.duplicateBusinessError);
        
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onRowSelectArrrearTrigger(event: ArrearsTriggerPlanDto) {
    if (this.arrearTriggerform.valid || event.rowSelected) {
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();
      const isStepConfigEmpty = this.checkStepEvent();
      const isDebtSourceEmpty = this.checkDebtSource();
      const isProductEmpty = this.checkExternalProduct();
      if (!isDuplicateStepExist && !isDuplicateExternalExist && !isStepConfigEmpty && !isDebtSourceEmpty && !isProductEmpty) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        this.RemoveBusinessError(this.emptyProductBusinessError);
        let updatearrearTriggerData = this.arrearTriggerPlanList;
        const eventIndex = updatearrearTriggerData.findIndex(x => x.rowSelected);

        updatearrearTriggerData = this.arrearTriggerPlanrowDeselect(updatearrearTriggerData);

        this.arrearTriggerPlanList[eventIndex].rowSelected = updatearrearTriggerData[eventIndex].rowSelected;

        //Selected Row in ArrearTriggerPlan
        const selectedIndex = updatearrearTriggerData.findIndex(x => x.randomNumber == event.randomNumber);
        this.arrearTriggerPlanList[selectedIndex].rowSelected = true;
        this.highlightPlanData = this.arrearTriggerPlanList[selectedIndex];
        this.arrearTriggerPlanData = event;
        if (this.arrearTriggerPlanList[selectedIndex].arrearsTriggerContext?.caption == "Individual") {
          this.isIndividual = true;
        }
        else {
          this.isIndividual = false;
        }
        //Deselect Selected Row in ArrearTriggerExternalProductRef
        if (updatearrearTriggerData[eventIndex].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
          const externalIndex = updatearrearTriggerData[eventIndex].arrearsTriggerPlan2ExternalProductReferenceList.findIndex(
            x => x.externalrowSelected
          );
          updatearrearTriggerData[eventIndex].arrearsTriggerPlan2ExternalProductReferenceList = this.deselectExternalData(
            updatearrearTriggerData[eventIndex].arrearsTriggerPlan2ExternalProductReferenceList
          );

          this.arrearTriggerPlanList[eventIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalIndex].externalrowSelected =
            updatearrearTriggerData[eventIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalIndex].externalrowSelected;
        }

        //Select FirstRow in ArrearTriggerExternalProductRef
        if (this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
          this.hideexternalProduct = true;
          let rowassigned = false;

          for (let i = 0; i < this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList.length; i++) {
            if (this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].state != 4) {
              this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].externalrowSelected = true;
              this.arrearTriggerExternalProductData =
                this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[i];
              rowassigned = true;
            }
            if (rowassigned) break;
          }
        } else {
          this.hideexternalProduct = false;
        }

        //Assign Selected Values To PickList
        this.assigningSourceTarget(selectedIndex);

        //Deselect SelectedRow In Step and StartEvent
        if (updatearrearTriggerData[eventIndex].arrearsTriggerStepConfigList.length > 0) {
          /*Find Already SelectedIndex in Step and StartEvent */
          const StepIndex = updatearrearTriggerData[eventIndex].arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);

          if (StepIndex >= 0) {
            /*Deselect SelectedIndex in Step and StartEvent */
            updatearrearTriggerData[eventIndex].arrearsTriggerStepConfigList = this.deselectStepandStartEventData(
              updatearrearTriggerData[eventIndex].arrearsTriggerStepConfigList
            );

            this.arrearTriggerPlanList[eventIndex].arrearsTriggerStepConfigList[StepIndex].steprowSelected =
              updatearrearTriggerData[eventIndex].arrearsTriggerStepConfigList[StepIndex].steprowSelected;
          }
        }

        /*Select FirstRow in Step and StartEvent */
        if (this.arrearTriggerPlanList[selectedIndex].arrearsTriggerStepConfigList.length > 0) {
          this.hideStartEventCard = true;

          for (let i = 0; i < this.arrearTriggerPlanList[selectedIndex].arrearsTriggerStepConfigList.length; i++) {
            if (this.arrearTriggerPlanList[selectedIndex].arrearsTriggerStepConfigList[i].state != 4) {
              this.arrearTriggerPlanList[selectedIndex].arrearsTriggerStepConfigList[i].steprowSelected = true;
              this.arrearTriggerStartConfigData = this.arrearTriggerPlanList[selectedIndex].arrearsTriggerStepConfigList[i];

              break;
            }
          }
        } else {
          this.arrearTriggerStartConfigData = new ArrearsTriggerStepConfigDto();
          this.hideStartEventCard = false;
        }

        this.readonlyStartEvent = true;
        this.readonlyDaysDue = true;
        this.readonlyDueDates = true;
      }
      else
      {
        if (isDuplicateStepExist || isDuplicateExternalExist)
          this.throwBusinessError(this.duplicateBusinessError);
        else
          this.RemoveBusinessError(this.duplicateBusinessError);
        if (isStepConfigEmpty)
          this.throwBusinessError(this.emptyStepConfigBusinessError);
        else
          this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        if (isDebtSourceEmpty)
          this.throwBusinessError(this.emptyDebtsourceBusinessError);
        else
          this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        if (isProductEmpty)
          this.throwBusinessError(this.emptyProductBusinessError);
        else
          this.RemoveBusinessError(this.emptyProductBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onCalculationTypeChange(event: any) {
    const selectedIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.arrearTriggerPlanList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.arrearsTriggerCalculationType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[selectedIndex].arrearsTriggerCalculationType = updategrid.arrearsTriggerCalculationType;
      this.arrearTriggerPlanList[selectedIndex].state = updategrid.state;
      this.arrearTriggerPlanData.arrearsTriggerCalculationType = event.value;
    } else if (event?.value == null) {
      const updateData = this.arrearTriggerPlanList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.arrearsTriggerCalculationType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[selectedIndex].arrearsTriggerCalculationType = null;
      this.arrearTriggerPlanList[selectedIndex].state = updategrid.state;
      this.arrearTriggerPlanData.arrearsTriggerCalculationType = null;
      this.RequiredCalculationType.externalError = true;
    }
  }

  onContextChange(event: any) {
    const selectedIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.arrearTriggerPlanList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.arrearsTriggerContext = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[selectedIndex].arrearsTriggerContext = updategrid.arrearsTriggerContext;
      this.arrearTriggerPlanList[selectedIndex].state = updategrid.state;
      this.arrearTriggerPlanData.arrearsTriggerContext = event.value;
      if (this.arrearTriggerPlanList[selectedIndex].arrearsTriggerContext?.caption == "Individual") {
        this.isIndividual = true;
      }
      else {
        this.isIndividual = false;
      }
    } else if (event?.value == null) {
      const updateData = this.arrearTriggerPlanList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.arrearsTriggerContext = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[selectedIndex].arrearsTriggerContext = null;
      this.arrearTriggerPlanList[selectedIndex].state = updategrid.state;
      this.arrearTriggerPlanData.arrearsTriggerContext = null;
      this.RequiredContextType.externalError = true;
    }
  }

  arrearTriggerPlanrowDeselect(arrearTriggerPlan: ArrearsTriggerPlanDto[]) {
    const deSelectData = arrearTriggerPlan;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: ArrearsTriggerPlanDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*PickListFunctionality*/

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.sourceCaption = [];
    this.targetCaption = [];
    this.arrearTriggerPlanList[index].arrearsTriggerPlan2DebtSourceStatusList.forEach(user => {
      if (user.state != 4) {
        const filter = this.debtSourceStatusList.findIndex(y => {
          return user.debtSourceStatus.codeId == y.codeId;
        });
        if (filter != -1) {
          this.targetList.push(this.debtSourceStatusList[filter]);
        }
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.debtSourceStatusList];
    this.target.forEach((user: DebtSourceStatusDto) => {
      const index = sourcelist.findIndex(value => {
        return value.codeId == user.codeId;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];

    this.sourceCaption = this.source.map((x: DebtSourceStatusDto) => {
      return { ...x };
    });

    this.targetCaption = this.target.map((y: DebtSourceStatusDto) => {
      return { ...y };
    });
  }

  changeTarget(event: any) {
    if (event != undefined) {
      //this.RemoveBusinessError(this.pickListError);

      const index = this.arrearTriggerPlanList.findIndex(get => {
        return get.rowSelected == true;
      });

      if (index >= 0) {
        if (this.arrearTriggerPlanList[index].state != DtoState.Created) {
          this.arrearTriggerPlanList[index].state = DtoState.Dirty;
        }
        const debtSourceStatusListData: CodeTable[] = [];

        event.forEach((x: any) => {
          debtSourceStatusListData.push(x);
        });

        let filterData: any[] = [];

        filterData = this.debtSourceStatusList.filter(val => {
          return debtSourceStatusListData.find(x => {
            return x.codeId == val.codeId;
          });
        });

        /*Storing Existing CodeId in List */
        const oldDebtSourceList =
          this.arrearTriggerPlanList[index].arrearsTriggerPlan2DebtSourceStatusList.length > 0
            ? [...this.arrearTriggerPlanList[index].arrearsTriggerPlan2DebtSourceStatusList]
            : [];
        const oldCodeIds: any = [];
        oldDebtSourceList.map(codeData => {
          if (codeData.debtSourceStatus.codeId) {
            oldCodeIds.push(codeData.debtSourceStatus.codeId);
          }
        });

        /*Storing New CodeId in List from Target */
        const newCodeIds: any = [];
        filterData.map(codeData => {
          if (codeData?.codeId) {
            const oldCodeData: any = {
              refCodeId: codeData.codeId,
              refCodeValue: codeData
            };
            newCodeIds.push(oldCodeData);
          }
        });

        /*Moving Data from Target to Source*/
        oldCodeIds.map((oldData: any) => {
          const findNewCodeIndex = newCodeIds.findIndex((newId: any) => newId.refCodeId === oldData);
          if (findNewCodeIndex === -1) {
            const getTaxIndex = oldDebtSourceList.findIndex((codeData: any) => codeData.debtSourceStatus.codeId === oldData);
            if (getTaxIndex >= 0) {
              const updateDebtsource = { ...oldDebtSourceList[getTaxIndex] };
              if (updateDebtsource.state === 1) {
                oldDebtSourceList.splice(getTaxIndex, 1);
              } else if (updateDebtsource.state === 0) {
                updateDebtsource.state = 4;
                oldDebtSourceList[getTaxIndex] = updateDebtsource;
              }
            }
          }
        });

        /*Moving Data from Source to Target*/
        newCodeIds.map((y: any) => {
          const getIndex = oldCodeIds.findIndex((x: any) => x === y.refCodeId);
          //Add Index if it is  new Data
          if (getIndex === -1) {
            const newDebtsource: any = {
              debtSourceStatus: { ...y.refCodeValue },
              state: 1
            };
            oldDebtSourceList.push(newDebtsource);
          } else {
            //Update if it is Existing Data
            const getDebtSrcIndex = oldDebtSourceList.findIndex((codeData: any) => codeData?.debtSourceStatus.codeId === y.refCodeId);
            if (getDebtSrcIndex >= 0) {
              const updateDebtSource = { ...oldDebtSourceList[getDebtSrcIndex] };
              if (updateDebtSource.state === 4) {
                updateDebtSource.state = 0;
                oldDebtSourceList[getDebtSrcIndex] = updateDebtSource;
              }
            }
          }
        });

        /*Update in the CreditProviderList */

        this.arrearTriggerPlanList[index].arrearsTriggerPlan2DebtSourceStatusList =
          oldDebtSourceList.length > 0
            ? oldDebtSourceList.map((x: any) => {
                const updatedDebtData = { ...x, debtSourceStatus: { ...x.debtSourceStatus } };
                return updatedDebtData;
              })
            : [];
      }
    }
  }

  /*ArrearTrigger External Functionality */
  onAddExternalProduct() {
    if (this.arrearTriggerform.valid) {
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();

      if (!isDuplicateStepExist && !isDuplicateExternalExist) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.removeArrearTriggerPlanError();
        const eventPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
        let arrearTriggerExternalData = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList;

        if (arrearTriggerExternalData.length > 0) {
          arrearTriggerExternalData = this.deselectExternalData(arrearTriggerExternalData);
        }

        this.hideexternalProduct = true;

        this.arrearTriggerExternalProductData = new ArrearsTriggerPlan2ExternalProductReferenceDto();
        arrearTriggerExternalData.push({
          ...this.arrearTriggerExternalProductData,
          externalrandomNumber: this.generateRandomNumber(),
          externalrowSelected: true,
          state: 1
        });

        if (this.arrearTriggerPlanList[eventPlanIndex].state == DtoState.Created) {
          this.arrearTriggerPlanList[eventPlanIndex].state = DtoState.Created;
        } else {
          this.arrearTriggerPlanList[eventPlanIndex].state = DtoState.Dirty;
        }

        this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList = [...arrearTriggerExternalData];
        this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = [...arrearTriggerExternalData];

        this.arrearTriggerExternalProductData =
          this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList[
            this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList.length - 1
          ];
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onExternalProductselect(rowData: ArrearsTriggerPlan2ExternalProductReferenceDto, externalindex: number) {
    if (this.arrearTriggerform.valid || rowData.externalrowSelected) {
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();

      if ((!isDuplicateStepExist && !isDuplicateExternalExist) || rowData.externalrowSelected) {
        const eventPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
        let arrearTriggerExternalList = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList;

        const externalIndex = arrearTriggerExternalList.findIndex(x => x.externalrowSelected);
        if (externalIndex >= 0) {
          arrearTriggerExternalList = this.deselectExternalData(arrearTriggerExternalList);

          this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalIndex].externalrowSelected =
            arrearTriggerExternalList[externalIndex].externalrowSelected;

          this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalindex].externalrowSelected =
            true;
          this.arrearTriggerExternalProductData =
            this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalindex];
        }
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onExternalProductDelete(rowData: ArrearsTriggerPlan2ExternalProductReferenceDto, deleteindex: number) {
    if (this.arrearTriggerform.valid || rowData.externalrowSelected) {
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();

      if ((!isDuplicateStepExist && !isDuplicateExternalExist) || rowData.externalrowSelected) {
        const planIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
        const arrearExternalList = this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList;

        if (deleteindex != arrearExternalList.length - 1) {
          if (arrearExternalList[deleteindex].state == 1) {
            arrearExternalList.splice(deleteindex, 1);
            this.arrearTriggerPlanList[planIndex].state = 3;
            this.RequiredExternalProd.externalError = false;
          } else {
            arrearExternalList[deleteindex].state = 4;
            arrearExternalList[deleteindex].isExternalDeleted = true;
            this.arrearTriggerPlanList[planIndex].state = 3;
            this.RequiredExternalProd.externalError = false;
          }
          if (!this.checkExternalDataExist(arrearExternalList)) {
            this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList =
              this.deselectExternalData(arrearExternalList);
            let rowassigned = false;

            for (let i = 0; i < this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList.length; i++) {
              if (this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].state != 4) {
                this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].externalrowSelected = true;
                this.arrearTriggerExternalProductData =
                  this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList[i];
                rowassigned = true;
              }
              if (rowassigned) break;
            }
            //  this.highlightGenericData = this.genericMappingList[0];
          } else {
            this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList =
              this.deselectExternalData(arrearExternalList);
            this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = this.deselectExternalData(arrearExternalList);

            this.arrearTriggerExternalProductData = new ArrearsTriggerPlan2ExternalProductReferenceDto();
            setTimeout(() => {
              this.hideexternalProduct = false;
            }, 100);
          }
        } else {
          if (arrearExternalList[deleteindex].state == 1) {
            arrearExternalList.splice(deleteindex, 1);
            this.arrearTriggerPlanList[planIndex].state = 3;
            this.RequiredExternalProd.externalError = false;
          } else {
            arrearExternalList[deleteindex].state = 4;
            arrearExternalList[deleteindex].isExternalDeleted = true;
            this.arrearTriggerPlanList[planIndex].state = 3;
            this.RequiredExternalProd.externalError = false;
          }

          if (!this.checkExternalDataExist(arrearExternalList)) {
            this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList =
              this.deselectExternalData(arrearExternalList);
            this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = this.deselectExternalData(arrearExternalList);

            let rowassigned = false;

            for (let i = 0; i < this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList.length; i++) {
              if (this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].state != 4) {
                this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList[i].externalrowSelected = true;
                this.arrearTriggerExternalProductData =
                  this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList[i];
                rowassigned = true;
              }
              if (rowassigned) break;
            }

            //this.highlightGenericData = this.genericMappingList[lastIndex];
          } else {
            this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList =
              this.deselectExternalData(arrearExternalList);
            this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = this.deselectExternalData(arrearExternalList);

            this.arrearTriggerExternalProductData = new ArrearsTriggerPlan2ExternalProductReferenceDto();
            setTimeout(() => {
              this.hideexternalProduct = false;
            }, 100);
          }
        }
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onExternalProductReferenceChange(event: any) {
    const selectedIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
    if (selectedIndex >= 0) {
      const externalSelectedIndex = this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList.findIndex(
        x => x.externalrowSelected
      );

      if (event.target.value != null && event.target.value != '' && externalSelectedIndex >= 0) {
        const updateData = this.arrearTriggerPlanList[selectedIndex];
        const updategrid = { ...updateData.arrearsTriggerPlan2ExternalProductReferenceList[externalSelectedIndex] };
        updategrid.externalProductReference = event.target.value;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[
          externalSelectedIndex
        ].externalProductReference = updategrid.externalProductReference;

        this.arrearTriggerExternalProductData.externalProductReference = event.target.value;

        this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalSelectedIndex].state =
          updategrid.state;

        if (this.arrearTriggerPlanList[selectedIndex].state != DtoState.Created) {
          this.arrearTriggerPlanList[selectedIndex].state = DtoState.Dirty;
        }

        this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList[externalSelectedIndex].externalProductReference =
          event.target.value;
      } else {
        const updateData = this.arrearTriggerPlanList[selectedIndex];
        const updategrid = { ...updateData.arrearsTriggerPlan2ExternalProductReferenceList[externalSelectedIndex] };
        updategrid.externalProductReference = null;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[
          externalSelectedIndex
        ].externalProductReference = null;

        this.arrearTriggerExternalProductData.externalProductReference = null;

        this.arrearTriggerPlanList[selectedIndex].arrearsTriggerPlan2ExternalProductReferenceList[externalSelectedIndex].state =
          updategrid.state;

        if (this.arrearTriggerPlanList[selectedIndex].state != DtoState.Created) {
          this.arrearTriggerPlanList[selectedIndex].state = DtoState.Dirty;
        }

        this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList[externalSelectedIndex].externalProductReference = null;

        this.RequiredExternalProd.externalError = true;
      }
    }
  }

  deselectExternalData(externalList: ArrearsTriggerPlan2ExternalProductReferenceDto[]) {
    const deSelectData = externalList;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: ArrearsTriggerPlan2ExternalProductReferenceDto) => {
            return {
              ...x,
              externalrowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  checkExternalDataExist(externalData: ArrearsTriggerPlan2ExternalProductReferenceDto[]) {
    let isEmpty = false;
    if (externalData.length > 0) {
      for (let i = 0; i < externalData.length; i++) {
        if (externalData[i].state == 4) {
          isEmpty = true;
        } else {
          isEmpty = false;
          break;
        }
      }
    } else {
      isEmpty = true;
    }

    return isEmpty;
  }

  checkDuplicateExist() {
    const planIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);

    const removeNullDateValue = this.arrearTriggerPlanList[planIndex].arrearsTriggerPlan2ExternalProductReferenceList.filter(
      (data: ArrearsTriggerPlan2ExternalProductReferenceDto) =>
        data?.externalProductReference && data?.externalProductReference !== '' && !data.isExternalDeleted
    );
    const uniqueValues = [
      ...new Set(removeNullDateValue.map((extData: ArrearsTriggerPlan2ExternalProductReferenceDto) => extData?.externalProductReference))
    ];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  /*StepConfig Functionality */

  onAddStepConfig() {
    if (this.arrearTriggerform.valid) {
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();

      if (!isDuplicateStepExist && !isDuplicateExternalExist) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        const eventPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
        let arrearTriggerStepData = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList;

        if (arrearTriggerStepData.length > 0) {
          arrearTriggerStepData = this.deselectStepandStartEventData(arrearTriggerStepData);
        }

        this.hideStartEventCard = true;
        this.readonlyStartEvent = false;
        this.readonlyDaysDue = false;
        this.readonlyDueDates = false;

        const UpdateStepList = new ArrearsTriggerStepConfigDto();
        UpdateStepList.arrearsTriggerStepConfig2StartEventList = [];
        arrearTriggerStepData.push({
          ...UpdateStepList,
          steprowSelected: true,
          steprandomNumber: this.generateRandomNumber(),
          state: 1
        });

        if (this.arrearTriggerPlanList[eventPlanIndex].state == DtoState.Created) {
          this.arrearTriggerPlanList[eventPlanIndex].state = DtoState.Created;
        } else {
          this.arrearTriggerPlanList[eventPlanIndex].state = DtoState.Dirty;
        }

        this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList = [...arrearTriggerStepData];
        this.arrearTriggerPlanData.arrearsTriggerStepConfigList = [...arrearTriggerStepData];

        const stepIndex = this.arrearTriggerPlanData.arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);

        if (stepIndex >= 0) {
          this.arrearTriggerStartConfigData = this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex];
        }

        this.removeArrearTriggerPlanError();
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onStartEventselect(rowData: ArrearsTriggerStepConfigDto, stepindex: number) {
    const eventPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
    const stepeventIndex = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);
    if (this.arrearTriggerform.valid) {
      this.removeArrearTriggerPlanError();
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();

      if (!isDuplicateStepExist && !isDuplicateExternalExist) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        let arrearTriggerStepData = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList;

        if (arrearTriggerStepData.length > 0) {
          arrearTriggerStepData = this.deselectStepandStartEventData(arrearTriggerStepData);
        }

        this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList[stepeventIndex].steprowSelected =
          arrearTriggerStepData[stepeventIndex].steprowSelected;

        this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList[stepindex].steprowSelected = true;

        this.arrearTriggerStartConfigData = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList[stepindex];
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onStartEventDelete(rowData: any, stepindex: number) {
    const eventPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
    const stepeventIndex = this.arrearTriggerPlanList[eventPlanIndex].arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);

    if (this.arrearTriggerform.valid || rowData.steprowSelected) {
      this.removeArrearTriggerPlanError();
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();
      if ((!isDuplicateStepExist && !isDuplicateExternalExist) || rowData.steprowSelected) {
        this.RemoveBusinessError(this.duplicateBusinessError);

        const planIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
        const arrearStepList = this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList;

        if (arrearStepList[stepindex].state == 1) {
          arrearStepList.splice(stepindex, 1);
          this.arrearTriggerPlanList[planIndex].state = 3;
          this.RequiredExternalProd.externalError = false;
        } else {
          arrearStepList[stepindex].state = 4;
          arrearStepList[stepindex].isDeleted = true;
          this.arrearTriggerPlanList[planIndex].state = 3;
          this.RequiredExternalProd.externalError = false;
        }

        if (arrearStepList.length > 0 && !this.checkStepEventEmpty(arrearStepList)) {
          this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList = this.deselectStepandStartEventData(arrearStepList);
          this.arrearTriggerPlanData.arrearsTriggerStepConfigList = this.deselectStepandStartEventData(arrearStepList);

          for (let i = 0; i < this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList.length; i++) {
            if (this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[i].state != 4) {
              this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[i].steprowSelected = true;
              this.arrearTriggerStartConfigData = this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[i];
              break;
            }
          }

          this.readonlyStartEvent = true;
          this.readonlyDaysDue = true;
          this.readonlyDueDates = true;
        } else {
          this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList = this.deselectStepandStartEventData(arrearStepList);
          this.arrearTriggerPlanData.arrearsTriggerStepConfigList = this.deselectStepandStartEventData(arrearStepList);

          this.arrearTriggerStartConfigData = new ArrearsTriggerStepConfigDto();
          setTimeout(() => {
            this.hideStartEventCard = false;
          }, 100);
        }
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  onnumberOfDaysDueConfigChange(event: any) {
    const planIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
    const stepIndex = this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);

    if (planIndex >= 0 && stepIndex >= 0 && event != null) {
      if (+event > this.intMaxValue) {
        this.RequiredDaysDue.externalError = true;
      }

      const updateData = this.arrearTriggerPlanList[planIndex];
      const updategrid = { ...updateData.arrearsTriggerStepConfigList };
      /*Change in StepList */
      updategrid[stepIndex].numberOfDaysDueConfig = +event;
      if (updategrid[stepIndex].state != DtoState.Created) {
        updategrid[stepIndex].state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].numberOfDaysDueConfig =
        updategrid[stepIndex].numberOfDaysDueConfig;
      this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex].numberOfDaysDueConfig =
        updategrid[stepIndex].numberOfDaysDueConfig;

      this.arrearTriggerStartConfigData.numberOfDaysDueConfig = +event;
      if (this.arrearTriggerPlanList[planIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].state = DtoState.Dirty;
      }
    } else {
      const updateData = this.arrearTriggerPlanList[planIndex];
      const updategrid = { ...updateData.arrearsTriggerStepConfigList };
      /*Change in StepList */
      updategrid[stepIndex].numberOfDaysDueConfig = null;
      if (updategrid[stepIndex].state != DtoState.Created) {
        updategrid[stepIndex].state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].numberOfDaysDueConfig = null;
      this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex].numberOfDaysDueConfig = null;

      this.arrearTriggerStartConfigData.numberOfDaysDueConfig = null;
      if (this.arrearTriggerPlanList[planIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].state = DtoState.Dirty;
      }
      this.RequiredDaysDue.externalError = true;
    }
  }

  onnumberOfDueDatesConfig(event: any) {
    const planIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
    const stepIndex = this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);

    if (planIndex >= 0 && stepIndex >= 0 && event != null) {
      if (+event > this.intMaxValue) {
        this.RequiredDueDates.externalError = true;
      }

      const updateData = this.arrearTriggerPlanList[planIndex];
      const updategrid = { ...updateData.arrearsTriggerStepConfigList };
      /*Change in StepList */
      updategrid[stepIndex].numberOfDueDatesConfig = +event;
      if (updategrid[stepIndex].state != DtoState.Created) {
        updategrid[stepIndex].state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].numberOfDueDatesConfig =
        updategrid[stepIndex].numberOfDueDatesConfig;
      this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex].numberOfDueDatesConfig =
        updategrid[stepIndex].numberOfDueDatesConfig;

      this.arrearTriggerStartConfigData.numberOfDueDatesConfig = +event;
      if (this.arrearTriggerPlanList[planIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].state = DtoState.Dirty;
      }
    } else {
      const updateData = this.arrearTriggerPlanList[planIndex];
      const updategrid = { ...updateData.arrearsTriggerStepConfigList };
      /*Change in StepList */
      updategrid[stepIndex].numberOfDueDatesConfig = null;
      if (updategrid[stepIndex].state != DtoState.Created) {
        updategrid[stepIndex].state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].numberOfDueDatesConfig = null;
      this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex].numberOfDueDatesConfig = null;

      this.arrearTriggerStartConfigData.numberOfDueDatesConfig = null;

      if (this.arrearTriggerPlanList[planIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].state = DtoState.Dirty;
      }
      this.RequiredDueDates.externalError = true;
    }
  }

  onStartEventChange(event: any) {
    const planIndex = this.arrearTriggerPlanList.findIndex((x: ArrearsTriggerPlanDto) => x.rowSelected);
    const stepIndex = this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList.findIndex(x => x.steprowSelected);

    if (planIndex >= 0 && stepIndex >= 0 && event.value != null) {
      const updateData = this.arrearTriggerPlanList[planIndex];
      const updategrid = { ...updateData.arrearsTriggerStepConfigList[stepIndex] };
      updategrid.startEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].startEvent = updategrid.startEvent;

      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].state = updategrid.state;

      this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex].startEvent = updategrid.startEvent;

      this.arrearTriggerStartConfigData.startEvent = updategrid.startEvent;

      if (this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].state = DtoState.Dirty;
      }

      if (this.arrearTriggerPlanList[planIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].state = DtoState.Dirty;
      }
    } else if (event?.value == null) {
      const updateData = this.arrearTriggerPlanList[planIndex];
      const updategrid = { ...updateData.arrearsTriggerStepConfigList[stepIndex] };
      updategrid.startEvent = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].startEvent = null;

      this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].state = updategrid.state;

      this.arrearTriggerPlanData.arrearsTriggerStepConfigList[stepIndex].startEvent = null;

      if (this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].arrearsTriggerStepConfigList[stepIndex].state = DtoState.Dirty;
      }

      this.arrearTriggerStartConfigData.startEvent = null;

      if (this.arrearTriggerPlanList[planIndex].state != DtoState.Created) {
        this.arrearTriggerPlanList[planIndex].state = DtoState.Dirty;
      }
      this.RequiredStartEvent.externalError = true;
    }
  }

  deselectStepandStartEventData(externalList: ArrearsTriggerStepConfigDto[]) {
    const deSelectData = externalList;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: ArrearsTriggerStepConfigDto) => {
            return {
              ...x,
              steprowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  checkStepEventEmpty(stepData: ArrearsTriggerStepConfigDto[]) {
    let isEmpty = false;
    for (let j = 0; j < stepData.length; j++) {
      if (stepData[j].state == 4) {
        isEmpty = true;
      } else {
        isEmpty = false;
        break;
      }
    }

    return isEmpty;
  }
  checkStepEvent() {
    let stepcount = false;
    for (let j = 0; j < this.arrearTriggerPlanList.length; j++) {
      if (this.arrearTriggerPlanList[j].arrearsTriggerStepConfigList.length == 0) {
        stepcount = true;
        break;
      }
      else if (this.arrearTriggerPlanList[j].arrearsTriggerStepConfigList.length > 0) {
        if (this.checkStepEventEmpty(this.arrearTriggerPlanList[j].arrearsTriggerStepConfigList)) {
          stepcount = true;
          break;
        }
      }      
    }
    return stepcount;
  }
  checkDebtSource() {
    let debtsourcecount = false;
    for (let j = 0; j < this.arrearTriggerPlanList.length; j++) {
      if (this.arrearTriggerPlanList[j].arrearsTriggerContext?.caption == "Individual") {
        if (this.arrearTriggerPlanList[j].arrearsTriggerPlan2DebtSourceStatusList.length == 0) {
          debtsourcecount = true;
          break;
        }
        else if (this.arrearTriggerPlanList[j].arrearsTriggerPlan2DebtSourceStatusList.length > 0) {
          if (this.checkDebtSourceEmpty(this.arrearTriggerPlanList[j].arrearsTriggerPlan2DebtSourceStatusList)) {
            debtsourcecount = true;
            break;
          }            
        }
      }
    }
    return debtsourcecount;
  }
  checkExternalProduct() {
    let productcount = false;
    for (let j = 0; j < this.arrearTriggerPlanList.length; j++) {
      if (this.arrearTriggerPlanList[j].arrearsTriggerContext?.caption == "Individual") {        
        if (this.arrearTriggerPlanList[j].arrearsTriggerPlan2ExternalProductReferenceList.length == 0) {
          productcount = true;
          break;
        }
        else if (this.arrearTriggerPlanList[j].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
          if (this.checkExternalProductEmpty(this.arrearTriggerPlanList[j].arrearsTriggerPlan2ExternalProductReferenceList)) {
            productcount = true;
            break;
          }
        }
      }
    }
    return productcount;
  }
  checkDebtSourceEmpty(Data: ArrearsTriggerPlan2DebtSourceStatusDto[]) {
    let isEmpty = false;
    for (let j = 0; j < Data.length; j++) {
      if (Data[j].state == 4) {
        isEmpty = true;
      } else {
        isEmpty = false;
        break;
      }
    }

    return isEmpty;
  }
  checkExternalProductEmpty(Data: ArrearsTriggerPlan2ExternalProductReferenceDto[]) {
    let isEmpty = false;
    for (let j = 0; j < Data.length; j++) {
      if (Data[j].state == 4) {
        isEmpty = true;
      } else {
        isEmpty = false;
        break;
      }
    }

    return isEmpty;
  }

  onSave(arrearTriggerPlanListData: ArrearsTriggerPlanDto[]) {
    if (this.arrearTriggerform.valid) {
      this.removeArrearTriggerPlanError();
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();
      const isStepConfigEmpty = this.checkStepEvent();
      const isDebtSourceEmpty = this.checkDebtSource();
      const isProductEmpty = this.checkExternalProduct();

      if (!isDuplicateStepExist && !isDuplicateExternalExist && !isStepConfigEmpty && !isDebtSourceEmpty && !isProductEmpty) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        this.RemoveBusinessError(this.emptyProductBusinessError);
        arrearTriggerPlanListData.map(planData => {
          if (planData.state != DtoState.Unknown) {
            this.deletedArrearTriggerPlanData.push({ ...planData });
          }
        });

        const UpdatedSaveData = this.deletedArrearTriggerPlanData.map((x: any) => {
          x.arrearsTriggerStepConfigList = this.updateStepandStartEvent(x.arrearsTriggerStepConfigList);
          return { ...x };
        });

        this.arrearTriggerPlanService.saveArrearTriggerPlanList(UpdatedSaveData).subscribe(
          data => {
            this.spinnerService.setIsLoading(false);
            this.deletedArrearTriggerPlanData = [];
            if (data) {
              this.deletedArrearTriggerPlanData = [];
              this.arrearTriggerPlanService.getArrearTriggerPlanList().subscribe(
                (responseData: any) => {
                  this.spinnerService.setIsLoading(false);
                  const UpdatearrearPlanList = responseData.map((x: ArrearsTriggerPlanDto) => {
                    const UpdateExternalProd = x.arrearsTriggerPlan2ExternalProductReferenceList.map(
                      (y: ArrearsTriggerPlan2ExternalProductReferenceDto) => {
                        return {
                          ...y,
                          externalrowSelected: false,
                          externalrandomNumber: this.generateRandomNumber(),
                          isExternalDeleted: false
                        };
                      }
                    );

                    const UpdateStepConfig = x.arrearsTriggerStepConfigList.map((z: ArrearsTriggerStepConfigDto) => {
                      return {
                        ...z,
                        steprowSelected: false,
                        steprandomNumber: this.generateRandomNumber(),
                        isDeleted: false
                      };
                    });

                    return {
                      ...x,
                      rowSelected: false,
                      randomNumber: this.generateRandomNumber(),
                      arrearsTriggerPlan2ExternalProductReferenceList: UpdateExternalProd,
                      arrearsTriggerStepConfigList: UpdateStepConfig
                    };
                  });

                  if (UpdatearrearPlanList.length > 0) {
                    const ArrearTriggerIndex = UpdatearrearPlanList.findIndex(
                      (x: ArrearsTriggerPlanDto) =>
                        x.arrearsTriggerCalculationType?.codeId == this.arrearTriggerPlanData.arrearsTriggerCalculationType?.codeId &&
                        x.arrearsTriggerContext?.codeId == this.arrearTriggerPlanData.arrearsTriggerContext?.codeId &&
                        this.checkArrearExternalProduct(x.arrearsTriggerPlan2ExternalProductReferenceList)
                    );

                    this.arrearTriggerPlanList = UpdatearrearPlanList;
                    this.arrearTriggerPlanList[ArrearTriggerIndex].rowSelected = true;
                    this.arrearTriggerPlanData = UpdatearrearPlanList[ArrearTriggerIndex];
                    this.highlightPlanData = UpdatearrearPlanList[ArrearTriggerIndex];
                    this.assigningSourceTarget(ArrearTriggerIndex);
                    if (this.arrearTriggerPlanList[ArrearTriggerIndex].arrearsTriggerContext?.caption == "Individual") {
                      this.isIndividual = true;
                    }
                    else {
                      this.isIndividual = false;
                    }
                    /*Initial Binding for External ProductGrid */
                    if (UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerPlan2ExternalProductReferenceList.length > 0) {
                      UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerPlan2ExternalProductReferenceList[0].externalrowSelected =
                        true;
                      this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList =
                        UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerPlan2ExternalProductReferenceList;
                      this.arrearTriggerExternalProductData =
                        UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerPlan2ExternalProductReferenceList[0];
                    } else {
                      this.hideexternalProduct = false;
                    }

                    /*Initial Binding For StepConfig and StartEvent */

                    if (UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerStepConfigList.length > 0) {
                      UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerStepConfigList[0].steprowSelected = true;
                      this.arrearTriggerPlanData.arrearsTriggerStepConfigList =
                        UpdatearrearPlanList[ArrearTriggerIndex].arrearsTriggerStepConfigList;

                      this.arrearTriggerStartConfigData = this.arrearTriggerPlanData.arrearsTriggerStepConfigList[0];

                      this.readonlyStartEvent = true;
                      this.readonlyDaysDue = true;
                      this.readonlyDueDates = true;
                    } else {
                      this.hideStartEventCard = false;
                    }
                  } else {
                    this.hidearrearTriggerPlan = false;
                  }
                },
                err => {
                  if(err?.error?.errorCode){
                    this.errorCode = err.error.errorCode;
                  }else{
                    this.errorCode= 'InternalServiceFault';
                  }
                  this.spinnerService.setIsLoading(false);
                  this.deletedArrearTriggerPlanData = [];
                  this.exceptionBox = true;
                }
              );
            }
          },
          err => {
            if(err?.error?.errorCode){
              this.errorCode = err.error.errorCode;
            }else{
              this.errorCode= 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.deletedArrearTriggerPlanData = [];
            this.exceptionBox = true;
          }
        );
      }
      else {
        if (isDuplicateStepExist || isDuplicateExternalExist)
          this.throwBusinessError(this.duplicateBusinessError);
        else
          this.RemoveBusinessError(this.duplicateBusinessError);
        if (isStepConfigEmpty)
          this.throwBusinessError(this.emptyStepConfigBusinessError);
        else
          this.RemoveBusinessError(this.emptyStepConfigBusinessError);
        if (isDebtSourceEmpty)
          this.throwBusinessError(this.emptyDebtsourceBusinessError);
        else
          this.RemoveBusinessError(this.emptyDebtsourceBusinessError);
        if (isProductEmpty)
          this.throwBusinessError(this.emptyProductBusinessError);
        else
          this.RemoveBusinessError(this.emptyProductBusinessError);
      }
    } else {
      this.throwArrearTriggerPlanError();
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  checkArrearExternalProduct(externalProd: ArrearsTriggerPlan2ExternalProductReferenceDto[]) {
    let IsEqual = true;
    if (externalProd.length == this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList.length) {
      for (let i = 0; i < externalProd.length; i++) {
        for (let j = i; j < this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList.length; j++) {
          if (
            externalProd[i].externalProductReference ==
            this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList[j].externalProductReference
          ) {
            break;
          } else {
            IsEqual = false;
            break;
          }
        }
        if (!IsEqual) {
          break;
        }
      }
    } else {
      IsEqual = false;
    }
    return IsEqual;
  }

  onClose() {
    const isChangedIndexExist = this.arrearTriggerPlanList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArrearTriggerPlanData.length > 0) {
      this.showDialog = true;
    } else {
      this.removeArrearTriggerPlanError();
      this.RemoveBusinessError(this.duplicateBusinessError);
      window.location.assign(this.navigateUrl);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onYes(arrearTriggerPlanListData: ArrearsTriggerPlanDto[]) {
    this.showDialog = false;
    if (this.arrearTriggerform.valid) {
      this.removeArrearTriggerPlanError();
      const isDuplicateStepExist = this.findDuplicateStepConfig();
      const isDuplicateExternalExist = this.checkDuplicateExist();

      if (!isDuplicateStepExist && !isDuplicateExternalExist) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.onSave(arrearTriggerPlanListData);
        window.location.assign(this.navigateUrl);
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    }
  }

  onNo() {
    this.showDialog = false;
    this.removeArrearTriggerPlanError();
    this.RemoveBusinessError(this.duplicateBusinessError);
    window.location.assign(this.navigateUrl);
  }

  onCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }

  findDuplicateStepConfig() {
    const arrearTriggerPlan = this.arrearTriggerPlanList;
    const arrearTriggerPlanIndex = this.arrearTriggerPlanList.findIndex(x => x.rowSelected);
    const arrearStepData = this.arrearTriggerPlanList[arrearTriggerPlanIndex];
    const filteredarrearStepData = arrearStepData.arrearsTriggerStepConfigList.filter(x => x.state != DtoState.Deleted);

    const uniqueValues = filteredarrearStepData.reduce((array: ArrearsTriggerStepConfigDto[], current) => {
      if (
        !array.some(
          (item: ArrearsTriggerStepConfigDto) =>
            item.numberOfDaysDueConfig == current.numberOfDaysDueConfig &&
            item.numberOfDueDatesConfig == current.numberOfDueDatesConfig &&
            item.startEvent?.codeId == current.startEvent?.codeId
        )
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (uniqueValues.length < filteredarrearStepData.length) {
      return true;
    } else {
      return false;
    }
  }

  updateStepandStartEvent(stepConfig: ArrearsTriggerStepConfigDto[]) {
    const API_PARAMETER = ['numberOfDaysDueConfig', 'numberOfDueDatesConfig'];
    const arrearStepConfigList = [...stepConfig];
    const seen = Object.create(null);
    let updateDistictStepConfig = arrearStepConfigList
      .filter((val: any) => {
        const key = API_PARAMETER.map((k: any) => val[k]).join('|');
        if (!seen[key]) {
          seen[key] = true;
          return true;
        }
        return false;
      })
      .map(x => {
        return {
          numberOfDaysDueConfig: x.numberOfDaysDueConfig,
          numberOfDueDatesConfig: x.numberOfDueDatesConfig,
          arrearsTriggerStepConfig2StartEventList: [] as ArrearsTriggerStepConfig2StartEventDto[],
          state: null,
          pKey: x.pKey,
          rowVersion: x.rowVersion
        };
      });

    updateDistictStepConfig = updateDistictStepConfig.map((data: any) => {
      const updateData = { ...data };
      const newArrearTrigger: any[] = [];
      const getOuterArrayValues = arrearStepConfigList.filter(
        x => x.numberOfDaysDueConfig === data.numberOfDaysDueConfig && x.numberOfDueDatesConfig === data.numberOfDueDatesConfig
      );
      const oldArrearTriggerStep2Config =
        getOuterArrayValues.length > 0 && getOuterArrayValues[0]?.arrearsTriggerStepConfig2StartEventList
          ? getOuterArrayValues[0].arrearsTriggerStepConfig2StartEventList
          : [];

      oldArrearTriggerStep2Config.map((oldArrearData: any) => {
        const updateOldArrear = { ...oldArrearData };
        const startEvent = oldArrearData.startEvent.codeId;
        const stateCode = oldArrearData.state;
        const getOuterArrayIndex = getOuterArrayValues.findIndex((val: any) => val.startEvent.codeId === startEvent);
        if (getOuterArrayIndex !== -1) {
          const getOuterArrearValue = { ...getOuterArrayValues[getOuterArrayIndex] };
          if (getOuterArrearValue.state !== stateCode) {
            if (getOuterArrearValue.state === 4) {
              updateOldArrear.state = 4;
              newArrearTrigger.push(updateOldArrear);
            }
          } else {
            newArrearTrigger.push(updateOldArrear);
          }
        }
        return oldArrearData;
      });

      //Add New Event
      getOuterArrayValues.map((outerData: any) => {
        const startEvent = outerData.startEvent.codeId;
        const checkStartEventExistingIndex = oldArrearTriggerStep2Config.findIndex((val: any) => val.startEvent.codeId === startEvent);
        if (checkStartEventExistingIndex === -1 || outerData.state == 1) {
          const newObj = {
            state: outerData.state,
            startEvent: { ...outerData.startEvent }
          };
          newArrearTrigger.push(newObj);
        }
        return outerData;
      });

      updateData.arrearsTriggerStepConfig2StartEventList.push(...newArrearTrigger);

      //Update StepEvent State
      let updateState = null;
      const uniqueStates = [...new Set(newArrearTrigger.map(x => x.state))];
      if (uniqueStates.length === 1) {
        updateState = +uniqueStates[0];
      } else {
        updateState = 3;
      }

      updateData.state = updateState;

      return updateData;
    });
    return updateDistictStepConfig;
  }

  throwArrearTriggerPlanError() {
    this.RequiredCalculationType.externalError = true;
    this.RequiredContextType.externalError = true;
    this.RequiredExternalProd.externalError = true;
    this.RequiredStartEvent.externalError = true;
    this.RequiredDaysDue.externalError = true;
    this.RequiredDueDates.externalError = true;
  }

  removeArrearTriggerPlanError() {
    this.RequiredCalculationType.externalError = false;
    this.RequiredContextType.externalError = false;
    this.RequiredExternalProd.externalError = false;
    this.RequiredStartEvent.externalError = false;
    this.RequiredDaysDue.externalError = false;
    this.RequiredDueDates.externalError = false;
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage;
      });
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
      }
    } else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError
      );

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }

  spliceStartEventError() {
    /*Splice Model Error */
    const daysDueEvent = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('plan.arrearsTrigger.ValidationError.DaysDue') +
          this.translate.instant('plan.arrearsTrigger.ValidationError.required')
    );
    if (daysDueEvent >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(daysDueEvent, 1);
    }

    const dueDatesEvent = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('plan.arrearsTrigger.ValidationError.DueDates') +
          this.translate.instant('plan.arrearsTrigger.ValidationError.required')
    );
    if (dueDatesEvent >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(dueDatesEvent, 1);
    }

    const startEvent = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('plan.arrearsTrigger.ValidationError.StartEvent') +
          this.translate.instant('plan.arrearsTrigger.ValidationError.required')
    );
    if (startEvent >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(startEvent, 1);
    }
  }

  onsortStartEvent(event: any, stepList: any[]) {

    if (event.sortField == 'startEvent.caption' && event.sortOrder == -1) {
      stepList.sort((a, b) => (a.startEvent.caption > b.startEvent.caption ? -1 : 1));
    } else if (event.sortField == 'startEvent.caption' && event.sortOrder == 1) {
      stepList.sort((a, b) => (a.startEvent?.caption > b.startEvent?.caption ? 1 : -1));
    }

    if (event.sortField == 'numberOfDueDatesConfig' && event.sortOrder == -1) {
      stepList.sort((a, b) => (a.numberOfDueDatesConfig > b.numberOfDueDatesConfig ? -1 : 1));
    } else if (event.sortField == 'numberOfDueDatesConfig' && event.sortOrder == 1) {
      stepList.sort((a, b) => (a?.numberOfDueDatesConfig > b?.numberOfDueDatesConfig ? 1 : -1));
    }

    if (event.sortField == 'numberOfDaysDueConfig' && event.sortOrder == -1) {
      stepList.sort((a, b) => (a?.numberOfDaysDueConfig > b?.numberOfDaysDueConfig ? -1 : 1));
    } else if (event.sortField == 'numberOfDaysDueConfig' && event.sortOrder == 1) {
      stepList.sort((a, b) => (a?.numberOfDaysDueConfig > b?.numberOfDaysDueConfig ? 1 : -1));
    }

    this.arrearTriggerPlanData.arrearsTriggerStepConfigList = stepList;
  }

  onsortExternalProductEvent(event: any, externalList: any[]){
    if (event.sortField == 'externalProductReference' && event.sortOrder == -1) {
      externalList.sort((a, b) => (a?.externalProductReference > b?.externalProductReference ? -1 : 1));
    } else if (event.sortField == 'externalProductReference' && event.sortOrder == 1) {
      externalList.sort((a, b) => (a?.externalProductReference > b?.externalProductReference ? 1 : -1));
    }

    this.arrearTriggerPlanData.arrearsTriggerPlan2ExternalProductReferenceList = externalList;
  }
}
