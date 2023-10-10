import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlTextBoxConfig, FluidControlsBaseService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { DivergentEffectiveRateSheetDto } from './Models/divergenteffectiveratesheetDto.model';
import { DivergentEffectiveRateService } from './Services/divergent-effective-ratesheet.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';

@Component({
  selector: 'mactc-divergent-effective-ratesheet',
  templateUrl: './divergent-effective-ratesheet.component.html',
  styleUrls: ['./divergent-effective-ratesheet.component.scss']
})
export class DivergentEffectiveRatesheetComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredEffectiveRate: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredNrofYears: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  placeholder = 'Select';
  Response: DivergentEffectiveRateSheetDto[] = []
  deletedRecords: DivergentEffectiveRateSheetDto[] = []
  divergentDup: DivergentEffectiveRateSheetDto[] = []
  index: any
  card!: DivergentEffectiveRateSheetDto
  businessError !: string;
  Header = this.translate.instant('accounting.Validation.Header')
  Nothide!: boolean
  exceptionBox!: boolean
  show!: boolean
  isErrors!: boolean
  navigateUrl!: string
  intMaxValue = 2147483647;
  numberErrorDto: ErrorDto[] = [];
  errorCode!:string
  DivergentHeader = [
    { header: this.translate.instant('accounting.Divergent.tabel.EffectiveRate'), field: 'modifiedEffectiveRate', width: '50%', amountSort: 'effectiveRate'},
  { header: this.translate.instant('accounting.Divergent.tabel.nrofyears'), field: 'nrOfYears', width: '43%' },
  {
    header: this.translate.instant('accounting.Divergent.tabel.delete'), field: 'delete',
    fieldType: 'deleteButton',
    width: '8%'
    }];

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public divergentService: DivergentEffectiveRateService,
    public commonService: ConfigContextService,
    public fluidValidation: fluidValidationService,
    public decimalpipe: DecimalTransformPipe
  ) {

    this.businessError = this.translate.instant('accounting.Divergent.ValidationError.buisnessError');
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;    
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.divergentEffectiveRateData
        this.Response = [...getResponse];
        this.deletedRecords = [...new Array<DivergentEffectiveRateSheetDto>()];
        this.index = 0;
        this.Response.forEach(x => {
          x.modifiedEffectiveRate = parseFloat(x.effectiveRate as unknown as string).toFixed(2)
          x.modifiedEffectiveRate = this.decimalpipe.transform(x.modifiedEffectiveRate) as string
        })
        if (this.Response.length > 0) {
          this.Nothide = true;
          this.SettingFalse();
          this.Response[this.index].isEntered = true;
          this.card = this.Response[this.index];
        }
      }
    }
    )
  }
  buildConfiguration() {

    const errorRateRequired = new ErrorDto();
    errorRateRequired.validation = 'required';
    errorRateRequired.isModelError = true;
    errorRateRequired.validationMessage =
      this.translate.instant('accounting.Divergent.ValidationError.errorRate') +
      this.translate.instant('accounting.Divergent.ValidationError.required');
    this.RequiredEffectiveRate.invalidDefaultValidation =
      this.translate.instant('accounting.Divergent.ValidationError.errorRate') +
    this.translate.instant('accounting.Divergent.ValidationError.required');
    this.RequiredEffectiveRate.Errors = [errorRateRequired];
    this.RequiredEffectiveRate.required = true;

    const maxValValidation = new ErrorDto();
    maxValValidation.validation = 'maxError';
    maxValValidation.isModelError = true;
    maxValValidation.validationMessage = this.translate.instant('accounting.Divergent.ValidationError.numberInt32Check');
    this.numberErrorDto = [maxValValidation];

    const nrOfYearsError = new ErrorDto();
    nrOfYearsError.validation = 'required';
    nrOfYearsError.isModelError = true;
    nrOfYearsError.validationMessage =
      this.translate.instant('accounting.Divergent.ValidationError.nrofYears') +
      this.translate.instant('accounting.Divergent.ValidationError.required');
    this.RequiredNrofYears.required = true;
    this.RequiredNrofYears.Errors = [nrOfYearsError];
    this.RequiredNrofYears.maxValueValidation = this.translate.instant('accounting.Divergent.ValidationError.InputIncorrect');
  }
  SettingFalse() {
    if (this.Response.length > 0) {
      this.Response.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  isBusinessError(): boolean {    
    this.divergentDup = this.Response.reduce((array: DivergentEffectiveRateSheetDto[], current) => {
      if ((
        !array.some(
          (item: DivergentEffectiveRateSheetDto) => item.modifiedEffectiveRate == current.modifiedEffectiveRate
        ))
      ) {
        array.push(current);
      }      
      return array;
    }, []);

    if (this.divergentDup.length != this.Response.length) {
      return true;
    }
    else {
      this.divergentDup = [];      
      return false;
    }
  }

  clickGrid(dataselected: DivergentEffectiveRateSheetDto) {
    if (dataselected) {
      if (this.userDetailsform.valid) {
        if (!this.isBusinessError()) {
          this.SettingFalse();
          this.index = this.Response.findIndex(item => {
            return item == dataselected
          })
          this.Response[this.index].isEntered = true;
          this.card = dataselected;

        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.RequiredNrofYears.externalError = true;
        this.RequiredEffectiveRate.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {       
    if ((this.userDetailsform.valid) ||
      this.Response.length == 0) {
      if (!this.isBusinessError()) {
        const divergentObj = new DivergentEffectiveRateSheetDto();
       this.SettingFalse();        
        divergentObj.isEntered = true;
        divergentObj.state = DtoState.Created;
        divergentObj.pKey = 0;
        divergentObj.canValidate = false;
        divergentObj.rowVersion = 0;
        const newlist = this.Response;
        newlist.push({ ...divergentObj });
        this.Response = [...newlist];
        this.card = new DivergentEffectiveRateSheetDto();
       this.card = this.Response[this.Response.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)        
        this.RequiredEffectiveRate.externalError = false;
        this.RequiredNrofYears.externalError = false;

      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.RequiredNrofYears.externalError = true;
      this.RequiredEffectiveRate.externalError = true;

      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: DivergentEffectiveRateSheetDto, array: DivergentEffectiveRateSheetDto[]) {
    if (this.userDetailsform.valid || ((event.effectiveRate == null || event.nrOfYears == null) &&
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

        }
        this.RemoveBusinessError(this.businessError);
        this.RequiredNrofYears.externalError = false;
        this.RequiredEffectiveRate.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError);
      }
    }
    else {
      this.RequiredNrofYears.externalError = true;
      this.RequiredEffectiveRate.externalError = true;
    }
  }

  onEffectiveRateChange(event: any, ischanged: boolean) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }
    if (event != null && event != '0,00') {
      if (!ischanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);
        this.Response[this.index].effectiveRate = parseFloat(floatValue);
        this.Response[this.index].modifiedEffectiveRate = event;
        this.card.effectiveRate = parseFloat(floatValue);

        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError)
        }
        else {
          this.RemoveBusinessError(this.businessError)
        }
      }
    }
    else {
      this.Response[this.index].effectiveRate = null as unknown as number;
      this.card.effectiveRate = null as unknown as number;
      this.RequiredEffectiveRate.externalError = true;
    }    
  }

  onNrofYearsChange(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }
    if (event != null) {
      this.Response[this.index].nrOfYears = event;
      this.card.nrOfYears = event;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
    }
    else {
      this.Response[this.index].nrOfYears = null as unknown as number;
      this.card.nrOfYears = null as unknown as number;
      this.RequiredNrofYears.externalError = true;
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
  onYes(GridData: DivergentEffectiveRateSheetDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.RequiredNrofYears.externalError = false;
    this.RequiredEffectiveRate.externalError = false;
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }
  onSave(GridData: DivergentEffectiveRateSheetDto[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {      
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(y => {        
        if (y.state == DtoState.Deleted && y.effectiveRate == null) {
          y.effectiveRate = null as unknown as number;
        }
        if (y.state == DtoState.Deleted && y.nrOfYears == null) {
          y.nrOfYears = null as unknown as number;
        }
      })

      this.spinnerService.setIsLoading(true);
      this.divergentService.saveDivergentEffectiveRateScreenData(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {
          this.show = false;
          this.deletedRecords = [...new Array<DivergentEffectiveRateSheetDto>()];

          this.divergentService.getDivergentEffectiveRateScreenData().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as DivergentEffectiveRateSheetDto[]
            this.Response = [...getResponse];
            this.RequiredNrofYears.externalError = false;
            this.RequiredEffectiveRate.externalError = false
            this.Response.forEach(x => {
              x.modifiedEffectiveRate = parseFloat(x.effectiveRate as unknown as string).toFixed(2)
              x.modifiedEffectiveRate = this.decimalpipe.transform(x.modifiedEffectiveRate) as string
            })
            if (this.Response.length > 0) {

              this.SettingFalse();
              this.index = this.Response.findIndex(i => {
                return ((i.effectiveRate == this.card.effectiveRate) && (i.nrOfYears == this.card.nrOfYears))
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
              this.deletedRecords = [...new Array<DivergentEffectiveRateSheetDto>()];
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
          this.deletedRecords = [...new Array<DivergentEffectiveRateSheetDto>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.RequiredNrofYears.externalError = true;
      this.RequiredEffectiveRate.externalError = true
    }
  }
}
