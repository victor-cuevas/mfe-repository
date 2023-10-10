import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlsBaseService, FluidCheckBoxConfig,FluidControlDatePickerConfig,FluidControlTextBoxConfig, FluidDropDownConfig, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { DocumentTemplatesDto } from './Models/documentTemplatesDto.model';
import { DocGenTypeDto } from './Models/docGenTypeDto.model';
import { DocumentTemplateTypeDto } from './Models/documentTemplateTypeDto.model';
import { OutputFormatDto } from './Models/outputFormatDto.model';
import { DocGenDtoNameDto } from './Models/docGenDtoNameDto.model';
import { DocumentTemplateBaseService } from './Services/document-templatebase.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'mccs-document-templatebase',
  templateUrl: './document-templatebase.component.html',
  styleUrls: ['./document-templatebase.component.scss']
})
export class DocumentTemplatebaseComponent implements OnInit {
  @ViewChild("documentTemplatebaseform", { static: true }) documentTemplatebaseform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DocumentTemplateTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DocGenTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public OutputFormatDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DocGenDtoNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public AdHocCheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public ValidFromDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public ValidUntilDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  documentTemplateHeader = [
    { header: this.translate.instant('communication.document-templatebase.tabel.Name'), field: 'name', width: '20%' },
    { header: this.translate.instant('communication.document-templatebase.tabel.DocumentTemplateType'), field: 'documentTemplateType.caption', width: '15%' },
    { header: this.translate.instant('communication.document-templatebase.tabel.Adhoc'), field: 'modifiedadHoc', width: '7%' },
    { header: this.translate.instant('communication.document-templatebase.tabel.DocGenType'), field: 'docGenType.caption', width: '10%' },
    { header: this.translate.instant('communication.document-templatebase.tabel.ValidFrom'), field: 'modifiedvalidFrom', width: '10%', dateSort: 'validFrom' },
    { header: this.translate.instant('communication.document-templatebase.tabel.ValidUntil'), field: 'modifiedvalidUntil', width: '9%', dateSort: 'validUntil'},
    { header: this.translate.instant('communication.document-templatebase.tabel.OutputFormat'), field: 'outputFormat.caption', width: '11%' },
    { header: this.translate.instant('communication.document-templatebase.tabel.DocGenDtoName'), field: 'docGenDtoName.caption', width: '13%' },
    { header: '', field: 'documentTemplateDeleteButton', width: '5%',fieldType: 'documentTemplateDeleteButton',  pSortableColumnDisabled: true}];

  placeholder = 'select';
  deletedRecords: DocumentTemplatesDto[] = [];
  Response: DocumentTemplatesDto[] = [];
  docGenTypeResponse: DocGenTypeDto[] = [];
  documentTemplateTypeResponse: DocumentTemplateTypeDto[] = [];
  outputFormatResponse: OutputFormatDto[] = [];
  docGenDtoNameResponse: DocGenDtoNameDto[] = [];
  card!: DocumentTemplatesDto
  index!: any
  Nothide!: boolean
  Header = this.translate.instant('communication.Validation.validationHeader')
  businessError = this.translate.instant('communication.document-templatebase.ValidationError.businessError')
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  editable!: boolean;
  documentTemplatebaseDup: DocumentTemplatesDto[] = []
  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public documentTemplateBaseService: DocumentTemplateBaseService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService, public datePipe: DatePipe) {
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
 
  isBusinessError(startDateA: Date, endDateA: Date | null, startDateB: Date, endDateB: Date | null): boolean {

    if (!endDateA && !endDateB) { return true }
    else if (endDateA && !endDateB && startDateB <= endDateA) { return true; }
    else if (!endDateA && endDateB && endDateB >= startDateA) { return true; }
    else if (endDateA && endDateB && startDateA <= endDateB && endDateA >= startDateB) { return true; }
    return false

  }

  clickGrid(dataselected: DocumentTemplatesDto) {
    if (dataselected) {
      if (this.documentTemplatebaseform.valid) {

        let  dateCheck = false;

        this.Response.map(x => this.Response.map(y => {

          const hasValue = this.Response.filter(z => z.name == x.name)

          if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
            if (x.validUntil != null && y.validUntil != null) {
              if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
                dateCheck = true;
              }
            }
            else {
              if (x.validUntil == null) {


                const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
                if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
                  dateCheck = true;
                }
              }
              else if (y.validUntil == null) {


                const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
                if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
                  dateCheck = true;
                }
              }
            }
          }
        })) ;

        this.Response.map(x => this.Response.map(y => {

          const hasValue = this.Response.filter(z => z.name == x.name)

          if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
            if (x.validUntil != null && y.validUntil != null) {
              if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
                dateCheck = true;
              }
            }
            else {
              if (x.validUntil == null) {


                const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
                if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
                  dateCheck = true;
                }
              }
              else if (y.validUntil == null) {


                const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
                if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
                  dateCheck = true;
                }
              }
            }
          }
        }))

        if (!dateCheck) {
          this.SettingFalse();
          this.index = this.Response.findIndex(item => {
            return item == dataselected
          })
          this.Response[this.index].isEntered = true;
          this.card = dataselected;
          this.editable = true;
          this.RemoveBusinessError(this.businessError);
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.NameTextBoxconfig.externalError = true;
        this.DocumentTemplateTypeDropdownConfig.externalError = true;
        this.DocGenTypeDropdownConfig.externalError = true;
        this.ValidFromDateconfig.externalError = true;
        this.OutputFormatDropdownConfig.externalError = true;
        this.DocGenDtoNameDropdownConfig.externalError = true;
        //if (this.isBusinessError()) {
        //  this.throwBusinessError(this.businessError);
        //}
      }
    }
  }

  addRow() {
    if ((this.documentTemplatebaseform.valid) ||
      this.Response.length == 0) {
      let dateCheck = false;

      this.Response.map(x => this.Response.map(y => {

        const hasValue = this.Response.filter(z => z.name == x.name)

        if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
          if (x.validUntil != null && y.validUntil != null) {
            if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
              dateCheck = true;
            }
          }
          else {
            if (x.validUntil == null) {


              const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
                dateCheck = true;
              }
            }
            else if (y.validUntil == null) {


              const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
                dateCheck = true;
              }
            }
          }
        }
      }));

      this.Response.map(x => this.Response.map(y => {

        const hasValue = this.Response.filter(z => z.name == x.name)

        if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
          if (x.validUntil != null && y.validUntil != null) {
            if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
              dateCheck = true;
            }
          }
          else {
            if (x.validUntil == null) {


              const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
                dateCheck = true;
              }
            }
            else if (y.validUntil == null) {


              const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
                dateCheck = true;
              }
            }
          }
        }
      }))
      if (!dateCheck) {
        const documentTemplatebaseObj = new DocumentTemplatesDto();
        this.SettingFalse();
        documentTemplatebaseObj.isEntered = true;
        documentTemplatebaseObj.state = DtoState.Created;
        documentTemplatebaseObj.pKey = 0;
        documentTemplatebaseObj.canValidate = false;
        documentTemplatebaseObj.rowVersion = 0;
        const newlist = this.Response;
        newlist.push({ ...documentTemplatebaseObj });
        this.Response = [...newlist];
        this.card = new DocumentTemplatesDto();
        this.card = this.Response[this.Response.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.NameTextBoxconfig.externalError = false;
        this.DocumentTemplateTypeDropdownConfig.externalError = false;
        this.DocGenTypeDropdownConfig.externalError = false;
        this.ValidFromDateconfig.externalError = false;
        this.OutputFormatDropdownConfig.externalError = false;
        this.DocGenDtoNameDropdownConfig.externalError = false;
        this.editable = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.NameTextBoxconfig.externalError = true;
      this.DocumentTemplateTypeDropdownConfig.externalError = true;
      this.DocGenTypeDropdownConfig.externalError = true;
      this.ValidFromDateconfig.externalError = true;
      this.OutputFormatDropdownConfig.externalError = true;
      this.DocGenDtoNameDropdownConfig.externalError = true;
      //if (this.isBusinessError()) {
      //  this.throwBusinessError(this.businessError)
      //}
    }
  }

  onRowDelete(event: DocumentTemplatesDto, array: DocumentTemplatesDto[]) {
    if (this.documentTemplatebaseform.valid || ((event.name == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })

      let dateCheck = false;

      this.Response.map(x => this.Response.map(y => {

        const hasValue = this.Response.filter(z => z.name == x.name)

        if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
          if (x.validUntil != null && y.validUntil != null) {
            if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
              dateCheck = true;
            }
          }
          else {
            if (x.validUntil == null) {


              const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
                dateCheck = true;
              }
            }
            else if (y.validUntil == null) {


              const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
                dateCheck = true;
              }
            }
          }
        }
      }));

      this.Response.map(x => this.Response.map(y => {

        const hasValue = this.Response.filter(z => z.name == x.name)

        if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
          if (x.validUntil != null && y.validUntil != null) {
            if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
              dateCheck = true;
            }
          }
          else {
            if (x.validUntil == null) {


              const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
                dateCheck = true;
              }
            }
            else if (y.validUntil == null) {


              const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
                dateCheck = true;
              }
            }
          }
        }
      }))

      if (!dateCheck || (dateCheck && event.isEntered)) {
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
        }
        if (this.Response.length > 0) {
          this.SettingFalse();
          this.card = this.Response[this.Response.length - 1]
          this.Response[this.Response.length - 1].isEntered = true;
          this.editable = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.NameTextBoxconfig.externalError = false;
        this.DocumentTemplateTypeDropdownConfig.externalError = false;
        this.DocGenTypeDropdownConfig.externalError = false;
        this.ValidFromDateconfig.externalError = false;
        this.OutputFormatDropdownConfig.externalError = false;
        this.DocGenDtoNameDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.NameTextBoxconfig.externalError = true;
      this.DocumentTemplateTypeDropdownConfig.externalError = true;
      this.DocGenTypeDropdownConfig.externalError = true;
      this.ValidFromDateconfig.externalError = true;
      this.OutputFormatDropdownConfig.externalError = true;
      this.DocGenDtoNameDropdownConfig.externalError = true;
    }
  }
  onNameChange(event: any) {
     this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }
    if (event != null && event != '') {
      this.Response[this.index].name = event;
      this.card.name = event;
     
    }
    else {
      this.Response[this.index].name = null as unknown as string;
      this.card.name = null as unknown as string;
      this.NameTextBoxconfig.externalError = true;
    }
  }
  onDocumentTemplateTypeChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].documentTemplateType = event?.value;
      this.card.documentTemplateType = event?.value;
    }
    else {
      this.Response[this.index].documentTemplateType = null as unknown as DocumentTemplateTypeDto;
      this.card.documentTemplateType = null as unknown as DocumentTemplateTypeDto; 
      this.DocumentTemplateTypeDropdownConfig.externalError = true;
    }
  }

  onDocGenTypeChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].docGenType = event?.value;
      this.card.docGenType = event?.value; 
    }
    else {
      this.Response[this.index].docGenType = null as unknown as DocGenTypeDto;
      this.card.docGenType = null as unknown as DocGenTypeDto;
      this.DocGenTypeDropdownConfig.externalError = true;
    }
  }
  onOutputFormatChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].outputFormat = event?.value;
      this.card.outputFormat = event?.value;
    }
    else {
      this.Response[this.index].outputFormat = null as unknown as OutputFormatDto;
      this.card.outputFormat = null as unknown as OutputFormatDto;
      this.OutputFormatDropdownConfig.externalError = true;
    }
  }
  onDocGenDtoNameChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].docGenDtoName = event?.value;
      this.card.docGenDtoName = event?.value;
     
    }
    else {
      this.Response[this.index].docGenDtoName = null as unknown as DocGenDtoNameDto;
      this.card.docGenDtoName = null as unknown as DocGenDtoNameDto;
      this.DocGenDtoNameDropdownConfig.externalError = true;
    }
  }
  onAdHocChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }
    if (event != null) {
      this.card.adHoc = event;
      this.Response[this.index].adHoc = event
      this.Response[this.index].modifiedadHoc = event.toString()
    }
  }
  onValidFromChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event != null) {
      this.Response[this.index].validFrom = event;
      this.Response[this.index].modifiedvalidFrom = this.datePipe.transform(event, 'dd/MM/yyyy');
      this.card.validFrom = event;
      this.Response[this.index].validFrom = new Date(
        this.Response[this.index].validFrom);
      this.Response[this.index].validFrom.setHours(0, 0, 0, 0)
    
    }
    else {
      this.Response[this.index].validFrom = null as unknown as Date;
      this.Response[this.index].modifiedvalidFrom = ''
      this.card.validFrom = null as unknown as Date;
      this.ValidFromDateconfig.externalError = true;
    }
  }
  onValidUntilChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event != null) {
      this.Response[this.index].validUntil = event;
      this.Response[this.index].modifiedvalidUntil = this.datePipe.transform(event, 'dd/MM/yyyy');
      this.card.validUntil = event;
      this.Response[this.index].validUntil = new Date(
      this.Response[this.index].validUntil);
      this.Response[this.index].validUntil.setHours(0, 0, 0, 0)
    }
    else {
      this.Response[this.index].validUntil = null as unknown as Date;
      this.Response[this.index].modifiedvalidUntil = ''
      this.card.validUntil = null as unknown as Date;
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
  onYes(GridData: DocumentTemplatesDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.NameTextBoxconfig.externalError = false;
    this.DocumentTemplateTypeDropdownConfig.externalError = false;
    this.DocGenTypeDropdownConfig.externalError = false;
    this.ValidFromDateconfig.externalError = false;
    this.OutputFormatDropdownConfig.externalError = false;
    this.DocGenDtoNameDropdownConfig.externalError = false;
    //navigate
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: DocumentTemplatesDto[]) {

    let dateCheck = false;

    GridData.map(x => GridData.map(y => {

      const hasValue = GridData.filter(z => z.name == x.name)

      if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
        if (x.validUntil != null && y.validUntil != null) {
          if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
            dateCheck = true;
          }
        }
        else {
          if (x.validUntil == null) {


            const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
            if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
              dateCheck = true;
            }
          }
          else if (y.validUntil == null) {


            const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
            if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
              dateCheck = true;
            }
          }
        }
      }
    }));

    GridData.map(x => this.Response.map(y => {

      const hasValue = GridData.filter(z => z.name == x.name)

      if (hasValue.length > 1 && (x.name == hasValue[0].name) && (y.name == hasValue[0].name)) {
        if (x.validUntil != null && y.validUntil != null) {
          if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, y.validUntil)) {
            dateCheck = true;
          }
        }
        else {
          if (x.validUntil == null) {


            const XvalidUntil = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
            if (x != y && this.isBusinessError(x.validFrom, XvalidUntil, y.validFrom, y.validUntil)) {
              dateCheck = true;
            }
          }
          else if (y.validUntil == null) {


            const YvalidUntil = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
            if (x != y && this.isBusinessError(x.validFrom, x.validUntil, y.validFrom, YvalidUntil)) {
              dateCheck = true;
            }
          }
        }
      }
    }))

    if (dateCheck) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.documentTemplatebaseform.valid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          if (x.validFrom != null) {
            x.validFrom = new Date(
              Date.UTC(x.validFrom.getFullYear(), x.validFrom.getMonth(), x.validFrom.getDate(), 0, 0, 0)
            );
          }
          if (x.validUntil != null) {
            x.validUntil = new Date(
              Date.UTC(x.validUntil.getFullYear(), x.validUntil.getMonth(), x.validUntil.getDate(), 0, 0, 0)
            );
          }
          this.deletedRecords.push({ ...x })          
        }        
      })

      this.deletedRecords.forEach(y => {
        if (y.state == DtoState.Deleted && y.name == null) {
          y.name = null as unknown as string;
        }
        if (y.state == DtoState.Deleted && y.documentTemplateType?.caption == null) {
          y.documentTemplateType = null as unknown as DocumentTemplateTypeDto;
        }
        if (y.state == DtoState.Deleted && y.adHoc == null) {
          y.adHoc = false
        }
        if (y.state == DtoState.Deleted && y.docGenType?.caption == null) {
          y.docGenType = null as unknown as DocGenTypeDto;
        }
        if (y.state == DtoState.Deleted && y.outputFormat?.caption == null) {
          y.outputFormat = null as unknown as OutputFormatDto;
        }
        if (y.state == DtoState.Deleted && y.docGenDtoName?.caption == null) {
          y.docGenDtoName = null as unknown as DocGenDtoNameDto;
        }
        if (y.state == DtoState.Deleted && y.validFrom == null) {
          y.validFrom = null as unknown as Date;
        }
        if (y.state == DtoState.Deleted && y.validUntil == null) {
          y.validUntil = null as unknown as Date;
        }
      })
      
      this.spinnerService.setIsLoading(true);
      this.documentTemplateBaseService.saveDocumentTemplateBaseScreenData(this.deletedRecords).subscribe(res => {
        
        this.spinnerService.setIsLoading(false);
        this.editable = true;
        this.show = false;
        this.deletedRecords = [...new Array<DocumentTemplatesDto>()];
        
        this.documentTemplateBaseService.getDocumentTemplateBaseScreenData().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as DocumentTemplatesDto[]
          this.Response = [...getResponse];
          
          this.NameTextBoxconfig.externalError = false;
          this.DocumentTemplateTypeDropdownConfig.externalError = false;
          this.DocGenTypeDropdownConfig.externalError = false;
          this.ValidFromDateconfig.externalError = false;
          this.OutputFormatDropdownConfig.externalError = false;
          this.DocGenDtoNameDropdownConfig.externalError = false;
          this.RemoveBusinessError(this.businessError);
          if (this.Response.length > 0) {
            this.Response.forEach(x => {
              x.modifiedadHoc = x.adHoc.toString();
              if (x.validFrom != null) {
                x.validFrom = new Date(x.validFrom);
                x.modifiedvalidFrom = this.datePipe.transform(x.validFrom, 'dd/MM/yyyy')
              }
              if (x.validUntil != null) {
                x.validUntil = new Date(x.validUntil);
                x.modifiedvalidUntil = this.datePipe.transform(x.validUntil, 'dd/MM/yyyy')
              }
            })
            this.SettingFalse();
            
            this.index = this.Response.findIndex(i => {
              return (                
                (i.name == this.card.name)
              )
            })
            this.Response[this.index].isEntered = true;
            this.card = this.Response[this.index]
          }
        },
          err => {
            this.spinnerService.setIsLoading(false);
            this.deletedRecords = [...new Array<DocumentTemplatesDto>()];
            this.exceptionBox = true;
          })
      },
        err => {
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<DocumentTemplatesDto>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.NameTextBoxconfig.externalError = true;
      this.DocumentTemplateTypeDropdownConfig.externalError = true;
      this.DocGenTypeDropdownConfig.externalError = true;
      this.ValidFromDateconfig.externalError = true;
      this.OutputFormatDropdownConfig.externalError = true;
      this.DocGenDtoNameDropdownConfig.externalError = true;
    }
  }

  ngOnInit(): void {
    this.buildConfiguration();
    
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.documentTemplateBaseData
        this.Response = [...getResponse];
        this.deletedRecords = [...new Array<DocumentTemplatesDto>()];
        this.index = 0;
        if (this.Response.length > 0) {
          this.Response.forEach(x => {
            if (x.validFrom != null) {              
              x.validFrom = new Date(x.validFrom);
              x.modifiedvalidFrom = this.datePipe.transform(x.validFrom, 'dd/MM/yyyy')
            }
            if (x.validUntil != null) {
              x.validUntil = new Date(x.validUntil);
              x.modifiedvalidUntil = this.datePipe.transform(x.validUntil, 'dd/MM/yyyy')
            }
            x.modifiedadHoc = x.adHoc.toString();                     
          })
          this.Nothide = true;
          this.SettingFalse();
          this.Response[this.index].isEntered = true;
          this.card = this.Response[this.index];
        }
      }
    },
      err => {
        this.deletedRecords = [...new Array<DocumentTemplatesDto>()];
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.docGenTypeResponse = res.docGenTypeList

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

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.outputFormatResponse = res.outputFormatList

      }
    },
      err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.docGenDtoNameResponse = res.docGenDtoNameList

      }
    },
      err => {
        this.spinnerService.setIsLoading(false)
        this.exceptionBox = true;
      })
  }


  buildConfiguration() {
    const nameRequired = new ErrorDto;
    nameRequired.validation = "required";
    nameRequired.isModelError = true;
    nameRequired.validationMessage = this.translate.instant('communication.document-templatebase.mandatory.Name') + this.translate.instant('communication.document-templatebase.mandatory.required');
    this.NameTextBoxconfig.Errors = [nameRequired];
    this.NameTextBoxconfig.required = true

    const documentTemplateTypeRequired = new ErrorDto;
    documentTemplateTypeRequired.validation = "required";
    documentTemplateTypeRequired.isModelError = true;
    documentTemplateTypeRequired.validationMessage = this.translate.instant('communication.document-templatebase.mandatory.DocumentTemplateType') + this.translate.instant('communication.document-templatebase.mandatory.required');
    this.DocumentTemplateTypeDropdownConfig.Errors = [documentTemplateTypeRequired];
    this.DocumentTemplateTypeDropdownConfig.required = true

    const docGenTypeRequired = new ErrorDto;
    docGenTypeRequired.validation = "required";
    docGenTypeRequired.isModelError = true;
    docGenTypeRequired.validationMessage = this.translate.instant('communication.document-templatebase.mandatory.DocGenType') + this.translate.instant('communication.document-templatebase.mandatory.required');
    this.DocGenTypeDropdownConfig.Errors = [docGenTypeRequired];
    this.DocGenTypeDropdownConfig.required = true

    const validFromRequired = new ErrorDto;
    validFromRequired.validation = "required";
    validFromRequired.isModelError = true;
    validFromRequired.validationMessage = this.translate.instant('communication.document-templatebase.mandatory.ValidFrom') + this.translate.instant('communication.document-templatebase.mandatory.required');
    this.ValidFromDateconfig.Errors = [validFromRequired];
    this.ValidFromDateconfig.required = true

    const outputFormatRequired = new ErrorDto;
    outputFormatRequired.validation = "required";
    outputFormatRequired.isModelError = true;
    outputFormatRequired.validationMessage = this.translate.instant('communication.document-templatebase.mandatory.OutputFormat') + this.translate.instant('communication.document-templatebase.mandatory.required');
    this.OutputFormatDropdownConfig.Errors = [outputFormatRequired];
    this.OutputFormatDropdownConfig.required = true

    const docGenDtoNameRequired = new ErrorDto;
    docGenDtoNameRequired.validation = "required";
    docGenDtoNameRequired.isModelError = true;
    docGenDtoNameRequired.validationMessage = this.translate.instant('communication.document-templatebase.mandatory.DocGenDtoName') + this.translate.instant('communication.document-templatebase.mandatory.required');
    this.DocGenDtoNameDropdownConfig.Errors = [docGenDtoNameRequired];
    this.DocGenDtoNameDropdownConfig.required = true
  }
}
