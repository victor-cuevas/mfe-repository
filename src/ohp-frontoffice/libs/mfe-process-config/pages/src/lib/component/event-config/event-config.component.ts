import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { EventConfigurationService } from './service/event-configuration.service';
import { eventConfigModel } from './Models/eventConfiguration.model';
import { followUpEventNameModel } from './Models/followUpEventName.model';
import { serviceActionName } from './Models/serviceActionName.model';
import { stateModel } from './Models/state.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { CodeTable } from '../followup-event-configuration/Models/code-table.model';



@Component({
  selector: 'mprsc-event-config',
  templateUrl: './event-config.component.html',
  styleUrls: ['./event-config.component.scss']
})
export class EventConfigComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public EventNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ServiceActionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public EventHandlerTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;


  placeholder = 'Select';
  EventConfigResponse: eventConfigModel[] = []
  deletedRecords: eventConfigModel[] = []
  eventConfigDup: eventConfigModel[] = []
  index: any
  eventConfigCard!: eventConfigModel
  eventNameResponse: followUpEventNameModel[] = []
  serviceActionResponse: serviceActionName[] = []
  eventconfigHeader!: any[];
  businessError = this.translate.instant('process.event-config.mandatory.Errormsg')
  uniqueRecord = this.translate.instant('process.event-config.mandatory.uniqueRecord')
  Header = this.translate.instant('process.Validation.Header');
  Nothide!: boolean
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  errorCode!: string
  EventHandlerDropdown =
    [{ caption: 'ServiceAction', codeId: 1 },
    { caption: 'ServiceBus', codeId: 2 }]


  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public EventConfigService: EventConfigurationService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  SettingFalse() {
    if (this.EventConfigResponse.length > 0) {
      this.EventConfigResponse.forEach(x => {
        x.isEntered = false;
      })
    }

  }

  isBusinessError(): boolean {
    const EventConfigResponse = this.EventConfigResponse.filter(x => x.eventHandler == 'ServiceAction')
    this.eventConfigDup = EventConfigResponse.reduce((array: eventConfigModel[], current) => {
      if ((
        !array.some(
          (item: eventConfigModel) => item.followUpEvent?.caption == current.followUpEvent?.caption &&
            item.serviceActionName?.caption == current.serviceActionName?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.eventConfigDup.length != EventConfigResponse.length) {

      return true;
    }
    else {
      this.eventConfigDup = [];
      return false;
    }

  }

  isUniqueRecord(): boolean {
    const EventConfigResponse = this.EventConfigResponse.filter(x => x.eventHandler == 'ServiceBus')
    this.eventConfigDup = EventConfigResponse.reduce((array: eventConfigModel[], current) => {
      if ((
        !array.some(
          (item: eventConfigModel) => item.followUpEvent?.caption == current.followUpEvent?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.eventConfigDup.length != EventConfigResponse.length) {

      return true;
    }
    else {
      this.eventConfigDup = [];
      return false;
    }
  }

  clickGrid(dataselected: eventConfigModel) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!this.isBusinessError() && !this.isUniqueRecord()) {
          this.RemoveBusinessError(this.businessError);
          this.RemoveBusinessError(this.uniqueRecord)
          this.SettingFalse();
          this.index = this.EventConfigResponse.findIndex(item => {
            return item == dataselected
          })
          this.EventConfigResponse[this.index].isEntered = true;
          this.eventConfigCard = dataselected;
        }
        else {
          if (this.isBusinessError()) {
            this.throwBusinessError(this.businessError);
          }
          if (this.isUniqueRecord()) {
            this.throwBusinessError(this.uniqueRecord)
          }
        }

      }
      else {
        this.EventNameDropdownConfig.externalError = true;
        this.ServiceActionDropdownConfig.externalError = true;
        this.EventHandlerTextBoxconfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
        if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord)
        }
      }
    }
  }

  addRow() {

    if ((this.userDetailsform.valid) ||
      this.EventConfigResponse.length == 0) {

      if (!this.isBusinessError() && !this.isUniqueRecord()) {
        const eventConfigObj = new eventConfigModel();
        this.SettingFalse();
        eventConfigObj.isEntered = true;
        eventConfigObj.state = stateModel.Created;
        eventConfigObj.pKey = 0;
        eventConfigObj.canValidate = false;
        eventConfigObj.rowVersion = 0;
        eventConfigObj.isEnableServiceAction = true;
        const newlist = this.EventConfigResponse;
        newlist.push({ ...eventConfigObj });
        this.EventConfigResponse = [...newlist];
        this.eventConfigCard = new eventConfigModel();
        this.eventConfigCard = this.EventConfigResponse[this.EventConfigResponse.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.RemoveBusinessError(this.uniqueRecord)
        this.EventNameDropdownConfig.externalError = false;
        this.ServiceActionDropdownConfig.externalError = false;
        this.EventHandlerTextBoxconfig.externalError = false;

      }
      else {
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
        if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord)
        }
      }

    }
    else {
      this.EventNameDropdownConfig.externalError = true;
      this.ServiceActionDropdownConfig.externalError = true;
      this.EventHandlerTextBoxconfig.externalError = true;

      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      if (this.isUniqueRecord()) {
        this.throwBusinessError(this.uniqueRecord)
      }
    }
  }

  onRowDelete(event: eventConfigModel, array: eventConfigModel[]) {


    if (this.userDetailsform.valid || ((event.followUpEvent?.caption == null || event.serviceActionName?.caption == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if (!this.isBusinessError() && !this.isUniqueRecord() || (this.isBusinessError() && event.isEntered) || (this.isUniqueRecord() && event.isEntered)) {
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.EventConfigResponse = [...array];
        if (this.EventConfigResponse.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);

        }
        if (this.EventConfigResponse.length > 0) {
          this.SettingFalse();
          this.eventConfigCard = this.EventConfigResponse[this.EventConfigResponse.length - 1]
          this.EventConfigResponse[this.EventConfigResponse.length - 1].isEntered = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.RemoveBusinessError(this.uniqueRecord)
        this.EventNameDropdownConfig.externalError = false;
        this.ServiceActionDropdownConfig.externalError = false;
        this.EventHandlerTextBoxconfig.externalError = false;
      }
      else {
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
        if (this.isUniqueRecord()) {
          this.throwBusinessError(this.uniqueRecord)
        }
      }

    }
    else {
      this.EventNameDropdownConfig.externalError = true;
      this.ServiceActionDropdownConfig.externalError = true;
      this.EventHandlerTextBoxconfig.externalError = true;

    }

  }

  changeEventName(event: any) {
    this.index = this.EventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.EventConfigResponse[this.index].state == stateModel.Unknown) {
      this.EventConfigResponse[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.EventConfigResponse[this.index].followUpEvent = event?.value;
      this.eventConfigCard.followUpEvent = event?.value;

    }
    else {
      this.EventConfigResponse[this.index].followUpEvent = null as unknown as followUpEventNameModel;
      this.eventConfigCard.followUpEvent = null as unknown as followUpEventNameModel;
      this.EventNameDropdownConfig.externalError = true;
    }
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError);
    }
    else {
      this.RemoveBusinessError(this.businessError);
    }
    if (this.isUniqueRecord()) {
      this.throwBusinessError(this.uniqueRecord);
    }
    else {
      this.RemoveBusinessError(this.uniqueRecord);
    }
  }

  changeServiceAction(event: any) {
    this.index = this.EventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.EventConfigResponse[this.index].state == stateModel.Unknown) {
      this.EventConfigResponse[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.EventConfigResponse[this.index].serviceActionName = event?.value;
      this.eventConfigCard.serviceActionName = event?.value;

    }
    else {
      this.EventConfigResponse[this.index].serviceActionName = null as unknown as serviceActionName;
      this.eventConfigCard.serviceActionName = null as unknown as serviceActionName;
      
      this.ServiceActionDropdownConfig.externalError = true;
    }
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError);
    }
    else {
      this.RemoveBusinessError(this.businessError);
    }
  }

  changeEventHandler(event: any) {

    this.index = this.EventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.EventConfigResponse[this.index].state == stateModel.Unknown) {
      this.EventConfigResponse[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.EventConfigResponse[this.index].eventHandler = event?.value?.caption;
      this.eventConfigCard.eventHandler = event?.value?.caption;
      this.EventConfigResponse[this.index].modifiedEventHandler = event?.value;
      this.eventConfigCard.modifiedEventHandler = event?.value;

      if (event.value?.codeId == 1) {
        this.eventConfigCard.isEnableServiceAction = true;
      }
      else {
        this.EventConfigResponse[this.index].serviceActionName = null as unknown as serviceActionName;
        this.eventConfigCard.serviceActionName = null as unknown as serviceActionName
        this.eventConfigCard.isEnableServiceAction = false;
      }
    }
    else {
      this.EventConfigResponse[this.index].eventHandler = null as unknown as string;
      this.eventConfigCard.eventHandler = null as unknown as string;
      this.EventConfigResponse[this.index].modifiedEventHandler = null as unknown as CodeTable;
      this.eventConfigCard.modifiedEventHandler = null as unknown as CodeTable;
      this.eventConfigCard.isEnableServiceAction = true;
      this.EventHandlerTextBoxconfig.externalError = true;
    }
    if (this.isUniqueRecord()) {
      this.throwBusinessError(this.uniqueRecord);
    }
    else {
      this.RemoveBusinessError(this.uniqueRecord);
    }
  }

  changeIntegrationQueue(event: any) {

    this.index = this.EventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.EventConfigResponse[this.index].state == stateModel.Unknown) {
      this.EventConfigResponse[this.index].state = stateModel.Dirty;
    }

    this.EventConfigResponse[this.index].integrationQueueConfigurationName = event;
    this.eventConfigCard.integrationQueueConfigurationName = event;
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

      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);

      }

    })

  }

  onclose() {
    const unsaved = this.EventConfigResponse.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: eventConfigModel[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.RemoveBusinessError(this.uniqueRecord);
    this.EventNameDropdownConfig.externalError = false;
    this.ServiceActionDropdownConfig.externalError = false;
    this.EventHandlerTextBoxconfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: eventConfigModel[]) {

    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError);
      this.isErrors = true;
    }

    else if (this.isUniqueRecord()) {
      this.throwBusinessError(this.uniqueRecord)
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {
      this.RemoveBusinessError(this.businessError);
      this.RemoveBusinessError(this.uniqueRecord);
      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x })
        }

      })

      this.deletedRecords.forEach(y => {
        if (y.state == stateModel.Deleted && y.followUpEvent?.caption == null) {
          y.followUpEvent = null as unknown as followUpEventNameModel;
        }
        if (y.state == stateModel.Deleted && y.serviceActionName?.caption == null) {
          y.serviceActionName = null as unknown as serviceActionName;
        }
        if (y.state == stateModel.Deleted && y.eventHandler == null) {
          y.eventHandler = null as unknown as string;

        }
        if (y.state == stateModel.Deleted && y.integrationQueueConfigurationName == null) {
          y.integrationQueueConfigurationName = null as unknown as string;
        }
      })


      this.spinnerService.setIsLoading(true);
      this.EventConfigService.PostEventConfigResponse(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);


        this.show = false;
        this.deletedRecords = [...new Array<eventConfigModel>()];

        this.EventConfigService.GetEventConfigResponse().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as eventConfigModel[]
          this.EventConfigResponse = [...getResponse];

          this.EventNameDropdownConfig.externalError = false;
          this.ServiceActionDropdownConfig.externalError = false;
          this.EventHandlerTextBoxconfig.externalError = false

          if (this.EventConfigResponse.length > 0) {
            this.EventConfigResponse.forEach(x => {
              const dropdownIndex = this.EventHandlerDropdown.findIndex(y => y.caption == x.eventHandler);
              x.modifiedEventHandler = this.EventHandlerDropdown[dropdownIndex] as CodeTable;
              if (x.eventHandler == 'ServiceBus') {
                x.isEnableServiceAction = false;
              }
              else {
                x.isEnableServiceAction = true;
              }
            })
            this.SettingFalse();
            this.index = this.EventConfigResponse.findIndex(i => {
              return ((i.followUpEvent?.caption == this.eventConfigCard.followUpEvent?.caption) && (i.serviceActionName?.caption == this.eventConfigCard.serviceActionName?.caption) &&
                (i.eventHandler == this.eventConfigCard.eventHandler) && (i.integrationQueueConfigurationName == this.eventConfigCard.integrationQueueConfigurationName))
            })
            this.EventConfigResponse[this.index].isEntered = true;
            this.eventConfigCard = this.EventConfigResponse[this.index]
          }

        },
          err => {
            if (err?.error?.errorCode) {
              this.errorCode = err.error.errorCode;
            }
            else {
              this.errorCode = "InternalServiceFault"
            }
            this.spinnerService.setIsLoading(false);
            this.deletedRecords = [...new Array<eventConfigModel>()];
            this.exceptionBox = true;
          })

      },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<eventConfigModel>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.EventNameDropdownConfig.externalError = true;
      this.ServiceActionDropdownConfig.externalError = true;
      this.EventHandlerTextBoxconfig.externalError = true

    }
  }


  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.EventConfigData
        console.log(getResponse)
        this.EventConfigResponse = [...getResponse];
        this.deletedRecords = [...new Array<eventConfigModel>()];
        this.index = 0;
        if (this.EventConfigResponse.length > 0) {
          this.Nothide = true;
          this.SettingFalse();
          this.EventConfigResponse.forEach(x => {
            const dropdownIndex = this.EventHandlerDropdown.findIndex(y => y.caption == x.eventHandler);
            x.modifiedEventHandler = this.EventHandlerDropdown[dropdownIndex] as CodeTable;
            if (x.eventHandler == 'ServiceBus') {
              x.isEnableServiceAction = false;
            }
            else {
              x.isEnableServiceAction = true;
            }
          })
          this.EventConfigResponse[this.index].isEntered = true;
          this.eventConfigCard = this.EventConfigResponse[this.index];
        }
      }
    }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.eventNameResponse = res.eventNameData

      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.serviceActionResponse = res.serviceActionData

      }
    })


    this.eventconfigHeader = [
      { header: this.translate.instant('process.event-config.tabel.followEvent'), field: 'followUpEvent.caption', width: '20%' },
      { header: this.translate.instant('process.event-config.tabel.ServiceActionName'), field: 'serviceActionName.caption', width: '30%' },
      { header: this.translate.instant('process.event-config.tabel.IntergrationQueueConfigurationName'), field: 'integrationQueueConfigurationName', width: '30%' },
      { header: this.translate.instant('process.event-config.tabel.EventHandler'), field: 'eventHandler', width: '18%' },
      { header: this.translate.instant('process.event-config.tabel.delete'), field: 'delete', width: '10%', fieldType: 'deleteButton' }];
  }


  buildConfiguration() {

    const serviceActionRequired = new ErrorDto;
    serviceActionRequired.validation = "required";
    serviceActionRequired.isModelError = true;
    serviceActionRequired.validationMessage = this.translate.instant('process.event-config.mandatory.ServiceAction') + this.translate.instant('process.event-config.mandatory.required');
    this.ServiceActionDropdownConfig.Errors = [serviceActionRequired];
    this.ServiceActionDropdownConfig.required = true

    const eventNameRequired = new ErrorDto;
    eventNameRequired.validation = "required";
    eventNameRequired.isModelError = true;
    eventNameRequired.validationMessage = this.translate.instant('process.event-config.mandatory.EventName') + this.translate.instant('process.event-config.mandatory.required');
    this.EventNameDropdownConfig.Errors = [eventNameRequired];
    this.EventNameDropdownConfig.required = true

    const eventHandlerRequired = new ErrorDto;
    eventHandlerRequired.validation = "required";
    eventHandlerRequired.isModelError = true;
    eventHandlerRequired.validationMessage = this.translate.instant('process.event-config.mandatory.EventHandler') + this.translate.instant('process.event-config.mandatory.required');
    this.EventHandlerTextBoxconfig.Errors = [eventHandlerRequired];
    this.EventHandlerTextBoxconfig.required = true
  }

}
