import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { EventConfigurationDto } from './Models/event-configuration.model';
import { FollowUpEventNameDto } from './Models/followUp-eventNameDto.model';
import { ServiceActionNameDto } from './Models/service-actionNameDto.model';
import { Dtostate } from './Models/dtobase.model';
import { EventConfigurationService } from './Services/event-configuration.service';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { CodeTable } from '../manage-notification-config/Models/code-table.model';

@Component({
  selector: 'mprsc-event-configuration',
  templateUrl: './event-configuration.component.html',
  styleUrls: ['./event-configuration.component.scss']
})
export class EventConfigurationComponent implements OnInit {
  @ViewChild('eventForm', { static: true }) eventForm!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  public RequiredFollowUpName: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredServiceActionName: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredEventHandler: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  placeholder = 'Select';
  event!: any[];
  eventHeader!: any[];
  validationHeader!: any;
  uniqueRecord!: any;
  eventConfigList!: EventConfigurationDto[];
  eventConfigData: EventConfigurationDto = new EventConfigurationDto();
  serviceActionList!: ServiceActionNameDto[];
  followupNameList!: FollowUpEventNameDto[];
  EventHandlerDropdown =
    [{ caption: 'ServiceAction', codeId: 1 },
    { caption: 'ServiceBus', codeId: 2 }]

  deletedArray: EventConfigurationDto[] = [];
  businessValidationError!: any;
  hideCard = true;
  showDialog = false;
  exceptionBox!: boolean;
  navigateURL!: any;
  highlightEventConfig: EventConfigurationDto = new EventConfigurationDto();
  errorCode !: string

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public fluidValidation: fluidValidationService,
    public eventConfigService: EventConfigurationService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('process.Validation.Header');
    this.businessValidationError = this.translate.instant('process.cm-event-config.ValidationError.businessError');
    this.uniqueRecord = this.translate.instant('process.cm-event-config.ValidationError.uniqueRecord')
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.followupNameList = data.followUpEventList;
      this.serviceActionList = data.serviceActionList;
      const updateEventList = data.eventConfigList.map((x: EventConfigurationDto) => {
        return { ...x, isSelected: false, randomNumber: this.generateRandomNumber() };
      });

      if (updateEventList.length > 0) {
        updateEventList[0].isSelected = true;
        this.eventConfigList = [...updateEventList];
        this.eventConfigList.forEach(x => {
          const dropdownIndex = this.EventHandlerDropdown.findIndex(y => y.caption == x.eventHandler);
          x.modifiedEventHandler = this.EventHandlerDropdown[dropdownIndex] as CodeTable;
          if (x.eventHandler == 'ServiceBus') {
            x.isEnableServiceAction = false;
          }
          else {
            x.isEnableServiceAction = true;
          }
        })
        this.eventConfigData = this.eventConfigList[0];
        this.highlightEventConfig = this.eventConfigList[0];
      } else {
        this.hideCard = false;
      }
    });

    this.eventHeader = [
      { header: this.translate.instant('process.cm-event-config.tabel.FollowupEvent'), field: 'followUpEvent.caption', width: '30%' },
      {
        header: this.translate.instant('process.cm-event-config.tabel.ServiceActionName'),
        field: 'serviceActionName.caption',
        width: '30%'
      },
      { header: this.translate.instant('process.cm-event-config.tabel.EventHandler'), field: 'eventHandler', width: '35%' },
      { header: this.translate.instant('process.cm-event-config.tabel.delete'), field: 'delete', fieldType: 'deleteButton', width: '5%' }
    ];
  }

  buildConfiguration() {
    const followUpNameError = new ErrorDto();
    followUpNameError.validation = 'required';
    followUpNameError.isModelError = true;
    followUpNameError.validationMessage =
      this.translate.instant('process.cm-event-config.ValidationError.FollowupEventName') +
      this.translate.instant('process.cm-event-config.ValidationError.required');
    this.RequiredFollowUpName.required = true;
    this.RequiredFollowUpName.Errors = [followUpNameError];

    const serviceActionNameError = new ErrorDto();
    serviceActionNameError.validation = 'required';
    serviceActionNameError.isModelError = true;
    serviceActionNameError.validationMessage =
      this.translate.instant('process.cm-event-config.ValidationError.ServiceActionName') +
      this.translate.instant('process.cm-event-config.ValidationError.required');
    this.RequiredServiceActionName.required = true;
    this.RequiredServiceActionName.Errors = [serviceActionNameError];

    const eventHandlerError = new ErrorDto();
    eventHandlerError.validation = 'required';
    eventHandlerError.isModelError = true;
    eventHandlerError.validationMessage =
      this.translate.instant('process.cm-event-config.ValidationError.EventHandler') +
      this.translate.instant('process.cm-event-config.ValidationError.required');
    this.RequiredEventHandler.required = true;
    this.RequiredEventHandler.Errors = [eventHandlerError];
  }

  addNewRow() {
    if (this.eventForm.valid) {
      if (!this.isDuplicateEventExists() && !this.isUniqueRecord()) {
        if (this.eventConfigList.length == 0) {
          this.hideCard = true;
        }

        this.RemoveBusinessError(this.businessValidationError);
        this.RemoveBusinessError(this.uniqueRecord);
        let updateEventConfigList = [...this.eventConfigList];
        updateEventConfigList = this.rowDeselectData(updateEventConfigList);
        this.eventConfigData = new EventConfigurationDto();
        this.eventConfigData.isEnableServiceAction = true;

        updateEventConfigList.push({
          ...this.eventConfigData,
          randomNumber: this.generateRandomNumber(),
          isSelected: true,
          state: 1
        });
        this.eventConfigList = [...updateEventConfigList];
        this.highlightEventConfig = this.eventConfigList[this.eventConfigList.length - 1];
        this.eventForm.resetForm();
        this.removeEventConfigError();
      } else {
        if (this.isDuplicateEventExists()) {
          this.throwBusinessError(this.businessValidationError);
        }
        else if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord);
          }
      }
    } else {
      this.throwEventConfigError();
    }
  }

  onRowselect(event: EventConfigurationDto) {
    if (this.eventForm.valid || event.isSelected) {
      if (!this.isDuplicateEventExists() && !this.isUniqueRecord() || event.isSelected) {
        let updateEventConfigData = this.eventConfigList;
        const eventIndex = updateEventConfigData.findIndex(x => x.isSelected);

        updateEventConfigData = this.rowDeselectData(updateEventConfigData);

        this.eventConfigList[eventIndex].isSelected = updateEventConfigData[eventIndex].isSelected;

        const selectedIndex = updateEventConfigData.findIndex(x => x.randomNumber == event.randomNumber);

        this.eventConfigList[selectedIndex].isSelected = true;
        this.highlightEventConfig = this.eventConfigList[selectedIndex];
        this.eventConfigData = event;
        this.RemoveBusinessError(this.businessValidationError);
        this.RemoveBusinessError(this.uniqueRecord);
        this.removeEventConfigError();
      } else {
        if (this.isDuplicateEventExists()) {
          this.throwBusinessError(this.businessValidationError);
        }
        else if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord);
        }
      }
    } else {
      this.throwEventConfigError();
    }
  }

  onRowDelete(event: EventConfigurationDto) {
    if ((this.eventForm.valid && !this.isDuplicateEventExists() && !this.isUniqueRecord()) || event.isSelected) {
      const eventConfigListData = [...this.eventConfigList];

      const todeleteIndex = eventConfigListData.findIndex((data: EventConfigurationDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != eventConfigListData.length - 1) {
        if (eventConfigListData[todeleteIndex].state == 1) {
          eventConfigListData.splice(todeleteIndex, 1);
          this.removeEventConfigError();
          this.RemoveBusinessError(this.businessValidationError);
          this.RemoveBusinessError(this.uniqueRecord);
        } else {
          eventConfigListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...eventConfigListData[todeleteIndex] });
          eventConfigListData.splice(todeleteIndex, 1);
          this.removeEventConfigError();
          this.RemoveBusinessError(this.businessValidationError);
          this.RemoveBusinessError(this.uniqueRecord);
        }

        if (eventConfigListData.length > 0) {
          this.eventConfigList = this.rowDeselectData(eventConfigListData);
          this.eventConfigList[0].isSelected = true;
          this.eventConfigData = this.eventConfigList[0];
          this.highlightEventConfig = this.eventConfigList[0];
        } else {
          this.eventConfigList = [];
          this.eventConfigData = new EventConfigurationDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      } else {
        if (eventConfigListData[todeleteIndex].state == 1) {
          eventConfigListData.splice(todeleteIndex, 1);
          this.removeEventConfigError();
          this.RemoveBusinessError(this.businessValidationError);
          this.RemoveBusinessError(this.uniqueRecord);
        } else {
          eventConfigListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...eventConfigListData[todeleteIndex] });
          eventConfigListData.splice(todeleteIndex, 1);
          this.removeEventConfigError();
          this.RemoveBusinessError(this.businessValidationError);
          this.RemoveBusinessError(this.uniqueRecord);
        }

        if (eventConfigListData.length > 0) {
          this.eventConfigList = this.rowDeselectData(eventConfigListData);
          this.eventConfigList[this.eventConfigList?.length - 1].isSelected = true;
          const lastIndex = this.eventConfigList.findIndex((x: EventConfigurationDto) => x.isSelected);

          this.eventConfigData = this.eventConfigList[lastIndex];

          this.highlightEventConfig = this.eventConfigList[lastIndex];
        } else {
          this.eventConfigList = [];
          this.eventConfigData = new EventConfigurationDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateEventExists()) {
        this.throwBusinessError(this.businessValidationError);
      }
      else if (this.isUniqueRecord()) {
        this.throwBusinessError(this.uniqueRecord);
      }
      else {
        this.throwEventConfigError();
      }
    }
  }

  rowDeselectData(genericData: EventConfigurationDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: EventConfigurationDto) => {
          return {
            ...x,
            isSelected: false
          };
        })
        : [];
    return updateDeselect;
  }

  isDuplicateEventExists(): boolean {
    const eventConfigList = this.eventConfigList.filter(x => x.eventHandler == 'ServiceAction');
    console.log(eventConfigList)
    let eventConfigDup = eventConfigList.reduce((array: EventConfigurationDto[], current) => {
      if (
        !array.some(
          (item: EventConfigurationDto) =>
            item.followUpEvent?.caption == current.followUpEvent?.caption &&
            item.serviceActionName?.caption == current.serviceActionName?.caption
        )
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (eventConfigDup.length != eventConfigList.length) {
      return true;
    } else {
      eventConfigDup = [];
      return false;
    }
  }

  isUniqueRecord(): boolean {
    const eventConfigList = this.eventConfigList.filter(x => x.eventHandler == 'ServiceBus');
    console.log(eventConfigList)
    let eventConfigDup = eventConfigList.reduce((array: EventConfigurationDto[], current) => {
      if (
        !array.some(
          (item: EventConfigurationDto) =>
            item.followUpEvent?.caption == current.followUpEvent?.caption
        )
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (eventConfigDup.length != eventConfigList.length) {
      return true;
    } else {
      eventConfigDup = [];
      return false;
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }
  onfollowUpEventNameChange(event: any) {
    const selectedIndex = this.eventConfigList.findIndex((x: EventConfigurationDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.eventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpEvent = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.eventConfigList[selectedIndex].followUpEvent = updategrid.followUpEvent;
      this.eventConfigList[selectedIndex].state = updategrid.state;
      this.eventConfigData.followUpEvent = event.value;
    } else if (event?.value == null) {
      const updateData = this.eventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpEvent = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.eventConfigList[selectedIndex].followUpEvent = null;
      this.eventConfigList[selectedIndex].state = updategrid.state;
      this.eventConfigData.followUpEvent = null;
      this.RequiredFollowUpName.externalError = true;
    }
    if (this.isDuplicateEventExists()) {
      this.throwBusinessError(this.businessValidationError);
    }
    else {
      this.RemoveBusinessError(this.businessValidationError);
    }
    if (this.isUniqueRecord()) {
      this.throwBusinessError(this.uniqueRecord);
    }
    else {
      this.RemoveBusinessError(this.uniqueRecord);
    }
  }

  onserviceActionNameChange(event: any) {
    const selectedIndex = this.eventConfigList.findIndex((x: EventConfigurationDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.eventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.serviceActionName = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.eventConfigList[selectedIndex].serviceActionName = updategrid.serviceActionName;
      this.eventConfigList[selectedIndex].state = updategrid.state;
      this.eventConfigData.serviceActionName = event.value;
    } else if (event?.value == null) {
      const updateData = this.eventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.serviceActionName = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.eventConfigList[selectedIndex].serviceActionName = null;
      this.eventConfigList[selectedIndex].state = updategrid.state;
      this.eventConfigData.serviceActionName = null;
      this.RequiredServiceActionName.externalError = true;
    }
    if (this.isDuplicateEventExists()) {
      this.throwBusinessError(this.businessValidationError);
    }
    else {
      this.RemoveBusinessError(this.businessValidationError);
    }
  }

  oneventHandlerChange(event: any) {
    const selectedIndex = this.eventConfigList.findIndex((x: EventConfigurationDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.eventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventHandler = event.value?.caption;
      updategrid.modifiedEventHandler = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.eventConfigList[selectedIndex].eventHandler = updategrid.eventHandler;
      this.eventConfigList[selectedIndex].state = updategrid.state;
      this.eventConfigData.eventHandler = event.value?.caption;
      this.eventConfigList[selectedIndex].modifiedEventHandler = updategrid.modifiedEventHandler;
      this.eventConfigData.modifiedEventHandler = event.value;
      if (event.value?.codeId == 1) {
        this.eventConfigData.isEnableServiceAction = true;
      }
      else {
        this.eventConfigList[selectedIndex].serviceActionName = null;
        this.eventConfigData.serviceActionName = null
        this.eventConfigData.isEnableServiceAction = false;
      }
    } else if (event?.value == null) {
      const updateData = this.eventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventHandler = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.eventConfigList[selectedIndex].eventHandler = null;
      this.eventConfigList[selectedIndex].state = updategrid.state;
      this.eventConfigData.eventHandler = null;
      this.eventConfigData.isEnableServiceAction = true;
      this.RequiredEventHandler.externalError = true;
    }
    if (this.isUniqueRecord()) {
      this.throwBusinessError(this.uniqueRecord);
    }
    else {
      this.RemoveBusinessError(this.uniqueRecord);
    }
  }

  onSave(eventConfigListData: EventConfigurationDto[]) {
    if (this.eventForm.valid) {
      if (!this.isDuplicateEventExists() && !this.isUniqueRecord()) {
        this.RemoveBusinessError(this.businessValidationError);
        this.RemoveBusinessError(this.uniqueRecord);

        eventConfigListData.map(data => {
          if (data.state != 0) {
            this.deletedArray.push({ ...data });
          }
        });

        this.eventConfigService.saveEventConfiguration(this.deletedArray).subscribe(
          data => {
            this.deletedArray = [];
            this.spinnerService.setIsLoading(false);
            if (data) {
              this.eventConfigService.getEventConfiguration().subscribe(
                (responseData: any) => {
                  this.deletedArray = [];
                  this.spinnerService.setIsLoading(false);
                  const updateEventList = responseData.map((x: EventConfigurationDto) => {
                    return { ...x, isSelected: false, randomNumber: this.generateRandomNumber() };
                  });

                  if (updateEventList.length > 0) {
                    this.eventConfigList = [...updateEventList];
                    const selectedIndex = this.eventConfigList.findIndex(
                      x =>
                        x.followUpEvent?.codeId === this.eventConfigData.followUpEvent?.codeId &&
                        x.serviceActionName?.codeId === this.eventConfigData.serviceActionName?.codeId
                    );
                    this.eventConfigList[selectedIndex].isSelected = true;
                    this.eventConfigList = [...updateEventList];
                    this.eventConfigList.forEach(x => {
                      const dropdownIndex = this.EventHandlerDropdown.findIndex(y => y.caption == x.eventHandler);
                      x.modifiedEventHandler = this.EventHandlerDropdown[dropdownIndex] as CodeTable;
                      if (x.eventHandler == 'ServiceBus') {
                        x.isEnableServiceAction = false;
                      }
                      else {
                        x.isEnableServiceAction = true;
                      }
                    })
                    this.eventConfigData = this.eventConfigList[selectedIndex];
                    this.highlightEventConfig = this.eventConfigList[selectedIndex];
                  } else {
                    this.hideCard = false;
                  }
                },
                err => {
                  if (err?.error?.errorCode) {
                    this.errorCode = err.error.errorCode;
                  } else {
                    this.errorCode = 'InternalServiceFault';
                  }
                  this.spinnerService.setIsLoading(false);
                  this.deletedArray = [];
                  this.exceptionBox = true;
                }
              );
            }
          },
          err => {
            if (err?.error?.errorCode) {
              this.errorCode = err.error.errorCode;
            } else {
              this.errorCode = 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.deletedArray = [];
            this.exceptionBox = true;
          }
        );
      } else {
        if (this.isDuplicateEventExists()) {
          this.throwBusinessError(this.businessValidationError);
        }
        else if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord);
        }
      }
    } else {
      this.throwEventConfigError();
    }
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }

  onClose() {
    const isChangedIndexExist = this.eventConfigList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.removeEventConfigError();
      this.RemoveBusinessError(this.businessValidationError);
      this.RemoveBusinessError(this.uniqueRecord);
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(followUpList: EventConfigurationDto[]) {
    this.showDialog = false;

    if (this.eventForm.valid) {
      if (!this.isDuplicateEventExists() && !this.isUniqueRecord()) {
        this.onSave(followUpList);
        this.eventForm.resetForm();
        this.removeEventConfigError();
        this.RemoveBusinessError(this.businessValidationError);
        this.RemoveBusinessError(this.uniqueRecord);
        window.location.assign(this.navigateURL);
      } else {
        if (this.isDuplicateEventExists()) {
          this.throwBusinessError(this.businessValidationError);
        }
        else if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord);
        }
      }
    } else {
      this.throwEventConfigError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeEventConfigError();
    this.RemoveBusinessError(this.businessValidationError);
    this.RemoveBusinessError(this.uniqueRecord);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
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

  throwEventConfigError() {
    this.RequiredFollowUpName.externalError = true;
    this.RequiredServiceActionName.externalError = true;
    this.RequiredEventHandler.externalError = true;
  }

  removeEventConfigError() {
    this.RequiredFollowUpName.externalError = false;
    this.RequiredServiceActionName.externalError = false;
    this.RequiredEventHandler.externalError = false;
  }
}
