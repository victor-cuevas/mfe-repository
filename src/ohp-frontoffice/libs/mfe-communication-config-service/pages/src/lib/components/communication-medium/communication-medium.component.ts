import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlsBaseService, FluidDropDownConfig,ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { CommunicationMedium2DocumentTemplateDto } from './Models/communicationMedium2DocumentTemplateDto.model';
import { CommunicationMediumNameDto } from './Models/communicationMediumNameDto.model';
import { DocumentTemplateTypeDto } from './Models/documentTemplateTypeDto.model';
import { CommunicationMediumService } from './Services/communication-medium.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
@Component({
  selector: 'mccs-communication-medium',
  templateUrl: './communication-medium.component.html',
  styleUrls: ['./communication-medium.component.scss']
})
export class CommunicationMediumComponent implements OnInit {
  @ViewChild("communicationMediumform", { static: true }) communicationMediumform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public CommunicationMediumDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DocumentTemplateDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  placeholder = 'select';
  commMediumHeader = [
    { header: this.translate.instant('communication.communication-medium.tabel.CommunicationMedium'), field: 'communicationMedium.caption', width: '50%' },
    { header: this.translate.instant('communication.communication-medium.tabel.DocumentTemplate'), field: 'documentTemplate.caption', width: '45%' },
    { field: 'Delete', width: '5%', fieldType: 'deleteButton' }];
  deletedRecords: CommunicationMedium2DocumentTemplateDto[] = [];
  Response: CommunicationMedium2DocumentTemplateDto[] = [];
  communicationMediumNameResponse: CommunicationMediumNameDto[] = [];
  documentTemplateTypeResponse:DocumentTemplateTypeDto[]=[];
  card!: CommunicationMedium2DocumentTemplateDto
  index!: any
  Nothide!: boolean
  Header = this.translate.instant('communication.Validation.validationHeader')
  businessError = this.translate.instant('communication.communication-medium.ValidationError.businessError')
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  editable!: boolean;
  communicationMediumDup: CommunicationMedium2DocumentTemplateDto[] = []

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public communicationMediumService: CommunicationMediumService,
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
    this.communicationMediumDup = this.Response.reduce((array: CommunicationMedium2DocumentTemplateDto[], current) => {
      if ((
        !array.some(
          (item: CommunicationMedium2DocumentTemplateDto) => item.communicationMedium?.caption == current.communicationMedium?.caption))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.communicationMediumDup.length != this.Response.length) {

      return true;
    }
    else {

      this.communicationMediumDup = [];
      return false;
    }

  }

  clickGrid(dataselected: CommunicationMedium2DocumentTemplateDto) {
    if (dataselected) {

      if (this.communicationMediumform.valid) {

        if (!this.isBusinessError()) {
          this.SettingFalse();
        this.index = this.Response.findIndex(item => {
            return item == dataselected
          })
        this.Response[this.index].isEntered = true;
          this.card = dataselected ;
          this.editable = true;
        }
        else {
          this.throwBusinessError(this.businessError);
        }

      }
      else {
        this.CommunicationMediumDropdownConfig.externalError = true;
        this.DocumentTemplateDropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {    
    if ((this.communicationMediumform.valid) ||
      this.Response.length == 0) {

      if (!this.isBusinessError()) {
        const communicationMediumObj = new CommunicationMedium2DocumentTemplateDto();
        this.SettingFalse();
        communicationMediumObj.isEntered = true;
        communicationMediumObj.state = DtoState.Created;
        communicationMediumObj.pKey = 0;
        communicationMediumObj.canValidate = false;
        communicationMediumObj.rowVersion = 0;
        const newlist = this.Response;
        newlist.push({ ...communicationMediumObj });
        this.Response = [...newlist];
        this.communicationMediumform.resetForm();
        this.card = new CommunicationMedium2DocumentTemplateDto();
        this.card = this.Response[this.Response.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.CommunicationMediumDropdownConfig.externalError = false;
        this.DocumentTemplateDropdownConfig.externalError = false;
        this.editable = false;
      }
      else {
       this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.CommunicationMediumDropdownConfig.externalError = true;
      this.DocumentTemplateDropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: CommunicationMedium2DocumentTemplateDto, array: CommunicationMedium2DocumentTemplateDto[]) {
    if (this.communicationMediumform.valid || ((event.communicationMedium?.caption == null || event.documentTemplate?.caption == null) &&
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
          this.CommunicationMediumDropdownConfig.Errors = [];
          this.DocumentTemplateDropdownConfig.Errors = [];
        }
        if (this.Response.length > 0) {
          this.SettingFalse();
          this.card = this.Response[this.Response.length - 1]
          this.Response[this.Response.length - 1].isEntered = true;
          this.editable = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.CommunicationMediumDropdownConfig.externalError = false;
        this.DocumentTemplateDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }

    }
    else {
      this.CommunicationMediumDropdownConfig.externalError = true;
      this.DocumentTemplateDropdownConfig.externalError = true;
    }
  }

  changeCommunicationMedium(event:any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {

      this.Response[this.index].communicationMedium = event?.value;
      this.card.communicationMedium = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
    }
    else {
      this.Response[this.index].communicationMedium = null as unknown as CommunicationMediumNameDto;
      this.card.communicationMedium = null as unknown as CommunicationMediumNameDto;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
      this.CommunicationMediumDropdownConfig.externalError = true;
    }
  }

  changeDocumentTemplate(event:any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {

      this.Response[this.index].documentTemplate = event?.value;
      this.card.documentTemplate = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
    }
    else {
      this.Response[this.index].documentTemplate = null as unknown as DocumentTemplateTypeDto;
      this.card.documentTemplate = null as unknown as DocumentTemplateTypeDto;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError);
      }
      else {
        this.RemoveBusinessError(this.businessError);
      }
      this.DocumentTemplateDropdownConfig.externalError = true;
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
  onYes(GridData: CommunicationMedium2DocumentTemplateDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.CommunicationMediumDropdownConfig.externalError = false;
    this.DocumentTemplateDropdownConfig.externalError = false;
    //navigate
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: CommunicationMedium2DocumentTemplateDto[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.communicationMediumform.valid) {
      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(y => {
        if (y.state == DtoState.Deleted && y.communicationMedium?.caption == null) {
          y.communicationMedium = null as unknown as CommunicationMediumNameDto;
        }
        if (y.state == DtoState.Deleted && y.documentTemplate?.caption == null) {
          y.documentTemplate = null as unknown as DocumentTemplateTypeDto;
        }
      })
     
      this.spinnerService.setIsLoading(true);
      this.communicationMediumService.saveCommunicationMediumScreenData(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);        
        this.editable = true;
          this.show = false;
          this.deletedRecords = [...new Array<CommunicationMedium2DocumentTemplateDto>()];

          this.communicationMediumService.getCommunicationMediumScreenData().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as CommunicationMedium2DocumentTemplateDto[]
            this.Response = [...getResponse];

            this.CommunicationMediumDropdownConfig.externalError = false;
            this.DocumentTemplateDropdownConfig.externalError = false;

            if (this.Response.length > 0) {
              this.SettingFalse();
              this.index = this.Response.findIndex(i => {
                return ((i.communicationMedium?.caption == this.card.communicationMedium?.caption) && (i.documentTemplate?.caption == this.card.documentTemplate?.caption))
              })
              this.Response[this.index].isEntered = true;
              this.card = this.Response[this.index]
            }
          },
            err => {
              this.spinnerService.setIsLoading(false);
              this.deletedRecords = [...new Array<CommunicationMedium2DocumentTemplateDto>()];
              this.exceptionBox = true;
            })
      },
        err => {
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<CommunicationMedium2DocumentTemplateDto>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.CommunicationMediumDropdownConfig.externalError = true;
      this.DocumentTemplateDropdownConfig.externalError = true;
    }
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.communicationMediumData
        this.Response = [...getResponse];
        this.deletedRecords = [...new Array<CommunicationMedium2DocumentTemplateDto>()];
        this.index = 0;
        if (this.Response.length > 0) {
          this.Nothide = true;
          this.SettingFalse();
          this.Response[this.index].isEntered = true;
          this.card = this.Response[this.index] ;
        }
      }
    },
      err => {
        this.deletedRecords = [...new Array<CommunicationMedium2DocumentTemplateDto>()];
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.communicationMediumNameResponse = res.communicationMediumNameList

      }
    },
      err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.documentTemplateTypeResponse = res.documentTemplateTypeList

      }
    },
      err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      })
    }


  buildConfiguration() {
    const communicationMediumRequired = new ErrorDto;
    communicationMediumRequired.validation = "required";
    communicationMediumRequired.isModelError = true;
    communicationMediumRequired.validationMessage = this.translate.instant('communication.communication-medium.mandatory.CommunicationMedium') + this.translate.instant('communication.communication-medium.mandatory.required');
    this.CommunicationMediumDropdownConfig.Errors = [communicationMediumRequired];
    this.CommunicationMediumDropdownConfig.required = true

    const documentTemplateRequired = new ErrorDto;
    documentTemplateRequired.validation = "required";
    documentTemplateRequired.isModelError = true;
    documentTemplateRequired.validationMessage = this.translate.instant('communication.communication-medium.mandatory.DocumentTemplate') + this.translate.instant('communication.communication-medium.mandatory.required');
    this.DocumentTemplateDropdownConfig.Errors = [documentTemplateRequired];
    this.DocumentTemplateDropdownConfig.required = true
  }

}
