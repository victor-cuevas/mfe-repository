import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { eventdateType } from './Models/eventDateType';
import { followUpEventConfig } from './Models/followUpEventConfig';
import { followUpEventName } from './Models/followUpEventName';
import { state } from './Models/stateModel';
import { FollowUpEventService } from './Service/follow-up-event.service';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';



@Component({
  selector: 'mprsc-followup-event-config',
  templateUrl: './followup-event-config.component.html',
  styleUrls: ['./followup-event-config.component.scss']
})
export class FollowupEventConfigComponent implements OnInit {


  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public followupEventNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public eventCreationDateDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public eventhandlingDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;


  placeholder = 'select';
  followeventtableHeader!:any
  deletedRecords: followUpEventConfig[] = [];
  FollowUpEventConfigResponse: followUpEventConfig[] = [];
  FollowUpEventNameResponse: followUpEventName[] = [];
  eventDateTypeResponse: eventdateType[] = [];
  followUpEventConfigCard!: followUpEventConfig
  index!: any
  Nothide!: boolean
  Header = this.translate.instant('process.Validation.Header')
  businessError = this.translate.instant('process.followup-event.mandatory.error')
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  errorCode!:string
  navigateUrl!: string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public followUpEventService: FollowUpEventService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }
  SettingFalse() {
    if (this.FollowUpEventConfigResponse.length > 0) {
      this.FollowUpEventConfigResponse.forEach(x => {
        x.isEntered = false;
      })
    }
    
  }

  clickGrid(dataselected: followUpEventConfig) {
    if (dataselected) {

      const filteredData = this.FollowUpEventConfigResponse.map(item => { return item.followUpEventName?.caption });
      const hasValue = filteredData.some(function (item, index) {
        return filteredData.indexOf(item) != index
      })

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!hasValue) {
          this.SettingFalse();
          this.index = this.FollowUpEventConfigResponse.findIndex(item => {
            return item == dataselected
          })
          this.FollowUpEventConfigResponse[this.index].isEntered = true;
          this.followUpEventConfigCard = dataselected ;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
       
      }
      else {
        this.eventCreationDateDropdownConfig.externalError = true;
        this.eventhandlingDropdownConfig.externalError = true;
        this.followupEventNameDropdownConfig.externalError = true;
        if (hasValue) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {
    const filteredData = this.FollowUpEventConfigResponse.map(item => { return item.followUpEventName?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if ((this.userDetailsform.valid) ||
      this.FollowUpEventConfigResponse.length == 0) {

      if (!hasValue) {
        const followUpeventConfigObj = new followUpEventConfig();
        this.SettingFalse();
        followUpeventConfigObj.isEntered = true;
        followUpeventConfigObj.state = state.Created;
        followUpeventConfigObj.pKey = 0;
        followUpeventConfigObj.canValidate = false;
        followUpeventConfigObj.rowVersion = 0;
        const newlist = this.FollowUpEventConfigResponse;
        newlist.push({ ...followUpeventConfigObj });
        this.FollowUpEventConfigResponse = [...newlist];
        this.followUpEventConfigCard = new followUpEventConfig();
        this.followUpEventConfigCard = this.FollowUpEventConfigResponse[this.FollowUpEventConfigResponse.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.eventCreationDateDropdownConfig.externalError = false;
        this.eventhandlingDropdownConfig.externalError = false;
        this.followupEventNameDropdownConfig.externalError = false;

      }
      else {
        this.throwBusinessError(this.businessError)
      }
      
    }
    else {
      this.eventCreationDateDropdownConfig.externalError = true;
      this.eventhandlingDropdownConfig.externalError = true;
      this.followupEventNameDropdownConfig.externalError = true;
      if (hasValue) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: followUpEventConfig, array: followUpEventConfig[]) {

    const filteredData = this.FollowUpEventConfigResponse.map(item => { return item.followUpEventName?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (this.userDetailsform.valid || ((event.followUpEventName?.caption == null || event.eventCreationDateType?.caption == null || event.eventHandlingDateType?.caption == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if (!hasValue || (hasValue && event.isEntered)) {
        if (event.state != state.Created) {
          event.state = state.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.FollowUpEventConfigResponse = [...array];
        if (this.FollowUpEventConfigResponse.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
         
        }
        if (this.FollowUpEventConfigResponse.length > 0) {
          this.SettingFalse();
          this.followUpEventConfigCard = this.FollowUpEventConfigResponse[this.FollowUpEventConfigResponse.length - 1]
          this.FollowUpEventConfigResponse[this.FollowUpEventConfigResponse.length - 1].isEntered = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.eventCreationDateDropdownConfig.externalError = false;
        this.eventhandlingDropdownConfig.externalError = false;
        this.followupEventNameDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.eventCreationDateDropdownConfig.externalError = true;
      this.eventhandlingDropdownConfig.externalError = true;
      this.followupEventNameDropdownConfig.externalError = true;
    }

  }


  changeEventName(event: any) {

    this.index = this.FollowUpEventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.FollowUpEventConfigResponse[this.index].state == state.Unknown) {
      this.FollowUpEventConfigResponse[this.index].state = state.Dirty;
    }

    if (event?.value != null) {

      this.FollowUpEventConfigResponse[this.index].followUpEventName = event?.value;
      this.followUpEventConfigCard.followUpEventName = event?.value;
      this.RemoveBusinessError(this.businessError)
    }
    else {
      this.FollowUpEventConfigResponse[this.index].followUpEventName = null as unknown as followUpEventName;
      this.followUpEventConfigCard.followUpEventName = null as unknown as followUpEventName;
      this.RemoveBusinessError(this.businessError)
      this.followupEventNameDropdownConfig.externalError = true;
    }
    
  }

  changeEventCreationDate(event: any) {
    this.index = this.FollowUpEventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.FollowUpEventConfigResponse[this.index].state == state.Unknown) {
      this.FollowUpEventConfigResponse[this.index].state = state.Dirty;
    }

    if (event?.value != null) {

      this.FollowUpEventConfigResponse[this.index].eventCreationDateType = event?.value;
      this.followUpEventConfigCard.eventCreationDateType = event?.value;
    }
    else {
      this.FollowUpEventConfigResponse[this.index].eventCreationDateType = null as unknown as eventdateType;
      this.followUpEventConfigCard.eventCreationDateType = null as unknown as eventdateType;
      this.eventCreationDateDropdownConfig.externalError = true;
    }

    
  }

  changeEventHandlingDate(event: any) {

    this.index = this.FollowUpEventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.FollowUpEventConfigResponse[this.index].state == state.Unknown) {
      this.FollowUpEventConfigResponse[this.index].state = state.Dirty;
    }

    if (event?.value != null) {

      this.FollowUpEventConfigResponse[this.index].eventHandlingDateType = event?.value;
      this.followUpEventConfigCard.eventHandlingDateType = event?.value;
    }
    else {
      this.FollowUpEventConfigResponse[this.index].eventHandlingDateType = null as unknown as eventdateType;
      this.followUpEventConfigCard.eventHandlingDateType = null as unknown as eventdateType;
      this.eventhandlingDropdownConfig.externalError = true;
    }
  }

  changeEventCanTriggered(event: any) {

    this.index = this.FollowUpEventConfigResponse.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.FollowUpEventConfigResponse[this.index].state == state.Unknown) {
      this.FollowUpEventConfigResponse[this.index].state = state.Dirty;
    }

    if (event != null) {
     
      this.followUpEventConfigCard.canBeTriggeredManually = event;
      this.FollowUpEventConfigResponse[this.index].canBeTriggeredManually = event
      this.FollowUpEventConfigResponse[this.index].modifiedcanBeTriggeredManually = event.toString()
    }
   
  }

  onclose() {
    const unsaved = this.FollowUpEventConfigResponse.findIndex(x => {
      return x.state == state.Created || x.state == state.Dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: followUpEventConfig[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
   
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.eventCreationDateDropdownConfig.externalError = false;
    this.eventhandlingDropdownConfig.externalError = false;
    this.followupEventNameDropdownConfig.externalError = false;
    //navigate
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: followUpEventConfig[]) {

    const filteredData = this.FollowUpEventConfigResponse.map(item => { return item.followUpEventName?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (hasValue) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }
    
    else if (this.userDetailsform.valid) {

      this.isErrors = false;

      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != state.Unknown) {
          this.deletedRecords.push({ ...x })
        }
        
      })

      this.deletedRecords.forEach(y => {
        if (y.state == state.Deleted && y.followUpEventName?.caption == null) {
          y.followUpEventName = null as unknown as followUpEventName;
        }
        if (y.state == state.Deleted && y.eventCreationDateType?.caption == null) {
          y.eventCreationDateType = null as unknown as eventdateType;
        }
        if (y.state == state.Deleted && y.eventHandlingDateType?.caption == null) {
          y.eventHandlingDateType = null as unknown as eventdateType;
        }
        if (y.state == state.Created && y.canBeTriggeredManually == null) {
          y.canBeTriggeredManually = false
        }

        })

     
      this.spinnerService.setIsLoading(true);
      this.followUpEventService.PostFollowUpEventConfigResponse(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        
           this.show = false;
          this.deletedRecords = [...new Array<followUpEventConfig>()];

          this.followUpEventService.GetFollowUpEventConfigResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as followUpEventConfig [] 
            this.FollowUpEventConfigResponse = [...getResponse];

            this.eventCreationDateDropdownConfig.externalError = false;
            this.eventhandlingDropdownConfig.externalError = false;
            this.followupEventNameDropdownConfig.externalError = false;

            if (this.FollowUpEventConfigResponse.length > 0) {

              this.FollowUpEventConfigResponse.forEach(x => {
                  x.modifiedcanBeTriggeredManually = x.canBeTriggeredManually.toString();
              })

              this.SettingFalse();
              this.index = this.FollowUpEventConfigResponse.findIndex(i => {
                return ((i.followUpEventName?.caption == this.followUpEventConfigCard.followUpEventName?.caption) && (i.eventCreationDateType?.caption == this.followUpEventConfigCard.eventCreationDateType?.caption) &&
                  (i.eventHandlingDateType?.caption == this.followUpEventConfigCard.eventHandlingDateType?.caption))
              })
              this.FollowUpEventConfigResponse[this.index].isEntered = true;
              this.followUpEventConfigCard = this.FollowUpEventConfigResponse[this.index];
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
              this.deletedRecords = [...new Array<followUpEventConfig>()];
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
          this.deletedRecords = [...new Array<followUpEventConfig>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.eventCreationDateDropdownConfig.externalError = true;
      this.eventhandlingDropdownConfig.externalError = true;
      this.followupEventNameDropdownConfig.externalError = true;
    }
  }

  ngOnInit(): void {
    this.buildConfiguration()

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.followUpEventConfigData
        this.FollowUpEventConfigResponse = [...getResponse];

        if (this.FollowUpEventConfigResponse.length > 0) {
          this.FollowUpEventConfigResponse.forEach(x => {
            x.modifiedcanBeTriggeredManually = x.canBeTriggeredManually.toString();
          })
        }

        this.deletedRecords = [...new Array<followUpEventConfig>()];
        this.index = 0;
        if (this.FollowUpEventConfigResponse.length > 0) {
          this.Nothide = true;
          this.SettingFalse();
          this.FollowUpEventConfigResponse[this.index].isEntered = true;
          this.followUpEventConfigCard = this.FollowUpEventConfigResponse[this.index] ;
        }
      }
    }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.FollowUpEventNameResponse = res.eventNameData
      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.eventDateTypeResponse = res.eventDateTypeData
      }
    })
  



    this.followeventtableHeader = [
      { header: this.translate.instant('process.followup-event.tabel.FollowupEventCon'), field: 'followUpEventName.caption', width: '30%' },
      { header: this.translate.instant('process.followup-event.tabel.EventCreation'), field: 'eventCreationDateType.caption', width: '25%' },
      { header: this.translate.instant('process.followup-event.tabel.EventHandling'), field: 'eventHandlingDateType.caption', width: '25%' },
      { header: this.translate.instant('process.followup-event.tabel.CanbeTriggeredManually'), field: 'modifiedcanBeTriggeredManually', width: '20%' },
      { header: this.translate.instant('process.followup-event.tabel.delete'), field: 'delete', width: '8%',fieldType:'deleteButton' }];
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

  buildConfiguration() {
    const CreationDateRequired = new ErrorDto;
    CreationDateRequired.validation = "required";
    CreationDateRequired.isModelError = true;
    CreationDateRequired.validationMessage = this.translate.instant('process.followup-event.mandatory.EventCreation') + this.translate.instant('process.followup-event.mandatory.required');
    this.eventCreationDateDropdownConfig.Errors = [CreationDateRequired];
    this.eventCreationDateDropdownConfig.required = true

    const HandlingDateRequired = new ErrorDto;
    HandlingDateRequired.validation = "required";
    HandlingDateRequired.isModelError = true;
    HandlingDateRequired.validationMessage = this.translate.instant('process.followup-event.mandatory.EventHandling') + this.translate.instant('process.followup-event.mandatory.required');
    this.eventhandlingDropdownConfig.Errors = [HandlingDateRequired];
    this.eventhandlingDropdownConfig.required = true

    const eventNameRequired = new ErrorDto;
    eventNameRequired.validation = "required";
    eventNameRequired.isModelError = true;
    eventNameRequired.validationMessage = this.translate.instant('process.followup-event.mandatory.EventName') + this.translate.instant('process.followup-event.mandatory.required');
    this.followupEventNameDropdownConfig.Errors = [eventNameRequired];
    this.followupEventNameDropdownConfig.required = true
  }
}
