import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlsBaseService, FluidDropDownConfig, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { TxTypeConfigDto } from './Models/txtypeconfigDto.model';
import { TxTypeDto } from './Models/txtypeDto.model';
import { TxTypeService } from './Services/txtype-config.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
@Component({
  selector: 'mactc-txtype-config',
  templateUrl: './txtype-config.component.html',
  styleUrls: ['./txtype-config.component.scss']
})
export class TxtypeConfigComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

  placeholder = 'select';
  accountingTxtHeader = [
    { header: this.translate.instant('accounting.txtype.tabel.TxType'), field: 'txType.caption', width: '60%' },
    { header: this.translate.instant('accounting.txtype.tabel.isAccountingtx'), field: 'modifiedisAccountingTx', width: '33%' },
    { header: this.translate.instant('accounting.txtype.tabel.delete'), field: 'delete', width: '8%', fieldType: 'deleteButton'  }];
  
  deletedRecords: TxTypeConfigDto[] = [];
  Response: TxTypeConfigDto[] = [];
  txtypeNameResponse: TxTypeDto[] = [];
  card!: TxTypeConfigDto
  index!: any
  Nothide!: boolean
  Header = this.translate.instant('accounting.Validation.Header')
  businessError = this.translate.instant('accounting.txtype.ValidationError.buisnessError');
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  editable!: boolean;
  txTypeDup: TxTypeConfigDto[] = []
  errorCode!:string
  constructor(public fluidService: FluidControlsBaseService,
    public translate: TranslateService, public txTypeService: TxTypeService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService)
  {
    this.editable = true;
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }
  buildConfiguration() {
    const txTypeRequired = new ErrorDto;
    txTypeRequired.validation = "required";
    txTypeRequired.isModelError = true;
    txTypeRequired.validationMessage =
      this.translate.instant('accounting.txtype.ValidationError.card') +
      this.translate.instant('accounting.txtype.ValidationError.required');
    this.DropdownConfig.Errors = [txTypeRequired];
    this.DropdownConfig.required = true
  }
  SettingFalse() {
    if (this.Response.length > 0) {
      this.Response.forEach(x => {
        x.isEntered = false;
      })
    }
  }
  isBusinessError(): boolean {
    this.txTypeDup = this.Response.reduce((array: TxTypeConfigDto[], current) => {
      if ((
        !array.some(
          (item: TxTypeConfigDto) => item.txType?.caption == current.txType?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.txTypeDup.length != this.Response.length) {
      return true;
    }
    else {
      this.txTypeDup = [];
      return false;
    }
  }

  clickGrid(dataselected: TxTypeConfigDto) {
    if (dataselected) {
      if (!this.userDetailsform.invalid) {
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
        this.DropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {    
    if ((!this.userDetailsform.invalid) ||
      this.Response.length == 0) {
      if (!this.isBusinessError()) {
        const txTypeObj = new TxTypeConfigDto();
        this.SettingFalse();
        txTypeObj.isEntered = true;
        txTypeObj.state = DtoState.Created;
        txTypeObj.pKey = 0;
        txTypeObj.canValidate = false;
        txTypeObj.rowVersion = 0;
        const newlist = this.Response;
        newlist.push({ ...txTypeObj });
        this.Response = [...newlist];
        this.card = new TxTypeConfigDto();
        this.card = this.Response[this.Response.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.DropdownConfig.externalError = false;
        this.editable = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.DropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: TxTypeConfigDto, array: TxTypeConfigDto[]) {
    if (!this.userDetailsform.invalid || ((event.txType?.caption == null) &&
      event.isEntered)) {
      if (!this.isBusinessError() || (this.isBusinessError() && event.isEntered)) {
        const deletedata = array.findIndex(data => {
          return data == event;
        })
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
        this.DropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.DropdownConfig.externalError = true;
    }
  }

  changeTxType(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].txType = event?.value;
      this.card.txType = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
    }
    else {
      this.Response[this.index].txType = null as unknown as TxTypeDto;
      this.card.txType = null as unknown as TxTypeDto;
      this.DropdownConfig.externalError = true;
    }
  }
  changeIsAccountingTx(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }
    if (event != null) {
      this.card.isAccountingTx = event;
      this.Response[this.index].isAccountingTx = event
      this.Response[this.index].modifiedisAccountingTx = event.toString()
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
  onYes(GridData: TxTypeConfigDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.DropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: TxTypeConfigDto[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }
    else if (!this.userDetailsform.invalid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(y => {
        if (y.state == DtoState.Deleted && y.txType?.caption == null) {
          y.txType = null as unknown as TxTypeDto;
        }
        if (y.state == DtoState.Created && y.isAccountingTx == null) {
          y.isAccountingTx = false
        }
      })


      this.spinnerService.setIsLoading(true);
      this.txTypeService.saveTxTypeScreenData(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {
          this.editable = true;
          this.show = false;
          this.deletedRecords = [...new Array<TxTypeConfigDto>()];

          this.txTypeService.getTxTypeScreenData().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as TxTypeConfigDto[]
            this.Response = [...getResponse];

            this.DropdownConfig.externalError = false;

            if (this.Response.length > 0) {
              this.Response.forEach(x => {
                x.modifiedisAccountingTx = x.isAccountingTx.toString();
              })
              this.SettingFalse();
              this.index = this.Response.findIndex(i => {
                return ((i.txType?.caption == this.card.txType?.caption))
              })
              this.Response[this.index].isEntered = true;
              this.card = this.Response[this.index]
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
              this.deletedRecords = [...new Array<TxTypeConfigDto>()];
              this.exceptionBox = true;
            })
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
          this.deletedRecords = [...new Array<TxTypeConfigDto>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.DropdownConfig.externalError = true;
    }
  }


  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.txTypeData
        this.Response = [...getResponse];
        this.deletedRecords = [...new Array<TxTypeConfigDto>()];
        this.index = 0;
        if (this.Response.length > 0) {
          this.Response.forEach(x => {
            x.modifiedisAccountingTx = x.isAccountingTx.toString();
          })
          this.Nothide = true;
          this.SettingFalse();
          this.Response[this.index].isEntered = true;
          this.card = this.Response[this.index];          
        }
      }
    }
    )
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.txtypeNameResponse = res.txTypeList
      }
    })
  }
}
