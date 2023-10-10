import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
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
import { EventDateTypeDto } from './Models/event-dateTypeDto.model';
import { FollowUpEventConfigurationDto } from './Models/followup-event-configurationDto.model';
import { FollowUpEventNameDto } from './Models/followup-event-nameDto.model';
import { Dtostate } from './Models/dtobase.model';
import { FollowUpEventConfigurationService } from './Services/follow-up-event-configuration.service';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mprsc-followup-event-configuration',
  templateUrl: './followup-event-configuration.component.html',
  styleUrls: ['./followup-event-configuration.component.scss']
})
export class FollowupEventConfigurationComponent implements OnInit {
  @ViewChild('followUpForm', { static: true }) followUpForm!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  public RequiredFollowUp: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredEventCreation: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredEventHandling: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';
  showDialog = false;
  followupHeader!: any[];
  validationHeader!: any;
  navigateURL: any;
  hideCard = true;
  exceptionBox!: boolean
  errorCode !:string

  followUpEventNameList: FollowUpEventNameDto[] = [];
  eventDateTypeList: EventDateTypeDto[] = [];
  followUpEventConfigList: FollowUpEventConfigurationDto[] = [];
  followUpEventConfigData: FollowUpEventConfigurationDto = new FollowUpEventConfigurationDto();
  deletedArray: FollowUpEventConfigurationDto[] = [];
  businessValidationError!: any;
  highlightFollowUpData: FollowUpEventConfigurationDto = new FollowUpEventConfigurationDto();

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public spinnerService: SpinnerService,
    public fluidValidation: fluidValidationService,
    public followUpeventConfigService: FollowUpEventConfigurationService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('process.Validation.Header');
    this.businessValidationError = this.translate.instant('process.cm-followup-event.ValidationError.businessError');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.followUpEventNameList = data.followUpEventNameList;
      this.eventDateTypeList = data.eventDateList;

      const UpdateFollowUpEventConfigList = data.followUpConfigList.map((followUp: FollowUpEventConfigurationDto) => {
        return { ...followUp, isSelected: false, randomNumber: this.generateRandomNumber() };
      });

      if (UpdateFollowUpEventConfigList.length > 0) {
        UpdateFollowUpEventConfigList[0].isSelected = true;
        this.followUpEventConfigList = [...UpdateFollowUpEventConfigList];
        this.followUpEventConfigData = this.followUpEventConfigList[0];
        this.highlightFollowUpData = this.followUpEventConfigList[0];
      }else{
        this.hideCard = false;
      }
    });

    this.followupHeader = [
      { header: this.translate.instant('process.cm-followup-event.tabel.FollowupEvent'), field: 'followUpEventName.caption', width: '50%' },
      {
        header: this.translate.instant('process.cm-followup-event.tabel.EventCreationDateType'),
        field: 'eventCreationDateType.caption',
        width: '25%'
      },
      {
        header: this.translate.instant('process.cm-followup-event.tabel.EventHandlingDateType'),
        field: 'eventHandlingDateType.caption',
        width: '20%'
      },
      { header: this.translate.instant('process.cm-followup-event.tabel.Delete'), field: 'Delete', fieldType: 'deleteButton', width: '5%' }
    ];
  }

  buildConfiguration() {
    const followUpNameError = new ErrorDto();
    followUpNameError.validation = 'required';
    followUpNameError.isModelError = true;
    followUpNameError.validationMessage =
      this.translate.instant('process.cm-followup-event.ValidationError.FollowupEvent') +
      this.translate.instant('process.cm-followup-event.ValidationError.required');
    this.RequiredFollowUp.required = true;
    this.RequiredFollowUp.Errors = [followUpNameError];

    const eventCreationError = new ErrorDto();
    eventCreationError.validation = 'required';
    eventCreationError.isModelError = true;
    eventCreationError.validationMessage =
      this.translate.instant('process.cm-followup-event.ValidationError.EventCreationDateType') +
      this.translate.instant('process.cm-followup-event.ValidationError.required');
    this.RequiredEventCreation.required = true;
    this.RequiredEventCreation.Errors = [eventCreationError];

    const eventHandlingError = new ErrorDto();
    eventHandlingError.validation = 'required';
    eventHandlingError.isModelError = true;
    eventHandlingError.validationMessage =
      this.translate.instant('process.cm-followup-event.ValidationError.EventHandlingDateType') +
      this.translate.instant('process.cm-followup-event.ValidationError.required');
    this.RequiredEventHandling.required = true;
    this.RequiredEventHandling.Errors = [eventHandlingError];
  }

  addNewRow() {
    if (this.followUpForm.valid) {
      if (!this.isDuplicateFollowUpNameExists(this.followUpEventConfigList)) {
        if (this.followUpEventConfigList.length == 0) {
          this.hideCard = true;
        }

        this.RemoveBusinessError(this.businessValidationError);
        let updatefollowUpEventConfigList = [...this.followUpEventConfigList];
        updatefollowUpEventConfigList = this.rowDeselectData(updatefollowUpEventConfigList);
        this.followUpEventConfigData = new FollowUpEventConfigurationDto();

        updatefollowUpEventConfigList.push({
          ...this.followUpEventConfigData,
          randomNumber: this.generateRandomNumber(),
          isSelected: true,
          state: 1
        });
        this.followUpEventConfigList = [...updatefollowUpEventConfigList];
        this.highlightFollowUpData = this.followUpEventConfigList[this.followUpEventConfigList.length - 1];
        this.followUpForm.resetForm();
        this.removeFollowUpError();
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwFollowUpError();
    }
  }
  onRowselect(event: FollowUpEventConfigurationDto) {
    if (this.followUpForm.valid || event.isSelected) {
      if (!this.isDuplicateFollowUpNameExists(this.followUpEventConfigList) || event.isSelected) {
        this.RemoveBusinessError(this.businessValidationError);
        let updateFollowUpEventData = this.followUpEventConfigList;
        const eventIndex = updateFollowUpEventData.findIndex(x => x.isSelected);

        updateFollowUpEventData = this.rowDeselectData(updateFollowUpEventData);

        this.followUpEventConfigList[eventIndex].isSelected = updateFollowUpEventData[eventIndex].isSelected;

        const selectedIndex = updateFollowUpEventData.findIndex(x => x.randomNumber == event.randomNumber);

        this.followUpEventConfigList[selectedIndex].isSelected = true;
        this.highlightFollowUpData = this.followUpEventConfigList[selectedIndex];
        this.followUpEventConfigData = event;
        this.removeFollowUpError();
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwFollowUpError();
    }
  }

  rowDeselectData(genericData: FollowUpEventConfigurationDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: FollowUpEventConfigurationDto) => {
            return {
              ...x,
              isSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onRowDelete(event: FollowUpEventConfigurationDto) {
    if ((this.followUpForm.valid && !this.isDuplicateFollowUpNameExists(this.followUpEventConfigList)) || event.isSelected) {
      const followUpEventConfigListData = [...this.followUpEventConfigList];

      const todeleteIndex = followUpEventConfigListData.findIndex((data: FollowUpEventConfigurationDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != followUpEventConfigListData.length - 1) {
        if (followUpEventConfigListData[todeleteIndex].state == 1) {
          followUpEventConfigListData.splice(todeleteIndex, 1);
          this.removeFollowUpError();
          this.RemoveBusinessError(this.businessValidationError);
        } else {
          followUpEventConfigListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...followUpEventConfigListData[todeleteIndex] });
          followUpEventConfigListData.splice(todeleteIndex, 1);
          this.removeFollowUpError();
          this.RemoveBusinessError(this.businessValidationError);
        }

        if (followUpEventConfigListData.length > 0) {
          this.followUpEventConfigList = this.rowDeselectData(followUpEventConfigListData);
          this.followUpEventConfigList[0].isSelected = true;
          this.followUpEventConfigData = this.followUpEventConfigList[0];
          this.highlightFollowUpData = this.followUpEventConfigList[0];
        } else {
          this.followUpEventConfigList = [];
          this.followUpEventConfigData = new FollowUpEventConfigurationDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      } else {
        if (followUpEventConfigListData[todeleteIndex].state == 1) {
          followUpEventConfigListData.splice(todeleteIndex, 1);
          this.removeFollowUpError();
          this.RemoveBusinessError(this.businessValidationError);
        } else {
          followUpEventConfigListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...followUpEventConfigListData[todeleteIndex] });
          followUpEventConfigListData.splice(todeleteIndex, 1);
          this.removeFollowUpError();
          this.RemoveBusinessError(this.businessValidationError);
        }

        if (followUpEventConfigListData.length > 0) {
          this.followUpEventConfigList = this.rowDeselectData(followUpEventConfigListData);
          this.followUpEventConfigList[this.followUpEventConfigList?.length - 1].isSelected = true;
          const lastIndex = this.followUpEventConfigList.findIndex((x: FollowUpEventConfigurationDto) => x.isSelected);

          this.followUpEventConfigData = this.followUpEventConfigList[lastIndex];
          this.highlightFollowUpData = this.followUpEventConfigList[lastIndex];
        } else {
          this.followUpEventConfigList = [];
          this.followUpEventConfigData = new FollowUpEventConfigurationDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateFollowUpNameExists(this.followUpEventConfigList)) {
        this.throwBusinessError(this.businessValidationError);
      } else {
        this.throwFollowUpError();
      }
    }
  }

  onfollowUpEventNameChange(event: any) {
    const selectedIndex = this.followUpEventConfigList.findIndex((x: FollowUpEventConfigurationDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.followUpEventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpEventName = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpEventConfigList[selectedIndex].followUpEventName = updategrid.followUpEventName;
      this.followUpEventConfigList[selectedIndex].state = updategrid.state;
      this.followUpEventConfigData.followUpEventName = event.value;
    } else if (event?.value == null) {
      const updateData = this.followUpEventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpEventName = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpEventConfigList[selectedIndex].followUpEventName = null;
      this.followUpEventConfigList[selectedIndex].state = updategrid.state;
      this.followUpEventConfigData.followUpEventName = null;
      this.RequiredFollowUp.externalError = true;
    }
  }

  oneventCreationDateTypeChange(event: any) {
    const selectedIndex = this.followUpEventConfigList.findIndex((x: FollowUpEventConfigurationDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.followUpEventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventCreationDateType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpEventConfigList[selectedIndex].eventCreationDateType = updategrid.eventCreationDateType;
      this.followUpEventConfigList[selectedIndex].state = updategrid.state;
      this.followUpEventConfigData.eventCreationDateType = event.value;
    } else if (event?.value == null) {
      const updateData = this.followUpEventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventCreationDateType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpEventConfigList[selectedIndex].eventCreationDateType = null;
      this.followUpEventConfigList[selectedIndex].state = updategrid.state;
      this.followUpEventConfigData.eventCreationDateType = null;
      this.RequiredEventCreation.externalError = true;
    }
  }

  oneventHandlingDateTypeChange(event: any) {
    const selectedIndex = this.followUpEventConfigList.findIndex((x: FollowUpEventConfigurationDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.followUpEventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventHandlingDateType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpEventConfigList[selectedIndex].eventHandlingDateType = updategrid.eventHandlingDateType;
      this.followUpEventConfigList[selectedIndex].state = updategrid.state;
      this.followUpEventConfigData.eventHandlingDateType = event.value;
    } else if (event?.value == null) {
      const updateData = this.followUpEventConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventHandlingDateType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpEventConfigList[selectedIndex].eventHandlingDateType = null;
      this.followUpEventConfigList[selectedIndex].state = updategrid.state;
      this.followUpEventConfigData.eventHandlingDateType = null;
      this.RequiredEventHandling.externalError = true;
    }
  }
  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }
  onSave(followUpEventConfigList: FollowUpEventConfigurationDto[]) {
    if (this.followUpForm.valid) {
      if (!this.isDuplicateFollowUpNameExists(followUpEventConfigList)) {
        this.removeFollowUpError();
        this.RemoveBusinessError(this.businessValidationError);
        followUpEventConfigList.map(data => {
          if (data.state != 0) {
            this.deletedArray.push({ ...data });
          }
        });


        this.followUpeventConfigService.saveFollowUpEventConfiguration(this.deletedArray).subscribe(responseData => {
          this.spinnerService.setIsLoading(false);
          this.deletedArray=[];
          if (responseData) {
            this.followUpeventConfigService.getFollowUpEventConfiguration().subscribe((data: any) => {
              this.deletedArray=[];
              this.spinnerService.setIsLoading(false);

              const UpdateFollowUpEventConfigList = data.map((followUp: FollowUpEventConfigurationDto) => {
                return { ...followUp, isSelected: false, randomNumber: this.generateRandomNumber() };
              });

              if (UpdateFollowUpEventConfigList.length > 0) {
                this.followUpEventConfigList = [...UpdateFollowUpEventConfigList];
                const selectedIndex = this.followUpEventConfigList.findIndex(
                  x => x.followUpEventName?.codeId === this.followUpEventConfigData.followUpEventName?.codeId
                );
                this.followUpEventConfigList[selectedIndex].isSelected = true;
                this.followUpEventConfigData = this.followUpEventConfigList[selectedIndex];
                this.highlightFollowUpData = this.followUpEventConfigList[selectedIndex];
              }else{
                this.hideCard = false;
              }
            },err =>{
              if(err?.error?.errorCode){
                this.errorCode = err.error.errorCode;
              }else{
                this.errorCode= 'InternalServiceFault';
              }
              this.spinnerService.setIsLoading(false);
              this.deletedArray=[];
              this.exceptionBox = true;
            });
          }
        },err =>{
          if(err?.error?.errorCode){
            this.errorCode = err.error.errorCode;
          }else{
            this.errorCode= 'InternalServiceFault';
          }
          this.spinnerService.setIsLoading(false);
          this.deletedArray=[];
          this.exceptionBox = true;
        });
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    }else{
      this.throwFollowUpError();
    }
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const isChangedIndexExist = this.followUpEventConfigList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.removeFollowUpError();
      this.RemoveBusinessError(this.businessValidationError);
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(followUpList: FollowUpEventConfigurationDto[]) {
    this.showDialog = false;

    if (this.followUpForm.valid) {
      if (!this.isDuplicateFollowUpNameExists(this.followUpEventConfigList)) {
        this.onSave(followUpList);
        this.followUpForm.resetForm();
        this.removeFollowUpError();
        this.RemoveBusinessError(this.businessValidationError);
        window.location.assign(this.navigateURL);
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwFollowUpError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeFollowUpError();
    this.RemoveBusinessError(this.businessValidationError);
     window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  throwFollowUpError() {
    this.RequiredEventCreation.externalError = true;
    this.RequiredEventHandling.externalError = true;
    this.RequiredFollowUp.externalError = true;
  }

  removeFollowUpError() {
    this.RequiredEventCreation.externalError = false;
    this.RequiredEventHandling.externalError = false;
    this.RequiredFollowUp.externalError = false;
  }

  isDuplicateFollowUpNameExists(newgridDate: FollowUpEventConfigurationDto[]) {
    const removeNullDateValue = newgridDate.filter((date: FollowUpEventConfigurationDto) => date.followUpEventName?.codeId);
    const uniqueValues = [...new Set(removeNullDateValue.map((date: FollowUpEventConfigurationDto) => date.followUpEventName?.codeId))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
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
}
