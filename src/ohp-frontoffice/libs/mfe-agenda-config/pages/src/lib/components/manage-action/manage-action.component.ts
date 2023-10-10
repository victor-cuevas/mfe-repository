import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  FluidButtonConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidTextAreaConfig
} from '@close-front-office/shared/fluid-controls';

import { ErrorDto, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionTypeDto } from './models/action-type.model';
import { ActionFunctionalityDto } from './models/action-functionality.model';
import { ActionReceiverTypeDto } from './models/action-reciverType.model';
import { ActionDto } from './models/action.model';
import { TranslateService } from '@ngx-translate/core';
import { PriorityDto } from './models/priority.model';
import { ManageActionService } from './services/manage-action.service';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'magenda-manage-action',
  templateUrl: './manage-action.component.html',
  styleUrls: ['./manage-action.component.scss']
})
export class ManageActionComponent implements OnInit {
  @ViewChild('manageActionform', { static: true }) manageActionform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextboxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TextAreaConfig: FluidTextAreaConfig = this.fluidService.FluidTextAreaConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public PriorityDropDownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  TaskOverviewHeader!: any[];
  dataSelected: any;
  placeHolder = 'Select';

  TaskTypeList!: ActionTypeDto[];
  ActionFunctionalityList!: ActionFunctionalityDto[];
  DepartmentDropdownList!: ActionReceiverTypeDto[];
  PriorityList!: PriorityDto[];

  manageActionList!: ActionDto[];
  manageActionData: ActionDto = new ActionDto();
  showDialog!: boolean;
  validationHeader!: string;
  modifiedArray: ActionDto[] = [];
  validationError!: ErrorDto;
  hideCard = true;
  exceptionbox= false;
  errorCode!: string;
  highlightActionData: ActionDto = new ActionDto();
  navigateURL:any;
  intMaxValue = 2147483647;
  
  constructor(
    public fluidService: FluidControlsBaseService,
    public manageActionService: ManageActionService,
    public route: ActivatedRoute,
    public translate: TranslateService,
    public router: Router,
    public fluidValidation: fluidValidationService,
    public spinnerService : SpinnerService,
    public commonService:ConfigContextService
  ) {
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateURL = mfeConfig?.remoteUrl
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.validationHeader = this.translate.instant('agenda.Validation.Header');

    this.route.data.subscribe((data:any) => {
      if(data.actionData != null){
        this.spinnerService.setIsLoading(false);
        const updatedActionData = data.actionData.actionsList.map((datalist: ActionDto) => {
          return {
            ...datalist,
            defaultHandleTime: datalist.defaultHandleTime / 10000000,
            modifiedHandleTime: this.toConvertTreatmentTime(datalist.defaultHandleTime / 10000000),
            isSelected: false,
            randomNumber: this.generateRandomNumber()
          };
        });
  
        updatedActionData[0].isSelected = true;
  
        this.manageActionList = updatedActionData;
        this.DepartmentDropdownList = data.actionData.actionReceiverTypeList;
        this.TaskTypeList = data.actionData.actionTypeNameList;
        this.ActionFunctionalityList = data.actionData.actionFunctionalityList;
        this.PriorityList = data.actionData.priorityList;
        this.manageActionData = this.manageActionList[0];
        this.highlightActionData = this.manageActionList[0];
      }
     
    });

    this.TaskOverviewHeader = [
      { header: this.translate.instant('agenda.action.Name'), field: 'name', width: '30%', pSortableColumnDisabled: true },
      { header: this.translate.instant('agenda.action.ActionTypeColon'), field: 'actionType.caption', width: '15%' },
      {
        header: this.translate.instant('agenda.action.Department'),
        field: 'actionReceiverTypeName.caption',
        width: '15%'
      },
      {
        header: this.translate.instant('agenda.action.TreatmentTime'),
        field: 'modifiedHandleTime',
        width: '18%',
        pSortableColumnDisabled: true
      },
      { header: this.translate.instant('agenda.action.Maxdays'), field: 'defaultHandleMargin', width: '17%' },
      { header: '', field: 'deleteButton', width: '7%', fieldType: 'deleteButton', pSortableColumnDisabled: true }
    ];
  }

  buildConfiguration() {
    const requiredError = new ErrorDto();
    requiredError.validation = 'required';
    requiredError.isModelError = true;
    requiredError.validationMessage = this.translate.instant('agenda.action.ValidationError.ActionTypeColon') + this.translate.instant('agenda.action.ValidationError.required');
    this.RequiredDropdownConfig.required = true;
    this.RequiredDropdownConfig.Errors = [requiredError];

    const priorityRequiredError = new ErrorDto();
    priorityRequiredError.validation = 'required';
    priorityRequiredError.isModelError = true;
    priorityRequiredError.validationMessage = this.translate.instant('agenda.action.ValidationError.Priority') + this.translate.instant('agenda.action.ValidationError.required');
    this.PriorityDropDownConfig.required = true;
    this.PriorityDropDownConfig.Errors = [priorityRequiredError];
  }

  onRowselect(event: ActionDto) {
    if (event) {
      if (this.manageActionform.invalid && !event.isSelected) {
        this.RequiredDropdownConfig.externalError = true;
        this.PriorityDropDownConfig.externalError = true;
      } else if (this.manageActionform.valid || event.isSelected) {
        let manageactiondata = this.manageActionList;
        const eventIndex = manageactiondata.findIndex(x => x.isSelected);

        manageactiondata = this.rowDeselectData(manageactiondata);

        this.manageActionList[eventIndex].isSelected = manageactiondata[eventIndex].isSelected;

        const selectedIndex = manageactiondata.findIndex(x => x.randomNumber == event.randomNumber);

        manageactiondata = [...this.rowSelectData(event?.randomNumber, manageactiondata)];
        this.manageActionList[selectedIndex].isSelected = manageactiondata[selectedIndex].isSelected;

        this.manageActionData = event;
        this.highlightActionData =  this.manageActionList[selectedIndex];
      }
    }
  }

  onRowDelete(event: ActionDto, actiondata: ActionDto[]) {
    if (this.manageActionform.valid || event.isSelected) {
      let actionListData = [...actiondata];

      const todeleteIndex = actiondata.findIndex((data: ActionDto) => {
        return data?.['randomNumber'] === event?.randomNumber;
      });

      if (todeleteIndex != actionListData.length - 1) {
        if (actionListData[todeleteIndex].state == 1) {
          actionListData.splice(todeleteIndex, 1);
        } else {
          actionListData[todeleteIndex].state = 4;
          this.modifiedArray.push({ ...actionListData[todeleteIndex] });
          actionListData.splice(todeleteIndex, 1);
        }

        if (actionListData.length > 0) {
          actionListData = this.rowDeselectData(actionListData);
          this.manageActionList = this.rowSelectData(actionListData[0]?.['randomNumber'], actionListData);

          const firstIndex = this.manageActionList.findIndex((x: ActionDto) => x?.['isSelected']);
          this.manageActionData = this.manageActionList[firstIndex];
          this.highlightActionData =this.manageActionList[firstIndex];
        } else {
          this.manageActionList = [];
          this.manageActionData = new ActionDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
          this.RequiredDropdownConfig.externalError = false;
        this.PriorityDropDownConfig.externalError = false;
        }
      } else {
        if (actionListData[todeleteIndex].state == 1) {
          actionListData.splice(todeleteIndex, 1);
        } else {
          actionListData[todeleteIndex].state = 4;
          this.modifiedArray.push({ ...actionListData[todeleteIndex] });
          actionListData.splice(todeleteIndex, 1);
        }

        if (actionListData.length > 0) {
          actionListData = this.rowDeselectData(actionListData);
          this.manageActionList = this.rowSelectData(actionListData[actionListData?.length - 1].randomNumber, actionListData);

          const lastIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

          this.manageActionData = this.manageActionList[lastIndex];
          this.highlightActionData =this.manageActionList[lastIndex];
        } else {
          this.manageActionList = [];
          this.manageActionData = new ActionDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
          this.RequiredDropdownConfig.externalError = false;
          this.PriorityDropDownConfig.externalError = false;
        }
      }
    } else {
      this.RequiredDropdownConfig.externalError = true;
      this.PriorityDropDownConfig.externalError = true;
    }
  }

  addTask() {
    if (this.manageActionform.valid) {
      if (this.manageActionList.length == 0) {
        this.hideCard = true;
      }
      let actionList = this.manageActionList;
      actionList = this.rowDeselectData(actionList);

      this.manageActionData = new ActionDto();

      this.manageActionData.defaultHandleTime = 0;

      const updatednewActionList = actionList;

      updatednewActionList.push({
        ...this.manageActionData,
        modifiedHandleTime: '0:0:0',
        isSelected: true,
        randomNumber: this.generateRandomNumber(),
        state: 1
      });

      this.manageActionList = [...updatednewActionList];
      this.RequiredDropdownConfig.externalError = false;
      this.PriorityDropDownConfig.externalError = false;
      this.manageActionform.resetForm();
      this.highlightActionData =  this.manageActionList[this.manageActionList.length-1];
    } else {
      this.RequiredDropdownConfig.externalError = true;
      this.PriorityDropDownConfig.externalError = true;
    }
  }

  onNameChange(event: string) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.name = event;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      this.manageActionList[selectedIndex].name = updategrid.name;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.name = event;
    }
  }

  onDayChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0) {
      const updateData = this.manageActionList;

      const minutes =
        updateData[selectedIndex].defaultHandleTimeMinutes === undefined ? 0 : updateData[selectedIndex].defaultHandleTimeMinutes;

      const hours = updateData[selectedIndex].defaultHandleTimeHours === undefined ? 0 : updateData[selectedIndex].defaultHandleTimeHours;

      const updategrid = { ...updateData[selectedIndex] };
      updategrid.defaultHandleTimeDays = +event.target.value;
      updategrid.modifiedHandleTime = this.displayTreatmentTime(+event.target.value, hours, minutes);
      updategrid.defaultHandleTime = +event.target.value * 24 * 3600 + hours * 3600 + minutes * 60;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }

      this.manageActionList[selectedIndex].defaultHandleTimeDays = updategrid.defaultHandleTimeDays;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionList[selectedIndex].modifiedHandleTime = updategrid.modifiedHandleTime;
      this.manageActionList[selectedIndex].defaultHandleTime = updategrid.defaultHandleTime;
      this.manageActionData.defaultHandleTimeDays = +event.target.value;

      if (+event.target.value === 0) {
        this.manageActionform.controls['Days'].setValue('');
      } else {
        this.manageActionData.defaultHandleTimeDays = +event.target.value;
      }
    }
  }

  onMinutesChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0) {
      const updateData = this.manageActionList;

      const days = updateData[selectedIndex].defaultHandleTimeDays === undefined ? 0 : updateData[selectedIndex].defaultHandleTimeDays;
      const hours = updateData[selectedIndex].defaultHandleTimeHours === undefined ? 0 : updateData[selectedIndex].defaultHandleTimeHours;

      const updategrid = { ...updateData[selectedIndex] };
      updategrid.defaultHandleTimeMinutes = +event.target.value;

      updategrid.modifiedHandleTime = this.displayTreatmentTime(days, hours, +event.target.value);
      updategrid.defaultHandleTime = +event.target.value * 60 + days * 24 * 3600 + hours * 3600;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }

      this.manageActionList[selectedIndex].defaultHandleTimeMinutes = updategrid.defaultHandleTimeMinutes;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionList[selectedIndex].modifiedHandleTime = updategrid.modifiedHandleTime;
      this.manageActionList[selectedIndex].defaultHandleTime = updategrid.defaultHandleTime;
      this.manageActionData.defaultHandleTimeMinutes = +event.target.value;
      if (+event.target.value === 0) {
        this.manageActionform.controls['Minutes'].setValue('');
      } else {
        this.manageActionData.defaultHandleTimeMinutes = +event.target.value;
      }
    }
  }

  onHourChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0) {
      const updateData = this.manageActionList;

      const minutes =
        updateData[selectedIndex].defaultHandleTimeMinutes === undefined ? 0 : updateData[selectedIndex].defaultHandleTimeMinutes;

      const days = updateData[selectedIndex].defaultHandleTimeDays === undefined ? 0 : updateData[selectedIndex].defaultHandleTimeDays;

      const updategrid = { ...updateData[selectedIndex] };
      updategrid.defaultHandleTimeHours = +event.target.value;
      updategrid.modifiedHandleTime = this.displayTreatmentTime(days, +event.target.value, minutes);
      updategrid.defaultHandleTime = +event.target.value * 60 * 60 + days * 24 * 3600 + minutes * 60;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }

      this.manageActionList[selectedIndex].defaultHandleTimeHours = updategrid.defaultHandleTimeHours;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionList[selectedIndex].modifiedHandleTime = updategrid.modifiedHandleTime;
      this.manageActionList[selectedIndex].defaultHandleTime = updategrid.defaultHandleTime;
      this.manageActionData.defaultHandleTimeHours = +event.target.value;

      if (+event.target.value === 0) {
        this.manageActionform.controls['Hours'].setValue('');
      } else {
        this.manageActionData.defaultHandleTimeHours = +event.target.value;
      }
    }
  }

  onTaskTypeChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0 && event?.value !== null) {
      const updateData = [...this.manageActionList];
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.actionType = event?.value;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }

      this.manageActionList[selectedIndex].actionType = updategrid.actionType;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.actionType = event?.value;
    } else if (event?.value === null) {
      const updateData = [...this.manageActionList];
      const updategrid = { ...updateData[selectedIndex] };
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      updategrid.actionType = null;
      this.manageActionList[selectedIndex].state = updategrid.state;

      this.manageActionData.actionType = null;
      this.manageActionList[selectedIndex].actionType = null;

      this.RequiredDropdownConfig.externalError = true;
    }
  }

  onDepartmentChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0 && event?.value !== null) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.actionReceiverTypeName = event?.value;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }

      this.manageActionList[selectedIndex].actionReceiverTypeName = updategrid.actionReceiverTypeName;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.actionReceiverTypeName = event?.value;
    } else if (event?.value === null) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.actionReceiverTypeName = null;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }

      this.manageActionList[selectedIndex].actionReceiverTypeName = updategrid.actionReceiverTypeName;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.actionReceiverTypeName = null;
    }
  }

  onFunctionalityChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: any) => x?.['isSelected']);

    if (selectedIndex >= 0 && event?.value !== null) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.actionFunctionality = event.value;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      this.manageActionList[selectedIndex].actionFunctionality = updategrid.actionFunctionality;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.actionFunctionality = event.value;
    } else if (event?.value === null) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.actionFunctionality = event.value;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      this.manageActionList[selectedIndex].actionFunctionality = updategrid.actionFunctionality;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.actionFunctionality = event.value;
    }
  }

  onMaxdaysChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0) {
      if (+event.target.value > this.intMaxValue) {
        const updateData = this.manageActionList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.defaultHandleMargin = 0;
        if (updategrid.state != 1) {
          updategrid.state = 3;
        }
        this.manageActionList[selectedIndex].defaultHandleMargin = 0;
        this.manageActionList[selectedIndex].state = updategrid.state;
        if (this.manageActionList[selectedIndex].defaultHandleMargin === 0) {
          this.manageActionform.controls['MaxDays'].setValue('');
        } else {
          this.manageActionData.defaultHandleMargin = +event.target.value;
        }
      } else {
        const updateData = this.manageActionList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.defaultHandleMargin = +event.target.value;
        if (updategrid.state != 1) {
          updategrid.state = 3;
        }
        this.manageActionList[selectedIndex].defaultHandleMargin = updategrid.defaultHandleMargin;
        this.manageActionList[selectedIndex].state = updategrid.state;

        if (+event.target.value === 0) {
          this.manageActionform.controls['MaxDays'].setValue('');
        } else {
          this.manageActionData.defaultHandleMargin = +event.target.value;
        }
      }
    }
  }

  onMessageChange(event: string) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.actionMessage = event;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      this.manageActionList[selectedIndex].actionMessage = updategrid.actionMessage;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.actionMessage = event;
    }
  }

  onPriorityChange(event: any) {
    const selectedIndex = this.manageActionList.findIndex((x: ActionDto) => x.isSelected);

    if (selectedIndex >= 0 && event?.value !== null) {
      const updateData = this.manageActionList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.priority = event.value;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      this.manageActionList[selectedIndex].priority = updategrid.priority;
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.priority = event.value;
    } else if (event?.value === null) {
      const updateData = [...this.manageActionList];
      const updategrid = { ...updateData[selectedIndex] };

      updategrid.priority = null;
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      this.manageActionList[selectedIndex].state = updategrid.state;
      this.manageActionData.priority = null;
      this.manageActionList[selectedIndex].priority = null;
      this.PriorityDropDownConfig.externalError = true;
    }
  }

  onSave(manageActionData: ActionDto[]) {
    if (this.manageActionform.valid) {
      manageActionData.map(actionData => {
        actionData.defaultHandleTime = actionData.defaultHandleTime * 10000000;
        if (actionData.state != 0) {
          this.modifiedArray.push({ ...actionData });
        }
      });
      const SaveData = this.modifiedArray.map(({ modifiedHandleTime, isSelected, randomNumber, ...actionList }) => ({ ...actionList }));
      this.spinnerService.setIsLoading(true);
      this.manageActionService.saveManageAction(SaveData).subscribe(responseActionList => {
        this.spinnerService.setIsLoading(false);
        if (responseActionList.length > 0) {
          this.modifiedArray = [];

          const responseActionData = responseActionList.map((data: ActionDto) => {
            return {
              ...data,
              defaultHandleTime: data.defaultHandleTime / 10000000,
              modifiedHandleTime: this.toConvertTreatmentTime(data.defaultHandleTime / 10000000),
              isSelected: false,
              randomNumber: this.generateRandomNumber(),
              state: 0
            };
          });

          
          this.manageActionList = [...responseActionData];

          const savedIndex = this.manageActionList.findIndex(x => (x.name == this.manageActionData.name) &&
            (x.actionType?.codeId == this.manageActionData.actionType?.codeId) &&
            (x.actionReceiverTypeName?.codeId == this.manageActionData.actionReceiverTypeName?.codeId) &&
            (x.priority?.codeId == this.manageActionData.priority?.codeId))

          this.manageActionList[savedIndex].isSelected = true;
          this.manageActionData = this.manageActionList[savedIndex];
          this.highlightActionData = this.manageActionList[savedIndex];
        }
      },err =>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerService.setIsLoading(false);
        this.exceptionbox = true;
      });
    }
  }

  displayTreatmentTime(day: number, hours: number, minutes: number) {
    const data = `${day}:${hours}:${minutes}`;
    return data;
  }

  onClose() {
    const isChangedIndexexist = this.manageActionList.findIndex(x => x.state == 3 || x.state == 1 || this.modifiedArray.length > 0);
    if (isChangedIndexexist >= 0) {
      this.showDialog = true;
    } else {
      window.location.assign(this.navigateURL);
    }
  }

  onDialogYes(manageActionList:ActionDto[]) {
    this.showDialog = false;
    const isChangedIndexexist = manageActionList.findIndex(x => x.state == 3 || x.state == 1);
    if (isChangedIndexexist >= 0 || this.modifiedArray.length > 0) {
      if (this.manageActionform.valid) {
        this.onSave(manageActionList);
        window.location.assign(this.navigateURL);
      } else {
        this.RequiredDropdownConfig.externalError = true;
        this.PriorityDropDownConfig.externalError = true;
      }
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.RequiredDropdownConfig.externalError = false;
    this.PriorityDropDownConfig.externalError = false;
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  rowDeselectData(actiondata: ActionDto[]) {
    const deSelectData = actiondata;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: ActionDto) => {
            return {
              ...x,
              isSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  rowSelectData(randomnumber: number, actiondata: ActionDto[]) {
    const gridData = actiondata;
    const selectedIndex = gridData.findIndex((x: ActionDto) => x?.['randomNumber'] === randomnumber);
    if (selectedIndex >= 0) {
      const updatedData = { ...gridData[selectedIndex] };
      updatedData.isSelected = true;
      gridData[selectedIndex] = updatedData;
    }
    return gridData;
  }

  toConvertTreatmentTime(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const data = `${days}:${hours}:${minutes}`;
    return data;
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }
  onException(){
    this.exceptionbox = false;
  }
}
