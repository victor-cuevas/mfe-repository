import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { TranslateService } from '@ngx-translate/core';
import { LtvModificationService } from './services/ltv-modification.service';
import { ltvModification } from './Models/ltvModification.model';
import { rateAdaptationName } from './Models/rateAdaptationName.model';
import { stateModel } from './Models/state.model';

@Component({
  selector: 'mactc-ltv-modification-surcharges',
  templateUrl: './ltv-modification-surcharges.component.html',
  styleUrls: ['./ltv-modification-surcharges.component.scss']
})
export class LtvModificationSurchargesComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public rateAdaptationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
 

  placeholder = 'select';
  navigateUrl!: string
  responseLtvModification: ltvModification[] = [];
  responseLtvRateAdaptation: rateAdaptationName[] = [];
  ltvModificationCard!: ltvModification
  deletedRecords: ltvModification[] = [];
  Header = this.translate.instant('accounting.Validation.Header');
  index: any
  Nothide!: boolean;
  businessError = this.translate.instant('accounting.mutation-type.ValidationError.buisnessError');
  editable!: boolean;
  modificationHeader!: any[];
  show!: boolean;
  isErrors!: boolean;
  exceptionBox!: boolean
  errorCode!:string
 
  constructor(public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public ltvModificationService: LtvModificationService,
    public fluidValidation: fluidValidationService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl 
  }

  isBusinessError(): boolean {
    const filteredData = this.responseLtvModification.map(item => { return item.rateAdaptationNameList?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (hasValue) {
      return true;
    }
    else { return false; }
  }

  SettingFalse() {
    if (this.responseLtvModification.length > 0) {
      this.responseLtvModification.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  clickGrid(dataselected: ltvModification) {
    if (dataselected) {
      if (!this.userDetailsform.invalid) {
        if (!this.isBusinessError()) {
          this.SettingFalse();
          this.index = this.responseLtvModification.findIndex(item => {
            return item == dataselected
          })
          this.responseLtvModification[this.index].isEntered = true;
          this.ltvModificationCard = dataselected;
          this.editable = true;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.rateAdaptationDropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {
    if ((!this.userDetailsform.invalid) ||
      this.responseLtvModification.length == 0) {

      if (!this.isBusinessError()) {
        const interestMediationObj = new ltvModification();
        this.SettingFalse();
        interestMediationObj.isEntered = true;
        interestMediationObj.state = stateModel.Created;
        interestMediationObj.pKey = 0;
        interestMediationObj.canValidate = false;
        interestMediationObj.rowVersion = 0;
        const newlist = this.responseLtvModification;
        newlist.push({ ...interestMediationObj });
        this.responseLtvModification = [...newlist];
        this.ltvModificationCard = new ltvModification();
        this.ltvModificationCard = this.responseLtvModification[this.responseLtvModification.length - 1]
        this.Nothide = true;
        this.editable = false;
        this.RemoveBusinessError(this.businessError)
        this.rateAdaptationDropdownConfig.externalError = false;

      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.rateAdaptationDropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: ltvModification, array: ltvModification[]) {
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
        this.responseLtvModification = [...array];
        if (this.responseLtvModification.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
        }
        if (this.responseLtvModification.length > 0) {
          this.SettingFalse();
          this.ltvModificationCard = this.responseLtvModification[this.responseLtvModification.length - 1]
          this.responseLtvModification[this.responseLtvModification.length - 1].isEntered = true;
          this.editable = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.rateAdaptationDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.rateAdaptationDropdownConfig.externalError = true;
    }
  }

  changeRateAdaptationName(event: any) {
    this.index = this.responseLtvModification.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.responseLtvModification[this.index].state == stateModel.Unknown) {
      this.responseLtvModification[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      this.responseLtvModification[this.index].rateAdaptationNameList = event?.value;
      this.ltvModificationCard.rateAdaptationNameList = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
    }
    else {
      
      this.responseLtvModification[this.index].rateAdaptationNameList = null as unknown as rateAdaptationName;
      this.ltvModificationCard.rateAdaptationNameList = null as unknown as rateAdaptationName;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
      this.rateAdaptationDropdownConfig.externalError = true;
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
    this.buildConfiguration();

    this.modificationHeader = [
      { header: this.translate.instant('accounting.ltvmodification.tabel.RateAdaptionName'), field: 'rateAdaptationNameList.caption', width: '93%' },
      { header: this.translate.instant('accounting.ltvmodification.tabel.delete'), field: 'delete', width: '8%',fieldType:'deleteButton' }];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      const getResponse = res.LtvModificationData

      console.log(getResponse)
      this.responseLtvModification = [...getResponse];
      this.deletedRecords = [...new Array<ltvModification>()];
      this.index = 0;
      if (this.responseLtvModification.length > 0) {
        this.Nothide = true;
        this.editable = true;
        this.SettingFalse();
        this.responseLtvModification[this.index].isEntered = true;
        this.ltvModificationCard = this.responseLtvModification[this.index];
      }
    }
    )
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      this.responseLtvRateAdaptation = res.ltvRateAdaptationData

      console.log(this.responseLtvRateAdaptation)
    })

  }

  onSave(GridData: ltvModification[]) {
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
      this.ltvModificationService.saveltvModification(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.editable = true;
        this.show = false;
        this.deletedRecords = [...new Array<ltvModification>()];

        this.ltvModificationService.getltvModification().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as ltvModification[]
          this.responseLtvModification = [...getResponse];

          this.rateAdaptationDropdownConfig.externalError = false;

          if (this.responseLtvModification.length > 0) {

            this.SettingFalse();
            this.index = this.responseLtvModification.findIndex(i => {
              return ((i.rateAdaptationNameList?.caption == this.ltvModificationCard.rateAdaptationNameList?.caption))
            })
            this.responseLtvModification[this.index].isEntered = true;
            this.ltvModificationCard = this.responseLtvModification[this.index]
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
            this.deletedRecords = [...new Array<ltvModification>()];
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
          this.deletedRecords = [...new Array<ltvModification>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.rateAdaptationDropdownConfig.externalError = true;
    }
  }

  onclose() {
    const unsaved = this.responseLtvModification.findIndex(x => {
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
  onYes(GridData: ltvModification[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.rateAdaptationDropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
   this.exceptionBox = false;
  }

  buildConfiguration() {
    const ltvModificationRequired = new ErrorDto();
    ltvModificationRequired.validation = 'required';
    ltvModificationRequired.isModelError = true;
    ltvModificationRequired.validationMessage =
      this.translate.instant('accounting.ltvmodification.mandatory.RateAdaptionName') +
    this.translate.instant('accounting.ltvmodification.mandatory.required');
    this.rateAdaptationDropdownConfig.Errors = [ltvModificationRequired];
    this.rateAdaptationDropdownConfig.required = true;
  }
}
