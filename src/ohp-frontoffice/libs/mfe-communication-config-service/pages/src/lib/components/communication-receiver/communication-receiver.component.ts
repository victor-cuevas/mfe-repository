import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlsBaseService, FluidDropDownConfig, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { CommunicationReceiver2RoleTypeDto } from './Models/communicationReceiver2RoleTypeDto.model';
import { CommunicationReceiverDto } from './Models/communicationReceiverDto.model';
import { RoleTypeDto } from './Models/roleTypeDto.model';
import { CommunicationReceiverService } from './Services/communication-receiver.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';

@Component({
  selector: 'mccs-communication-receiver',
  templateUrl: './communication-receiver.component.html',
  styleUrls: ['./communication-receiver.component.scss']
})
export class CommunicationReceiverComponent implements OnInit {
  @ViewChild("communicationReceiverform", { static: true }) communicationReceiverform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public CommunicationReceiverDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RoleTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  commRecHeader = [
    { header: this.translate.instant('communication.communication-receiver.tabel.CommunicationReceiver'), field: 'communicationReceiver.caption', width: '50%' },
    { header: this.translate.instant('communication.communication-receiver.tabel.RoleType'), field: 'roleType.caption', width: '45%' },
    { field: 'Delete', width: '5%', fieldType: 'deleteButton' }];

  placeholder = 'select';
  deletedRecords: CommunicationReceiver2RoleTypeDto[] = [];
  Response: CommunicationReceiver2RoleTypeDto[] = [];
  communicationReceiverResponse: CommunicationReceiverDto[] = [];
  roleTypeResponse: RoleTypeDto[] = [];
  card!: CommunicationReceiver2RoleTypeDto
  index!: any
  Nothide!: boolean
  Header = this.translate.instant('communication.Validation.validationHeader')
  businessError = this.translate.instant('communication.communication-receiver.ValidationError.businessError')
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  editable!: boolean;
  communicationReceiverDup: CommunicationReceiver2RoleTypeDto[] = []

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public communicationReceiverService: CommunicationReceiverService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    this.editable = true;
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  SettingFalse() {
    if (this.Response.length > 0) {
      this.Response.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  isBusinessError(): boolean {
    this.communicationReceiverDup = this.Response.reduce((array: CommunicationReceiver2RoleTypeDto[], current) => {
      if ((
        !array.some(
          (item: CommunicationReceiver2RoleTypeDto) => item.communicationReceiver?.caption == current.communicationReceiver?.caption))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.communicationReceiverDup.length != this.Response.length) {
      return true;
    }
    else {
      this.communicationReceiverDup = [];
      return false;
    }
  }
  clickGrid(dataselected: CommunicationReceiver2RoleTypeDto) {
    if (dataselected) {
      if (this.communicationReceiverform.valid) {
        if (!this.isBusinessError()) {
          this.SettingFalse();
          this.index = this.Response.findIndex(item => {
            return item == dataselected
          })
          this.Response[this.index].isEntered = true;
          this.card = dataselected;
          this.editable = true;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.CommunicationReceiverDropdownConfig.externalError = true;
        this.RoleTypeDropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {
    if ((this.communicationReceiverform.valid) ||
      this.Response.length == 0) {

      if (!this.isBusinessError()) {
        const communicationReceiverObj = new CommunicationReceiver2RoleTypeDto();
        this.SettingFalse();
        communicationReceiverObj.isEntered = true;
        communicationReceiverObj.state = DtoState.Created;
        communicationReceiverObj.pKey = 0;
        communicationReceiverObj.canValidate = false;
        communicationReceiverObj.rowVersion = 0;
        const newlist = this.Response;
        newlist.push({ ...communicationReceiverObj });
        this.Response = [...newlist];
        this.communicationReceiverform.resetForm();
        this.card = new CommunicationReceiver2RoleTypeDto();
        this.card = this.Response[this.Response.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.CommunicationReceiverDropdownConfig.externalError = false;
        this.RoleTypeDropdownConfig.externalError = false;
        this.editable = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.CommunicationReceiverDropdownConfig.externalError = true;
      this.RoleTypeDropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: CommunicationReceiver2RoleTypeDto, array: CommunicationReceiver2RoleTypeDto[]) {
    if (this.communicationReceiverform.valid || ((event.communicationReceiver?.caption == null || event.roleType?.caption == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      if (!this.isBusinessError() || (this.isBusinessError() && event.isEntered)) {
        if (event.state != DtoState.Created) {
          event.state = DtoState.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.Response = [...array];
        if (this.Response.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
          this.CommunicationReceiverDropdownConfig.Errors = [];
          this.RoleTypeDropdownConfig.Errors = [];
        }
        if (this.Response.length > 0) {
          this.SettingFalse();
          this.card = this.Response[this.Response.length - 1]
          this.Response[this.Response.length - 1].isEntered = true;
          this.editable = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.CommunicationReceiverDropdownConfig.externalError = false;
        this.RoleTypeDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.CommunicationReceiverDropdownConfig.externalError = true;
      this.RoleTypeDropdownConfig.externalError = true;
    }
  }

  changeCommunicationReceiver(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].communicationReceiver = event?.value;
      this.card.communicationReceiver = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
    }
    else {
      this.Response[this.index].communicationReceiver = null as unknown as CommunicationReceiverDto;
      this.card.communicationReceiver = null as unknown as CommunicationReceiverDto;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
      this.CommunicationReceiverDropdownConfig.externalError = true;
    }
  }

  changeRoleType(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].roleType = event?.value;
      this.card.roleType = event?.value;
    }
    else {
      this.Response[this.index].roleType = null as unknown as RoleTypeDto;
      this.card.roleType = null as unknown as RoleTypeDto;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
      this.RoleTypeDropdownConfig.externalError = true;
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
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  onclose() {
    const unsaved = this.Response.findIndex(x => {
      return x.state == DtoState.Created || x.state == DtoState.Dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: CommunicationReceiver2RoleTypeDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.CommunicationReceiverDropdownConfig.externalError = false;
    this.RoleTypeDropdownConfig.externalError = false;
    //navigate
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: CommunicationReceiver2RoleTypeDto[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.communicationReceiverform.valid) {
      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(y => {
        if (y.state == DtoState.Deleted && y.communicationReceiver?.caption == null) {
          y.communicationReceiver = null as unknown as CommunicationReceiverDto;
        }
        if (y.state == DtoState.Deleted && y.roleType?.caption == null) {
          y.roleType = null as unknown as RoleTypeDto;
        }
      })

      this.spinnerService.setIsLoading(true);
      this.communicationReceiverService.saveCommunicationReceiverScreenData(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        this.editable = true;
        this.show = false;
        this.deletedRecords = [...new Array<CommunicationReceiver2RoleTypeDto>()];

        this.communicationReceiverService.getCommunicationReceiverScreenData().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as CommunicationReceiver2RoleTypeDto[]
          this.Response = [...getResponse];

          this.CommunicationReceiverDropdownConfig.externalError = false;
          this.RoleTypeDropdownConfig.externalError = false;

          if (this.Response.length > 0) {
            this.SettingFalse();
            this.index = this.Response.findIndex(i => {
              return ((i.communicationReceiver?.caption == this.card.communicationReceiver?.caption) && (i.roleType?.caption == this.card.roleType?.caption))
            })
            this.Response[this.index].isEntered = true;
            this.card = this.Response[this.index]
          }
        },
          err => {
            this.spinnerService.setIsLoading(false);
            this.deletedRecords = [...new Array<CommunicationReceiver2RoleTypeDto>()];
            this.exceptionBox = true;
          })
      },
        err => {
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<CommunicationReceiver2RoleTypeDto>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.CommunicationReceiverDropdownConfig.externalError = true;
      this.RoleTypeDropdownConfig.externalError = true;
    }
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.communicationReceiverData
        this.Response = [...getResponse];
        this.deletedRecords = [...new Array<CommunicationReceiver2RoleTypeDto>()];
        this.index = 0;
        if (this.Response.length > 0) {
          this.Nothide = true;
          this.SettingFalse();
          this.Response[this.index].isEntered = true;
          this.card = this.Response[this.index];
        }
      }
    },
      err => {
        this.deletedRecords = [...new Array<CommunicationReceiver2RoleTypeDto>()];
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.communicationReceiverResponse = res.communicationReceiverList

      }
    },
      err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.roleTypeResponse = res.roleTypeList

      }
    },
      err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      })
  }


  buildConfiguration() {
    const communicationReceiverRequired = new ErrorDto;
    communicationReceiverRequired.validation = "required";
    communicationReceiverRequired.isModelError = true;
    communicationReceiverRequired.validationMessage = this.translate.instant('communication.communication-receiver.mandatory.CommunicationReceiver') + this.translate.instant('communication.communication-receiver.mandatory.required');
    this.CommunicationReceiverDropdownConfig.Errors = [communicationReceiverRequired];
    this.CommunicationReceiverDropdownConfig.required = true

    const roleTypeRequired = new ErrorDto;
    roleTypeRequired.validation = "required";
    roleTypeRequired.isModelError = true;
    roleTypeRequired.validationMessage = this.translate.instant('communication.communication-receiver.mandatory.RoleType') + this.translate.instant('communication.communication-receiver.mandatory.required');
    this.RoleTypeDropdownConfig.Errors = [roleTypeRequired];
    this.RoleTypeDropdownConfig.required = true
  }

}
