import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DecimalTransformPipe, ErrorDto, FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { MarketRateForSubstantialModificationService } from './Service/market-rate-for-substantial-modification.service';
import { marketRateForSubstantialModification } from './Models/marketRateForSubstantialModification.model';
import { DatePipe } from '@angular/common';
import { stateModel } from './Models/state.model';

@Component({
  selector: 'mactc-marketrate-for-substantial-modification',
  templateUrl: './marketrate-for-substantial-modification.component.html',
  styleUrls: ['./marketrate-for-substantial-modification.component.scss']
})
export class MarketrateForSubstantialModificationComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public YearsTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MarketRateTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ValidFromDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public ValidToDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;


  responseMarketRate: marketRateForSubstantialModification[] = [];
  deletedRecords: marketRateForSubstantialModification[] = [];
  numberErrorDto: ErrorDto[] = []
  MarketRateCard!: marketRateForSubstantialModification
  Nothide!: boolean
  maxValue = 2147483647;
  Header = this.translate.instant('accounting.Validation.Header');
  businessError = this.translate.instant('accounting.market-rate.mandatory.businessError');
  index: any
  modificationHeader: any
  show!: boolean;
  isErrors!: boolean;
  exceptionBox!: boolean
  errorCode!: string
  navigateUrl!: string



  constructor(public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public marketRateService: MarketRateForSubstantialModificationService,
    public fluidValidation: fluidValidationService,
    public datePipe: DatePipe, public decimalpipe: DecimalTransformPipe) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  SettingFalse() {
    if (this.responseMarketRate.length > 0) {
      this.responseMarketRate.forEach(x => {
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

  changeValidFrom(event: any) {

    this.index = this.responseMarketRate.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.responseMarketRate[this.index].state == stateModel.Unknown) {
      this.responseMarketRate[this.index].state = stateModel.Dirty;
    }
    if (event != null) {

      this.MarketRateCard.validFrom = event;
      this.responseMarketRate[this.index].validFrom = event;
      this.responseMarketRate[this.index].modifiedValidFrom = this.datePipe.transform(event, 'dd/MM/yyyy')

      this.responseMarketRate[this.index].validFrom = new Date(
        this.responseMarketRate[this.index].validFrom);
      this.responseMarketRate[this.index].validFrom.setHours(0,0,0,0)

    }
    else {
      this.MarketRateCard.validFrom = null as unknown as Date
      this.responseMarketRate[this.index].validFrom = null as unknown as Date;
      this.responseMarketRate[this.index].modifiedValidFrom = ''
      this.ValidFromDateconfig.externalError = true;
    }
  }

  changeValidTo(event: any) {

    this.index = this.responseMarketRate.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.responseMarketRate[this.index].state == stateModel.Unknown) {
      this.responseMarketRate[this.index].state = stateModel.Dirty;
    }
    if (event != null) {

      this.MarketRateCard.validTo = event;
      this.responseMarketRate[this.index].validTo = event;
      this.responseMarketRate[this.index].modifiedValidTo = this.datePipe.transform(event, 'dd/MM/yyyy')
      
      this.responseMarketRate[this.index].validTo = new Date(
        this.responseMarketRate[this.index].validTo);
      this.responseMarketRate[this.index].validTo.setHours(0, 0, 0, 0)

    }
    else {
      this.MarketRateCard.validTo = null as unknown as Date
      this.responseMarketRate[this.index].validTo = null as unknown as Date;
      this.responseMarketRate[this.index].modifiedValidTo = ''
    }
  }

  changeMarketRate(event: any, isChanged: boolean) {

    this.index = this.responseMarketRate.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.responseMarketRate[this.index].state == stateModel.Unknown) {
      this.responseMarketRate[this.index].state = stateModel.Dirty;
    }
    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.responseMarketRate[this.index].marketRate = parseFloat(floatValue)
        this.responseMarketRate[this.index].modifiedMarketRate = event;
        this.MarketRateCard.marketRate = parseFloat(floatValue);

      }

    }
    else {

      this.MarketRateCard.marketRate = event;
      if (event == '0,00') {
        this.MarketRateTextBoxconfig.externalError = true;
      }
      else {
        setTimeout(() => {
          this.MarketRateCard.marketRate = null as unknown as number;
          this.responseMarketRate[this.index].modifiedMarketRate = '';
          this.MarketRateTextBoxconfig.externalError = true

        }, 3)
      }
    
    }
  }

  changeNoOfYrs(event: any) {
    this.index = this.responseMarketRate.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.responseMarketRate[this.index].state == stateModel.Unknown) {
      this.responseMarketRate[this.index].state = stateModel.Dirty;
    }
    if (event != null && event <= this.maxValue && event != '0') {
      this.responseMarketRate[this.index].nrOfYears = parseInt(event);
      this.MarketRateCard.nrOfYears = parseInt(event);
    }
    else {
     
        this.MarketRateCard.nrOfYears = event;
        setTimeout(() => {
          this.responseMarketRate[this.index].nrOfYears = null as unknown as number;
          this.MarketRateCard.nrOfYears = null as unknown as number;
          this.YearsTextBoxconfig.externalError = true;
        }, 4)
     

    }
  }

  clickGrid(dataselected: marketRateForSubstantialModification) {
    if (dataselected) {
      if (this.userDetailsform.valid) {

        let dateCheck = false;

        this.responseMarketRate.map(x => this.responseMarketRate.map(y => {

          const hasValue = this.responseMarketRate.filter(z => z.nrOfYears == x.nrOfYears)

          if (hasValue.length > 1 && (x.nrOfYears == hasValue[0].nrOfYears) && (y.nrOfYears == hasValue[0].nrOfYears)) {
            if (x.validTo != null && y.validTo != null) {
              if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, y.validTo)) {
                dateCheck = true;
              }
            }
            else {
              if (x.validTo == null) {

                 
                const XValidTo = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10 )
                if (x != y && this.isBusinessError(x.validFrom, XValidTo, y.validFrom, y.validTo)) {
                  dateCheck = true;
                }
              }
              else if (y.validTo == null) {

                
                const YValidTo = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
                if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, YValidTo)) {
                  dateCheck = true;
                }
              }
            }
          }
        }))

        if (!dateCheck) {
        this.SettingFalse();
        this.index = this.responseMarketRate.findIndex(item => {
          return item == dataselected
        })
        this.responseMarketRate[this.index].isEntered = true;
          this.MarketRateCard = dataselected;
          this.RemoveBusinessError(this.businessError);
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.YearsTextBoxconfig.externalError = true;
        this.ValidFromDateconfig.externalError = true;
        this.MarketRateTextBoxconfig.externalError = true;

      }
    }
  }

  addRow() {
    if ((this.userDetailsform.valid) ||
      this.responseMarketRate.length == 0) {

      let dateCheck = false;

      this.responseMarketRate.map(x => this.responseMarketRate.map(y => {
        const hasValue = this.responseMarketRate.filter(z => z.nrOfYears == x.nrOfYears)

        if (hasValue.length > 1 && (x.nrOfYears == hasValue[0].nrOfYears) && (y.nrOfYears == hasValue[0].nrOfYears)) {
          if (x.validTo != null && y.validTo != null) {
            if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, y.validTo)) {
              dateCheck = true;
            }
          }
          else {
            if (x.validTo == null) {

              
              const XValidTo = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, XValidTo, y.validFrom, y.validTo)) {
                dateCheck = true;
              }
            }
            else if (y.validTo == null) {

              
              const YValidTo = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, YValidTo)) {
                dateCheck = true;
              }
            }
          }
        }

      }))
      if (!dateCheck) {
      const marketRateObj = new marketRateForSubstantialModification();
      this.SettingFalse();
      marketRateObj.isEntered = true;
      marketRateObj.state = stateModel.Created;
      marketRateObj.pKey = 0;
      marketRateObj.canValidate = false;
      marketRateObj.rowVersion = 0;
      const newlist = this.responseMarketRate;
      newlist.push({ ...marketRateObj });
      this.responseMarketRate = [...newlist];
      this.MarketRateCard = new marketRateForSubstantialModification();
      this.MarketRateCard = this.responseMarketRate[this.responseMarketRate.length - 1]
      this.Nothide = true;

      this.RemoveBusinessError(this.businessError)
      this.YearsTextBoxconfig.externalError = false;
      this.ValidFromDateconfig.externalError = false;
      this.MarketRateTextBoxconfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.YearsTextBoxconfig.externalError = true;
      this.ValidFromDateconfig.externalError = true;
      this.MarketRateTextBoxconfig.externalError = true;
    }
  }

  onRowDelete(event: marketRateForSubstantialModification, array: marketRateForSubstantialModification[]) {
    if (this.userDetailsform.valid || ((event.validTo == null || event.validFrom == null ||
      event.marketRate == null || event.nrOfYears == null) && event.isEntered)) {

      let dateCheck = false;

      array.map(x => array.map(y => {

        const hasValue = this.responseMarketRate.filter(z => z.nrOfYears == x.nrOfYears)

        if (hasValue.length > 1 && (x.nrOfYears == hasValue[0].nrOfYears) && (y.nrOfYears == hasValue[0].nrOfYears)) {
          if (x.validTo != null && y.validTo != null) {
            if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, y.validTo)) {
              dateCheck = true;
            }
          }
          else {
            if (x.validTo == null) {

              
              const XValidTo = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, XValidTo, y.validFrom, y.validTo)) {
                dateCheck = true;
              }
            }
            else if (y.validTo == null) {

             
              const YValidTo = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
              if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, YValidTo)) {
                dateCheck = true;
              }
            }
          }
        }

      }))

      if (!dateCheck || (dateCheck && event.isEntered)) {
        const deletedata = array.findIndex(data => {
          return data == event;
        })
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.responseMarketRate = [...array];
        if (this.responseMarketRate.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
        }
        if (this.responseMarketRate.length > 0) {
          this.SettingFalse();
          this.MarketRateCard = this.responseMarketRate[this.responseMarketRate.length - 1]
          this.responseMarketRate[this.responseMarketRate.length - 1].isEntered = true;

        }
        this.RemoveBusinessError(this.businessError);
        this.YearsTextBoxconfig.externalError = false;
        this.ValidFromDateconfig.externalError = false;
        this.MarketRateTextBoxconfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.YearsTextBoxconfig.externalError = true;
      this.ValidFromDateconfig.externalError = true;
      this.MarketRateTextBoxconfig.externalError = true;
    }
  }

  onclose() {
    const unsaved = this.responseMarketRate.findIndex(x => {
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
  onYes(GridData: marketRateForSubstantialModification[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.YearsTextBoxconfig.externalError = false;
    this.ValidFromDateconfig.externalError = false;
    this.MarketRateTextBoxconfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
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

  onSave(GridData: marketRateForSubstantialModification[]) {
    let dateCheck = false;

    GridData.map(x => GridData.map(y => {
      const hasValue = this.responseMarketRate.filter(z => z.nrOfYears == x.nrOfYears)

      if (hasValue.length > 1 && (x.nrOfYears == hasValue[0].nrOfYears) && (y.nrOfYears == hasValue[0].nrOfYears)) {
        if (x.validTo != null && y.validTo != null) {
          if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, y.validTo)) {
            dateCheck = true;
          }
        }
        else {
          if (x.validTo == null) {

            const XValidTo = new Date(x.validFrom.getFullYear() + 10, x.validFrom.getMonth() + 10, x.validFrom.getDate() + 10)
            if (x != y && this.isBusinessError(x.validFrom, XValidTo, y.validFrom, y.validTo)) {
              dateCheck = true;
            }
          }
          else if (y.validTo == null) {

            
            const YValidTo = new Date(y.validFrom.getFullYear() + 10, y.validFrom.getMonth() + 10, y.validFrom.getDate() + 10)
            if (x != y && this.isBusinessError(x.validFrom, x.validTo, y.validFrom, YValidTo)) {
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
    else if (this.userDetailsform.valid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      if (this.deletedRecords.length > 0) {
        this.deletedRecords.forEach(x => {
          if (x.validFrom != null) {
            x.validFrom = new Date(
              Date.UTC(x.validFrom.getFullYear(), x.validFrom.getMonth(), x.validFrom.getDate(), 0, 0, 0)
            );
          }


          if (x.validTo != null) {
            x.validTo = new Date(
              Date.UTC(x.validTo.getFullYear(), x.validTo.getMonth(), x.validTo.getDate(), 0, 0, 0)
            );
          }
        })
      }


      this.spinnerService.setIsLoading(true);
      this.marketRateService.saveMarketRate(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.show = false;
        this.deletedRecords = [...new Array<marketRateForSubstantialModification>()];

        this.marketRateService.getMarketRate().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as marketRateForSubstantialModification[]
          this.responseMarketRate = [...getResponse];

          this.RemoveBusinessError(this.businessError)
          this.YearsTextBoxconfig.externalError = false;
          this.ValidFromDateconfig.externalError = false;
          this.MarketRateTextBoxconfig.externalError = false;

          if (this.responseMarketRate.length > 0) {

            this.Nothide = true;
            this.responseMarketRate.forEach(x => {
              x.validFrom = new Date(x.validFrom)
              x.modifiedValidFrom = this.datePipe.transform(x.validFrom, 'dd/MM/yyyy')

              if (x.validTo != null) {
                x.validTo = new Date(x.validTo)
                x.modifiedValidTo = this.datePipe.transform(x.validTo, 'dd/MM/yyyy')
              }
             

              x.modifiedMarketRate = parseFloat(x.marketRate as unknown as string).toFixed(2)
              x.modifiedMarketRate = this.decimalpipe.transform(x.modifiedMarketRate) as string
            })

            this.SettingFalse();
            this.index = this.responseMarketRate.findIndex(i => {
              return (((i.validFrom.getDate() == this.MarketRateCard.validFrom.getDate()) && (i.validFrom.getMonth() == this.MarketRateCard.validFrom.getMonth()) && (i.validFrom.getFullYear() == this.MarketRateCard.validFrom.getFullYear())) &&
                ((i.validTo.getDate() == this.MarketRateCard.validTo.getDate()) && (i.validTo.getMonth() == this.MarketRateCard.validTo.getMonth()) && (i.validTo.getFullYear() == this.MarketRateCard.validTo.getFullYear())) &&
                (i.marketRate == this.MarketRateCard.marketRate) &&
                (i.nrOfYears == this.MarketRateCard.nrOfYears))
            })
            this.responseMarketRate[this.index].isEntered = true;
            this.MarketRateCard = this.responseMarketRate[this.index]
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
            this.deletedRecords = [...new Array<marketRateForSubstantialModification>()];
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
          this.deletedRecords = [...new Array<marketRateForSubstantialModification>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.YearsTextBoxconfig.externalError = true;
      this.ValidFromDateconfig.externalError = true;
      this.MarketRateTextBoxconfig.externalError = true;
    }
  }

  ngOnInit(): void {

    this.buildConfiguration();

    this.modificationHeader = [
      { field: 'modifiedMarketRate', header: this.translate.instant('accounting.market-rate.tabel.MarketRate'), width: '25%' },
      { field: 'nrOfYears', header: this.translate.instant('accounting.market-rate.tabel.Noofyrs'), width: '25%' },
      { field: 'modifiedValidFrom', header: this.translate.instant('accounting.market-rate.tabel.ValidFrom'), width: '25%', dateSort: 'validFrom' },
      { field: 'modifiedValidTo', header: this.translate.instant('accounting.market-rate.tabel.ValidTo'), width: '25%', dateSort: 'validTo' },
      { field: 'delete', width: '5%', fieldType: 'deleteButton' }

    ]

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      const getResponse = res.marketRateData

      this.responseMarketRate = [...getResponse];
      this.deletedRecords = [...new Array<marketRateForSubstantialModification>()];
      this.index = 0;
      if (this.responseMarketRate.length > 0) {
        this.Nothide = true;
        this.responseMarketRate.forEach(x => {
          x.validFrom = new Date(x.validFrom)
          x.modifiedValidFrom = this.datePipe.transform(x.validFrom, 'dd/MM/yyyy')

          if (x.validTo != null) {
            x.validTo = new Date(x.validTo)
            x.modifiedValidTo = this.datePipe.transform(x.validTo, 'dd/MM/yyyy')
          }
          

          x.modifiedMarketRate = parseFloat(x.marketRate as unknown as string).toFixed(2)
          x.modifiedMarketRate = this.decimalpipe.transform(x.modifiedMarketRate) as string
        })
        this.SettingFalse();
        this.responseMarketRate[this.index].isEntered = true;
        this.MarketRateCard = this.responseMarketRate[this.index];
      }
    }
    )
  }

  buildConfiguration() {

    const YearsRequired = new ErrorDto;
    YearsRequired.validation = "required";
    YearsRequired.isModelError = true;
    YearsRequired.validationMessage = this.translate.instant('accounting.market-rate.mandatory.Noofyrs') + this.translate.instant('accounting.market-rate.mandatory.required');
    this.YearsTextBoxconfig.Errors = [YearsRequired];
    this.YearsTextBoxconfig.required = true

    const ValidFromRequired = new ErrorDto;
    ValidFromRequired.validation = "required";
    ValidFromRequired.isModelError = true;
    ValidFromRequired.validationMessage = this.translate.instant('accounting.market-rate.mandatory.ValidFrom') + this.translate.instant('accounting.market-rate.mandatory.required');
    this.ValidFromDateconfig.Errors = [ValidFromRequired];
    this.ValidFromDateconfig.required = true

    const MarketRateZeroValidation = new ErrorDto;
    MarketRateZeroValidation.validation = "maxError";
    MarketRateZeroValidation.isModelError = true;
    MarketRateZeroValidation.validationMessage = this.translate.instant('accounting.market-rate.mandatory.zeroRate');
    this.numberErrorDto = [MarketRateZeroValidation];
    const MarketRateRequired = new ErrorDto;
    MarketRateRequired.validation = "required";
    MarketRateRequired.isModelError = true;
    MarketRateRequired.validationMessage = this.translate.instant('accounting.market-rate.mandatory.MarketRate') + this.translate.instant('accounting.market-rate.mandatory.required');
    this.MarketRateTextBoxconfig.Errors = [MarketRateRequired];
    this.MarketRateTextBoxconfig.required = true
    this.MarketRateTextBoxconfig.invalidDefaultValidation = this.translate.instant('accounting.market-rate.mandatory.zeroRate');

  }
}
