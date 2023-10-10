import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlsBaseService, ErrorDto, FluidDropDownConfig, fluidValidationService, FluidCheckBoxConfig, FluidControlTextBoxConfig, ValidationErrorDto, DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { ActivatedRoute, Router } from '@angular/router';
import { DtoState, ForbearanceMeasureConfigDto, ForbearanceMeasureTypeDto } from './models/forbearance-measure.model';
import { ForbearanceMeasureService } from './service/forbearance-measure.service';

@Component({
  selector: 'mactc-forbearance-measure',
  templateUrl: './forbearance-measure.component.html',
  styleUrls: ['./forbearance-measure.component.scss']
})

export class ForbearanceMeasureComponent implements OnInit {

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public route: ActivatedRoute,
    private spinnerservice: SpinnerService, private fluidValidation: fluidValidationService, private decimalPipe: DecimalTransformPipe,
    private commonService: ConfigContextService, public router: Router, public service: ForbearanceMeasureService) {
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;
  }

  @ViewChild("forbearanceForm", { static: true }) forbearanceForm!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  public ForBearanceMeasureDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MaxLimitTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;


  validationHeader = this.translate.instant('accounting.Validation.Header');
  placeholder = 'select';
  forbearanceMeasureList!: ForbearanceMeasureConfigDto[];
  forbearanceMeasureTypeList!: ForbearanceMeasureTypeDto[];
  forbearanceMeasureDetail!: ForbearanceMeasureConfigDto
  saveForbearanceMeasure: ForbearanceMeasureConfigDto[] = []
  showDetails!: boolean
  exceptionBox!: boolean
  showDialog!: boolean
  errorCode!: string
  navigateUrl!: string
  intMaxValue = 2147483647;
  maxErrorDto: ErrorDto[] = []

  forbearanceHeader = [
    { header: this.translate.instant('accounting.forbearance-measure.card.forbearanceMeasure'), field: 'forbearanceMeasureType.caption', width: '19%' },
    { header: this.translate.instant('accounting.forbearance-measure.card.paymentHoliday'), field: 'nrOfMonthsForPaymentHoliday', width: '19%' },
    { header: this.translate.instant('accounting.forbearance-measure.card.isSubstantialModification'), field: 'modifiedIsApplicable', width: '19%' },
    { header: this.translate.instant('accounting.forbearance-measure.card.substantialModification'), field: 'modifiedSubstantialModificationPercentage', width: '19%' },
    { header: this.translate.instant('accounting.forbearance-measure.card.concessiontx'), field: 'nrOfDaysForConcessionTx', width: '19%' },
    { header: '', field: 'delete', fieldType: 'deleteButton', width: '5%' }];

  ngOnInit(): void {

    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerservice.setIsLoading(false);
      this.forbearanceMeasureList = res.ForbearanceMeasureData
      this.forbearanceMeasureTypeList = res.ForbearanceMeasureTypeList
      console.log(this.forbearanceMeasureTypeList)
      this.forbearanceMeasureList.forEach(x => {
        const index = this.forbearanceMeasureTypeList.findIndex(y => x.forbearanceMeasureTypeCd == y.codeId)
        x.forbearanceMeasureType = this.forbearanceMeasureTypeList[index];
      })

      if (this.forbearanceMeasureList.length > 0) {

        this.showDetails = true;
        this.settingIsSelectedFalse();
        this.forbearanceMeasureList[0].isSelected = true;
        this.forbearanceMeasureDetail = this.forbearanceMeasureList[0];

        this.forbearanceMeasureList.forEach(x => {
          x.isForBearanceTypeReadOnly = true;
          x.modifiedSubstantialModificationPercentage = this.decimalPipe.transform(x.substantialModificationPercentage) as string
          x.modifiedIsApplicable = x.isSubstantialModificationApplicable?.toString();
          x.forbearanceTypeList = this.forbearanceMeasureTypeList;
        })

      }
      else {
        this.showDetails = false;
      }

    })
  }

  onSave(forBearanceData: ForbearanceMeasureConfigDto[]) {

    this.RemoveBusinessError('If IsSubstantialModificationApplicable is TRUE, the SubstantialModificationPercentage is Mandatory')

    if (this.forbearanceForm.valid) {
      let isBusinessError = false;
      forBearanceData.forEach(x => {
        if (x.isSubstantialModificationApplicable == true && x.substantialModificationPercentage == null) {
          isBusinessError = true;
          this.throwBusinessError('If IsSubstantialModificationApplicable is TRUE, the SubstantialModificationPercentage is Mandatory')
        }
      })

      forBearanceData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.saveForbearanceMeasure.push({ ...x });
        }
      })
      if (this.saveForbearanceMeasure.length > 0 && !isBusinessError) {
        this.spinnerservice.setIsLoading(true);
        this.service.saveForbearanceMeasure(this.saveForbearanceMeasure).subscribe(result => {
          this.spinnerservice.setIsLoading(false);
          this.service.getForbearanceMeasure().subscribe(res => {
            this.forbearanceMeasureList = res;
            this.forbearanceMeasureList.forEach(x => {
              const index = this.forbearanceMeasureTypeList.findIndex(y => x.forbearanceMeasureTypeCd == y.codeId)
              x.forbearanceMeasureType = this.forbearanceMeasureTypeList[index];
            })

            if (this.forbearanceMeasureList.length > 0) {
              const index = this.forbearanceMeasureList.findIndex(x => x.forbearanceMeasureTypeCd == this.forbearanceMeasureDetail.forbearanceMeasureTypeCd);
              this.showDetails = true;
              this.settingIsSelectedFalse();
              this.forbearanceMeasureList[index].isSelected = true;
              this.forbearanceMeasureDetail = this.forbearanceMeasureList[index];

              this.forbearanceMeasureList.forEach(x => {
                x.isForBearanceTypeReadOnly = true;
                x.modifiedSubstantialModificationPercentage = this.decimalPipe.transform(x.substantialModificationPercentage) as string
                x.modifiedIsApplicable = x.isSubstantialModificationApplicable?.toString();
                x.forbearanceTypeList = this.forbearanceMeasureTypeList;
              })
            }

            this.saveForbearanceMeasure = [];
          }, err => {
            this.spinnerservice.setIsLoading(false);
            this.exceptionBox = true;
            if (err?.error?.errorCode) {
              this.errorCode = err?.error?.errorCode;
            }
            else {
              this.errorCode = 'InternalServiceFault';
            }
            this.saveForbearanceMeasure = [];
          })
        }, err => {
          this.spinnerservice.setIsLoading(false);
          this.exceptionBox = true;
          if (err?.error?.errorCode) {
            this.errorCode = err?.error?.errorCode;
          }
          else {
            this.errorCode = 'InternalServiceFault';
          }
          this.saveForbearanceMeasure = [];
        })
      }
      else {
        this.settingValidationTrue();
      }
    }
    else {
      this.settingValidationTrue();
    }
  }

  dataSelection(event: ForbearanceMeasureConfigDto) {
    if (this.forbearanceForm.valid) {
      this.settingIsSelectedFalse();
      this.forbearanceMeasureDetail = event;
      this.forbearanceMeasureDetail.isSelected = true;
    }
    else {
      this.settingValidationTrue();
    }
  }

  addForbearanceMeasure() {
    if (this.forbearanceForm.valid) {

      this.ForBearanceMeasureDropdownConfig.externalError = false;

      this.showDetails = true;
      const newRow = new ForbearanceMeasureConfigDto;
      newRow.isSelected = true;
      const newuserList = this.forbearanceMeasureList;
      newuserList.push({ ...newRow });
      this.forbearanceMeasureDetail = new ForbearanceMeasureConfigDto();
      this.forbearanceMeasureList = [...newuserList];

      if (this.forbearanceMeasureList.length > 0) {
        this.forbearanceMeasureDetail.forbearanceTypeList = this.forbearanceMeasureTypeList.filter(val => {
          return !this.forbearanceMeasureList.find(x => {
            return x.forbearanceMeasureTypeCd == val.codeId;
          })
        })
      }


      this.settingIsSelectedFalse();
      this.forbearanceMeasureDetail.state = DtoState.Created;
      this.forbearanceMeasureDetail.pKey = 0;
      this.forbearanceMeasureDetail.isSelected = true;
      this.forbearanceMeasureDetail.isSubstantialModificationApplicable = false;
      this.forbearanceMeasureDetail.isForBearanceTypeReadOnly = false;

      this.forbearanceMeasureList[this.forbearanceMeasureList.length - 1] = this.forbearanceMeasureDetail;
    }
    else {
      this.settingValidationTrue();
    }
  }

  onRowDelete(event: ForbearanceMeasureConfigDto, gridData: ForbearanceMeasureConfigDto[]) {
    if (this.forbearanceForm.valid || event.forbearanceMeasureType == null) {
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      if (this.forbearanceMeasureList[deletedata].state != DtoState.Created) {
        event.state = DtoState.Deleted;
        this.saveForbearanceMeasure.push({ ...event });
      }

      gridData.splice(deletedata, 1);
      this.forbearanceMeasureList = [...gridData]

      if (gridData.length > 0) {
        this.settingIsSelectedFalse();
        this.forbearanceMeasureList[this.forbearanceMeasureList.length - 1].isSelected = true;
        this.forbearanceMeasureDetail = this.forbearanceMeasureList[this.forbearanceMeasureList.length - 1];
      }
      else {
        this.ForBearanceMeasureDropdownConfig.externalError = false;
        setTimeout(() => {
          this.showDetails = false;
        },1)
      }
    }
  }

  settingIsSelectedFalse() {
    this.forbearanceMeasureList.forEach(x => x.isSelected = false)
  }

  settingForbearanceMeasureDirty() {
    const index = this.forbearanceMeasureList.findIndex(x => x.isSelected)
    if (this.forbearanceMeasureList[index].state != DtoState.Created) {
      this.forbearanceMeasureList[index].state = DtoState.Dirty;
    }
  }

  settingValidationTrue() {
    this.ForBearanceMeasureDropdownConfig.externalError = true;
  }

  onChangeForbearanceMeasureType(event: any) {
    const index = this.forbearanceMeasureList.findIndex(x => x.isSelected)
    this.settingForbearanceMeasureDirty()
    this.forbearanceMeasureList[index].forbearanceMeasureTypeCd = event?.value?.codeId;
    this.forbearanceMeasureDetail.forbearanceMeasureTypeCd = event?.value?.codeId;
    this.forbearanceMeasureList[index].forbearanceMeasureType = event?.value;
    this.forbearanceMeasureDetail.forbearanceMeasureType = event?.value;
    if (event?.value == null) {
      this.ForBearanceMeasureDropdownConfig.externalError = true;
    }
  }

  onChangeNrOfMonthsForPaymentHoliday(event: any) {
    const index = this.forbearanceMeasureList.findIndex(x => x.isSelected)
    this.settingForbearanceMeasureDirty()
    if (event != null) {
      this.forbearanceMeasureList[index].nrOfMonthsForPaymentHoliday = parseInt(event);
      this.forbearanceMeasureDetail.nrOfMonthsForPaymentHoliday = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MaxLimitTextBoxconfig.externalError = true;
      }
    }
    else {
      this.forbearanceMeasureList[index].nrOfMonthsForPaymentHoliday = event;
      this.forbearanceMeasureDetail.nrOfMonthsForPaymentHoliday = event;
    }
  }

  onChangeSubstantialModificationPercentage(event: any, isChanged: boolean) {
    const index = this.forbearanceMeasureList.findIndex(x => x.isSelected)
    this.settingForbearanceMeasureDirty()
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.forbearanceMeasureList[index].substantialModificationPercentage = parseFloat(floatValue);
        this.forbearanceMeasureDetail.substantialModificationPercentage = parseFloat(floatValue);
        this.forbearanceMeasureDetail.modifiedSubstantialModificationPercentage = event;
      }
    }
    else {
      this.forbearanceMeasureList[index].substantialModificationPercentage  = null as unknown as number;
      this.forbearanceMeasureDetail.substantialModificationPercentage = null as unknown as number;
      this.forbearanceMeasureDetail.modifiedSubstantialModificationPercentage = null as unknown as string;
    }
  }

  onChangeNrOfDaysForConcessionTx(event: any) {
    const index = this.forbearanceMeasureList.findIndex(x => x.isSelected)
    this.settingForbearanceMeasureDirty()
    if (event != null) {
      this.forbearanceMeasureList[index].nrOfDaysForConcessionTx = parseInt(event);
      this.forbearanceMeasureDetail.nrOfDaysForConcessionTx = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MaxLimitTextBoxconfig.externalError = true;
      }
    }
    else {
      this.forbearanceMeasureList[index].nrOfDaysForConcessionTx = event;
      this.forbearanceMeasureDetail.nrOfDaysForConcessionTx = event;
    }
  }

  onChangeIsSubstantialModificationApplicable(event: boolean) {
    const index = this.forbearanceMeasureList.findIndex(x => x.isSelected)
    this.settingForbearanceMeasureDirty()
    this.forbearanceMeasureList[index].isSubstantialModificationApplicable = event;
    this.forbearanceMeasureDetail.isSubstantialModificationApplicable = event;
    this.forbearanceMeasureDetail.modifiedIsApplicable = event?.toString();
  }

  onClose() {
    const unsaved = this.forbearanceMeasureList.findIndex(x => {
      return x.state == DtoState.Created || x.state == DtoState.Dirty
    })
    if (this.saveForbearanceMeasure.length > 0 || unsaved != -1) {
      this.showDialog = true;
    }
    else {
      this.showDialog = false;
      window.location.assign(this.navigateUrl);
    }
  }

  onClickYes(GridData: ForbearanceMeasureConfigDto[]) {
    this.showDialog = false;
    this.onSave(GridData);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.showDialog = false;
    this.ForBearanceMeasureDropdownConfig.externalError = false;
    this.RemoveBusinessError('If IsSubstantialModificationApplicable is TRUE, the SubstantialModificationPercentage is Mandatory')
    window.location.assign(this.navigateUrl);
  }

  onCancel() {
    this.showDialog = false;
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
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  buildConfiguration() {
    const forbearanceMeasureError = new ErrorDto;
    forbearanceMeasureError.validation = "required";
    forbearanceMeasureError.isModelError = true;
    forbearanceMeasureError.validationMessage = this.translate.instant('accounting.forbearance-measure.validation.forbearanceMeasure')
    this.ForBearanceMeasureDropdownConfig.required = true;
    this.ForBearanceMeasureDropdownConfig.Errors = [forbearanceMeasureError];

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('accounting.forbearance-measure.validation.numberInt32Check');
    this.maxErrorDto = [maxLimitValidation];
    this.MaxLimitTextBoxconfig.maxValueValidation = this.translate.instant('accounting.forbearance-measure.validation.InputIncorrect');
  }
}
