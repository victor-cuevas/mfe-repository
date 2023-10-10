import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { InterestMediationService } from './service/interest-mediation.service';
import { interestMediation } from './Models/interestMediationSurcharge.model';
import { rateAdaptationName } from './Models/rateAdaptationName.model';
import { stateModel } from './Models/state.model';


@Component({
  selector: 'mactc-interest-mediation-surcharge',
  templateUrl: './interest-mediation-surcharge.component.html',
  styleUrls: ['./interest-mediation-surcharge.component.scss']
})
export class InterestMediationSurchargeComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public interestMediationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
 

  placeholder = 'select';
  responseInterestMediation: interestMediation[] = [];
  responseRateAdaptation: rateAdaptationName[] = [];
  interestMediationCard!: interestMediation;
  businessError = this.translate.instant('accounting.mutation-type.ValidationError.buisnessError');
  index: any;
  Header = this.translate.instant('accounting.Validation.Header');
  editable!: boolean;
  interestHeader!: any[];
  deletedRecords: interestMediation[] = [];
  Nothide!: boolean;
  show!: boolean;
  navigateUrl!: string;
  isErrors!: boolean;
  exceptionBox!: boolean
  errorCode!:string

  constructor(public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public interestMediationService: InterestMediationService,
    public fluidValidation: fluidValidationService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }
  isBusinessError(): boolean {
    const filteredData = this.responseInterestMediation.map(item => { return item.rateAdaptationNameList?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (hasValue) {
      return true;
    }
    else { return false; }
  }

  SettingFalse() {
    if (this.responseInterestMediation.length > 0) {
      this.responseInterestMediation.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  clickGrid(dataselected: interestMediation) {
    if (dataselected) {
      if (!this.userDetailsform.invalid) {
        if (!this.isBusinessError()) {
          this.SettingFalse();
          this.index = this.responseInterestMediation.findIndex(item => {
            return item == dataselected
          })
        this.responseInterestMediation[this.index].isEntered = true;
          this.interestMediationCard = dataselected;
          this.editable = true;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.interestMediationDropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {
    if ((!this.userDetailsform.invalid) ||
      this.responseInterestMediation.length == 0) {

      if (!this.isBusinessError()) {
      const interestMediationObj = new interestMediation();
        this.SettingFalse();
      interestMediationObj.isEntered = true;
      interestMediationObj.state = stateModel.Created;
      interestMediationObj.pKey = 0;
      interestMediationObj.canValidate = false;
      interestMediationObj.rowVersion = 0;
      const newlist = this.responseInterestMediation;
      newlist.push({ ...interestMediationObj });
      this.responseInterestMediation = [...newlist];
      this.interestMediationCard = new interestMediation();
      this.interestMediationCard = this.responseInterestMediation[this.responseInterestMediation.length - 1]
        this.Nothide = true;
        this.editable = false;
        this.RemoveBusinessError(this.businessError)
        this.interestMediationDropdownConfig.externalError = false;
        
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.interestMediationDropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: interestMediation, array: interestMediation[]) {
    if (!this.userDetailsform.invalid || ((event.rateAdaptationNameList?.caption == null) &&
      event.isEntered)) {
      if (!this.isBusinessError() || (this.isBusinessError() && event.isEntered)) {
        const deletedata = array.findIndex(data => {
          return data == event;
        })
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
      this.responseInterestMediation = [...array];
      if (this.responseInterestMediation.length == 0) {
          setTimeout(() => {
           this.Nothide = false;
          }, 5);
        }
      if (this.responseInterestMediation.length > 0) {
         this.SettingFalse();
        this.interestMediationCard = this.responseInterestMediation[this.responseInterestMediation.length - 1]
        this.responseInterestMediation[this.responseInterestMediation.length - 1].isEntered = true;
          this.editable = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.interestMediationDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.interestMediationDropdownConfig.externalError = true;
    }
  }


  changeRateAdaptationName(event: any) {
    this.index = this.responseInterestMediation.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.responseInterestMediation[this.index].state == stateModel.Unknown) {
      this.responseInterestMediation[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      this.responseInterestMediation[this.index].rateAdaptationNameList = event?.value;
      this.interestMediationCard.rateAdaptationNameList = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
    }
    else {
      this.responseInterestMediation[this.index].rateAdaptationNameList = null as unknown as rateAdaptationName;
      this.interestMediationCard.rateAdaptationNameList = null as unknown as rateAdaptationName;

      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }

      this.interestMediationDropdownConfig.externalError = true;
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

  ngOnInit(): void {
   
    this.interestHeader = [
      { header: this.translate.instant('accounting.interest-mediation.tabel.RateAdaptionName'), field: 'rateAdaptationNameList.caption', width: '93%' },
      { header: this.translate.instant('accounting.interest-mediation.tabel.delete'), field: 'delete', width: '8%',fieldType:'deleteButton' }];

    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      
      const getResponse = res.InterestMediationData

      console.log(getResponse)
      this.responseInterestMediation = [...getResponse];
      this.deletedRecords = [...new Array<interestMediation>()];
        this.index = 0;
        if (this.responseInterestMediation.length > 0) {
          this.Nothide = true;
          this.editable = true;
          this.SettingFalse();
          this.responseInterestMediation[this.index].isEntered = true;
          this.interestMediationCard = this.responseInterestMediation[this.index];
        }
    }
    )
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      this.responseRateAdaptation = res.rateAdaptationData

      console.log(this.responseRateAdaptation)
     })
  }

  onSave(GridData: interestMediation[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }
    else if (!this.userDetailsform.invalid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(y => {
        if (y.state == stateModel.Deleted && y.rateAdaptationNameList?.caption == null) {
          y.rateAdaptationNameList = null as unknown as rateAdaptationName;
        }
      })


      this.spinnerService.setIsLoading(true);
      this.interestMediationService.saveInterestMediation(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        
          this.editable = true;
          this.show = false;
          this.deletedRecords = [...new Array<interestMediation>()];

          this.interestMediationService.getInterestMediation().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as interestMediation[]
            this.responseInterestMediation = [...getResponse];

            this.interestMediationDropdownConfig.externalError = false;

            if (this.responseInterestMediation.length > 0) {

              this.SettingFalse();
              this.index = this.responseInterestMediation.findIndex(i => {
                return ((i.rateAdaptationNameList?.caption == this.interestMediationCard.rateAdaptationNameList?.caption))
              })
              this.responseInterestMediation[this.index].isEntered = true;
              this.interestMediationCard = this.responseInterestMediation[this.index]
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
              this.deletedRecords = [...new Array<interestMediation>()];
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
          this.deletedRecords = [...new Array<interestMediation>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.interestMediationDropdownConfig.externalError = true;
    }
  }

  onclose() {
    const unsaved = this.responseInterestMediation.findIndex(x => {
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
  onYes(GridData: interestMediation[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.interestMediationDropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  buildConfiguration() {
    const interestMediationRequired = new ErrorDto();
    interestMediationRequired.validation = 'required';
    interestMediationRequired.isModelError = true;
    interestMediationRequired.validationMessage =
      this.translate.instant('accounting.interest-mediation.mandatory.RateAdaptionName') +
    this.translate.instant('accounting.interest-mediation.mandatory.required');
    this.interestMediationDropdownConfig.Errors = [interestMediationRequired];
    this.interestMediationDropdownConfig.required = true;
  }
}
