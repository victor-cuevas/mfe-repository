import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { ValueReductionService } from './Service/value-reduction.service';
import { getValueReductionResponse } from './Models/getValueReductionResponse.model';
import { valueReductionConfig } from './Models/valueReductionConfig.model';
import { valueReduction } from './Models/valueReduction.model';
import { codeTable } from './Models/codeTable.model';
import { stateModel } from './Models/state.model';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';

@Component({
  selector: 'mfcs-manage-value-reduction',
  templateUrl: './manage-value-reduction.component.html',
  styleUrls: ['./manage-value-reduction.component.scss']
})
export class ManageValueReductionComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public VRNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public VRCNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public dueTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public reductionTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public periodBaseDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public calculationBaseDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select';
  Header = this.translate.instant('financial.validations.Header') ;
  maxValue = 2147483647;
  businessError = this.translate.instant('financial.valueReduction.mandatory.error');
  getValueReduction!: getValueReductionResponse;
  ValuereductionConfigCard!: valueReductionConfig;
  ValueReductionCard!: valueReduction;
  deletedVRRecords: valueReduction[] = []
  deletedVRCRecords: valueReductionConfig[]=[]
  ValuereductionIndex: any
  ValuereductionConfigIndex:any
  valueHeader!: any[];
  HideVR!: boolean;
  HideVRC!: boolean;
  backDisable!: boolean;
  notHideVRCard!: boolean
  notHideVRCCard!: boolean
  saveAndNextDisable!: boolean
  show!: boolean;
  backShow!:boolean
  exceptionBox!: boolean
  isErrors!: boolean;
  lengthBox!: boolean
  lengthError!:boolean
  valueo!: any[];
  valueoHeader!: any[];
  navigateUrl!: string
  errorCode!:string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public valueReductionService: ValueReductionService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService,
    public decimalpipe: DecimalTransformPipe) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  clickVRGrid(dataselected: valueReduction) {
    if (dataselected) {

      const filteredData = this.getValueReduction.valueReductionPrincipleList.map(item => { return item.name});
      const hasValue = filteredData.some(function (item, index) {
        return filteredData.indexOf(item) != index
      })

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!hasValue) {
          this.SettingVRFalse();
          this.ValuereductionIndex = this.getValueReduction.valueReductionPrincipleList.findIndex(item => {
            return item == dataselected
          })
        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].isEntered = true;
          this.ValueReductionCard = dataselected;
        }
        else {
          this.throwBusinessError(this.businessError);
        }

      }
      else {
        this.VRNameTextBoxconfig.externalError = true;
        this.periodBaseDropdownConfig.externalError = true;
        if (hasValue) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  clickVRCGrid(dataselected: valueReductionConfig) {
    const filteredData = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.map(item => { return item.name });
    const VRChasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!VRChasValue) {
        this.SettingVRCFalse();
        this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(item => {
          return item == dataselected
        })
        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].isEntered = true;
        this.ValuereductionConfigCard = dataselected;
         }
        else {
          this.throwBusinessError(this.businessError);
        }

      }
      else {
        this.VRCNameTextBoxconfig.externalError = true;
        this.dueTextBoxconfig.externalError = true;
        this.calculationBaseDropdownConfig.externalError = true;
        this.reductionTextBoxconfig.externalError = true;

        if (VRChasValue) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addVRRow() {
    const filteredData = this.getValueReduction.valueReductionPrincipleList.map(item => { return item.name });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if ((this.userDetailsform.valid) ||
      this.getValueReduction.valueReductionPrincipleList.length == 0) {

      if (!hasValue) {
      const valueReductionObj = new valueReduction();
        this.SettingVRFalse();
      valueReductionObj.isEntered = true;
      valueReductionObj.state = stateModel.Created;
      valueReductionObj.pKey = 0;
      valueReductionObj.canValidate = false;
      valueReductionObj.rowVersion = 0;
      const newlist = this.getValueReduction.valueReductionPrincipleList;
      newlist.push({ ...valueReductionObj });
      this.getValueReduction.valueReductionPrincipleList = [...newlist];
        this.ValueReductionCard = new valueReduction();
      this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[this.getValueReduction.valueReductionPrincipleList.length - 1]
        this.notHideVRCard = true;
        this.lengthError = false;
        this.RemoveBusinessError(this.businessError)
      this.VRNameTextBoxconfig.externalError = false;
      this.periodBaseDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }

    }
    else {
      this.VRNameTextBoxconfig.externalError = true;
      this.periodBaseDropdownConfig.externalError = true;

      if (hasValue) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  addVRCRow() {

    this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;

    const filteredData = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.map(item => { return item.name });
    const VRChasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if ((this.userDetailsform.valid) ||
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length == 0) {

      if (!VRChasValue) {
      const valueReductionConfigObj = new valueReductionConfig();
      this.SettingVRCFalse();
      valueReductionConfigObj.isEntered = true;
      valueReductionConfigObj.state = stateModel.Created;
      valueReductionConfigObj.pKey = 0;
      valueReductionConfigObj.canValidate = false;
      valueReductionConfigObj.rowVersion = 0;
      valueReductionConfigObj.factor = 1;
      const newlist = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs;
      newlist.push({ ...valueReductionConfigObj });
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs = [...newlist];
      this.ValuereductionConfigCard = new valueReductionConfig();
      this.ValuereductionConfigCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length - 1]
       this.notHideVRCCard = true;
      this.RemoveBusinessError(this.businessError)
      this.VRCNameTextBoxconfig.externalError = false;
      this.dueTextBoxconfig.externalError = false;
      this.calculationBaseDropdownConfig.externalError = false;
      this.reductionTextBoxconfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }

    }
    else {
      this.VRCNameTextBoxconfig.externalError = true;
      this.dueTextBoxconfig.externalError = true;
      this.calculationBaseDropdownConfig.externalError = true;
      this.reductionTextBoxconfig.externalError = true;

      if (VRChasValue) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onVRRowDelete(event: valueReduction, array: valueReduction[]) {

    const filteredData = this.getValueReduction.valueReductionPrincipleList.map(item => { return item.name });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (this.userDetailsform.valid || (event.periodBase?.caption == null || event.name == null) &&
      event.isEntered) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)

      if (!hasValue || (hasValue && event.isEntered)) {
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedVRRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.getValueReduction.valueReductionPrincipleList = [...array];
        if (this.getValueReduction.valueReductionPrincipleList.length == 0) {
          setTimeout(() => {
            this.notHideVRCard = false;
            this.lengthError = true;
          }, 5);
         
        }
        if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
          this.SettingVRFalse();
          this.lengthError = false;
          this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[0]
          this.getValueReduction.valueReductionPrincipleList[0].isEntered = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.VRNameTextBoxconfig.externalError = false;
        this.periodBaseDropdownConfig.externalError = false;
      }
      else {
          this.throwBusinessError(this.businessError);
      }
      

    }
    else {
      this.VRNameTextBoxconfig.externalError = true;
      this.periodBaseDropdownConfig.externalError = true;
      if (hasValue) {
          this.throwBusinessError(this.businessError);
        }
    }

  }

  onVRCRowDelete(event: valueReductionConfig, array: valueReductionConfig[]) {

    this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;

    const filteredData = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.map(item => { return item.name });
    const VRChasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })

    if (this.userDetailsform.valid || (event.name == null || event.dueElapsedPeriod == null ||
      event.reduction == null || event.valueReductionCalculationBase?.caption == null) && event.isEntered) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if (!VRChasValue || (VRChasValue && event.isEntered)) {
          event.state = stateModel.Deleted;
          this.deletedVRCRecords.push({ ...event })
        array.splice(deletedata, 1);
        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs = [...array];
        if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length == 0) {
          setTimeout(() => {
             this.notHideVRCCard = false;
          }, 5);
          
        }
        if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length > 0) {
          this.SettingVRCFalse();
          this.ValuereductionConfigCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[0]
          this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[0].isEntered = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.VRCNameTextBoxconfig.externalError = false;
        this.dueTextBoxconfig.externalError = false;
        this.calculationBaseDropdownConfig.externalError = false;
        this.reductionTextBoxconfig.externalError = false;
      }

      else {
        this.throwBusinessError(this.businessError);

      }

    }
    else {
      this.VRCNameTextBoxconfig.externalError = true;
      this.dueTextBoxconfig.externalError = true;
      this.calculationBaseDropdownConfig.externalError = true;
      this.reductionTextBoxconfig.externalError = true;
      if (VRChasValue) {
          this.throwBusinessError(this.businessError);
        }
    }

  }

  SettingVRFalse() {
    if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
      this.getValueReduction.valueReductionPrincipleList.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  SettingVRCFalse() {
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length > 0) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  changeVRName(event:any) {
    this.ValuereductionIndex = this.getValueReduction.valueReductionPrincipleList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;
    }
    if (event != null) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].name = event;
      this.ValueReductionCard.name = event;
    }
    else {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].name = null as unknown as string;
      this.ValueReductionCard.name = null as unknown as string;
      this.RemoveBusinessError(this.businessError);
      this.VRNameTextBoxconfig.externalError = true;

    }
  }

  changeVRPeriodBase(event: any) {
    this.ValuereductionIndex = this.getValueReduction.valueReductionPrincipleList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;
    }
    if (event?.value != null) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].periodBase = event?.value;
      this.ValueReductionCard.periodBase = event?.value;
    }
    else {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].periodBase = null as unknown as codeTable;
      this.ValueReductionCard.periodBase = null as unknown as codeTable;
      this.periodBaseDropdownConfig.externalError = true;

    }
  }

  changeVRCName(event: any) {
    this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state = stateModel.Dirty;
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;
    }
    if (event != null) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].name = event;
      this.ValuereductionConfigCard.name = event;
    }
    else {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].name = null as unknown as string;
      this.ValuereductionConfigCard.name = null as unknown as string;
      this.RemoveBusinessError(this.businessError);
      this.VRCNameTextBoxconfig.externalError = true;

    }
  }

  changeDueElapsedPeriod(event: any) {
    this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state = stateModel.Dirty;
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;
    }
    if (event != null && event <= this.maxValue && event != '0') {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].dueElapsedPeriod = parseInt(event);
      this.ValuereductionConfigCard.dueElapsedPeriod = parseInt(event);
    }
    else {
      this.ValuereductionConfigCard.dueElapsedPeriod = event;
      setTimeout(() => {
        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].dueElapsedPeriod = null as unknown as number;
        this.ValuereductionConfigCard.dueElapsedPeriod = null as unknown as number;
        this.dueTextBoxconfig.externalError = true;
      },4)
    }
  }

  changeCalculationBase(event: any) {
    this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state = stateModel.Dirty;
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;

    }
    if (event?.value != null) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].valueReductionCalculationBase = event?.value;
      this.ValuereductionConfigCard.valueReductionCalculationBase = event?.value;
    }
    else {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].valueReductionCalculationBase = null as unknown as codeTable;
      this.ValuereductionConfigCard.valueReductionCalculationBase = null as unknown as codeTable;
      this.calculationBaseDropdownConfig.externalError = true;

    }
  }

  changeReductionPercentage(event: any,ischanged?:boolean) {
    this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state = stateModel.Dirty;
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;

    }
    if (event != null && event != '0,00') {
      if (!ischanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].reduction = parseFloat(floatValue);
        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].modifiedReduction = event;
        this.ValuereductionConfigCard.reduction = parseFloat(floatValue);
      }
     

    }
    else {
      this.ValuereductionConfigCard.reduction = event;
      if (event == '0,00') {
        this.reductionTextBoxconfig.externalError = true;
      }
      else {
        setTimeout(() => {
          this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].reduction = null as unknown as number;
          this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].modifiedReduction = '';
          this.ValuereductionConfigCard.reduction = null as unknown as number;
          this.reductionTextBoxconfig.externalError = true;
        }, 4)
      }
     
    }
  }

  changeFactor(event: any) {
    this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state == stateModel.Unknown) {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].state = stateModel.Dirty;
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].state = stateModel.Dirty;

    }
    if (event != null && event <= this.maxValue && event != '0') {
      this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].factor = parseInt(event);
      this.ValuereductionConfigCard.factor = parseInt(event);
    }
    else {
      this.ValuereductionConfigCard.factor = event;
      setTimeout(() => {
        this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].factor = null as unknown as number;
        this.ValuereductionConfigCard.factor = null as unknown as number;

      },4)
     

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

  removeVRErrors() {
    const removePeriodBaseErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('financial.valueReduction.mandatory.PeriodBase') + this.translate.instant('financial.valueReduction.mandatory.required')

    );

    if (removePeriodBaseErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePeriodBaseErrors, 1);

    }

    const removeNameErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('financial.valueReduction.mandatory.name') + this.translate.instant('financial.valueReduction.mandatory.required')

    );

    if (removeNameErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeNameErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'The given record is already in the list. Please make sure that the record is unique. '

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }

  }

  removeVRCErrors() {
    const removeNameErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('financial.valueReduction.mandatory.nameo') + this.translate.instant('financial.valueReduction.mandatory.required')

    );

    if (removeNameErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeNameErrors, 1);

    }

    const removeCalbaseErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('financial.valueReduction.mandatory.CalculationBase') + this.translate.instant('financial.valueReduction.mandatory.required')

    );

    if (removeCalbaseErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeCalbaseErrors, 1);

    }

    const removeDueElapsedErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('financial.valueReduction.mandatory.DueElapse') + this.translate.instant('financial.valueReduction.mandatory.required')
    );

    if (removeDueElapsedErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeDueElapsedErrors, 1);

    }

    const removeReductionErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('financial.valueReduction.mandatory.Reduction') + this.translate.instant('financial.valueReduction.mandatory.required')

    );

    if (removeReductionErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeReductionErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'The given record is already in the list. Please make sure that the record is unique. '

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }

  }

  back() {
    this.valueReductionService.GetValueReductionResponse().subscribe(res => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res
        this.getValueReduction = { ...getResponse };
        console.log(this.getValueReduction)
        this.HideVRC = true;
        this.HideVR = false;
        this.backDisable = true;
        this.saveAndNextDisable = false;
        this.VRNameTextBoxconfig.externalError = false;
        this.periodBaseDropdownConfig.externalError = false;
        this.VRCNameTextBoxconfig.externalError = false;
        this.dueTextBoxconfig.externalError = false;
        this.calculationBaseDropdownConfig.externalError = false;
        this.reductionTextBoxconfig.externalError = false;
        this.RemoveBusinessError(this.businessError);
        this.removeVRCErrors();
        this.removeVRCErrors();

        this.deletedVRRecords = [...new Array<valueReduction>()];
        this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

        this.ValuereductionIndex = 0;
        if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
          this.notHideVRCard = true;
          this.lengthError = false;
          this.SettingVRFalse();
          this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].isEntered = true;
          this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex];
        }
        else {
          this.notHideVRCard = false;
          this.lengthError = true;

        }
      }
    },
      err => {
        if (err?.error?.errorCode) {
          this.errorCode = err.error.errorCode;
        }
        else {
          this.errorCode = "InternalServiceFault"
        }
        this.deletedVRRecords = [...new Array<valueReduction>()];
        this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

        this.spinnerService.setIsLoading(false)
         this.exceptionBox = true;
      })
  }

  saveAndNext() {

    if (!this.lengthError) {
      const filteredVRData = this.getValueReduction.valueReductionPrincipleList.map(item => { return item.name });
      const hasValue = filteredVRData.some(function (item, index) {
        return filteredVRData.indexOf(item) != index
      })


      if (hasValue) {
        this.throwBusinessError(this.businessError)
        this.isErrors = true;
      }

      else if (this.userDetailsform.valid) {

        this.isErrors = false;
        const saveData = [...this.getValueReduction.valueReductionPrincipleList];

        saveData.forEach(x => {
          if (x.state != stateModel.Unknown) {

            this.deletedVRRecords.push({ ...x })
          }

        })
        console.log(this.deletedVRRecords)
        this.deletedVRRecords.forEach(y => {
          if (y.state == stateModel.Deleted && y.periodBase?.caption == null) {
            y.periodBase = null as unknown as codeTable;
          }
          y.valueReductionConfigs.forEach(x => {
            if (x.state == stateModel.Deleted && x.valueReductionCalculationBase?.caption == null) {
              x.valueReductionCalculationBase = null as unknown as codeTable;
            }

          })

        })


        this.spinnerService.setIsLoading(true);
        this.valueReductionService.PostValueReductionResponse(this.deletedVRRecords).subscribe(res => {
          this.spinnerService.setIsLoading(false);

          this.show = false;
          this.backShow = false;
          this.deletedVRRecords = [...new Array<valueReduction>()];
          this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

          this.valueReductionService.GetValueReductionResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as getValueReductionResponse
            this.getValueReduction = { ...getResponse };
            this.deletedVRRecords = [...new Array<valueReduction>()];

            this.VRNameTextBoxconfig.externalError = false;
            this.periodBaseDropdownConfig.externalError = false;
            this.VRCNameTextBoxconfig.externalError = false;
            this.dueTextBoxconfig.externalError = false;
            this.calculationBaseDropdownConfig.externalError = false;
            this.reductionTextBoxconfig.externalError = false;
            this.RemoveBusinessError(this.businessError);
            this.removeVRCErrors();
            this.removeVRCErrors();

            this.ValuereductionConfigIndex = 0;
            if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
              this.lengthError = false;
              this.SettingVRFalse();
              this.ValuereductionIndex = this.getValueReduction.valueReductionPrincipleList.findIndex(i => {
                return ((i.periodBase?.caption == this.ValueReductionCard.periodBase?.caption) && (i.name == this.ValueReductionCard.name))
              })
              this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].isEntered = true;
              this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex]

              this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.forEach(x => {
                x.modifiedReduction = parseFloat(x.reduction as unknown as string).toFixed(2)
                x.modifiedReduction = this.decimalpipe.transform(x.modifiedReduction) as string
              })

              if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length > 0) {
                this.notHideVRCCard = true;
                this.SettingVRCFalse();
                this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[0].isEntered = true;
                this.ValuereductionConfigCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[0];
              }
              else {
                this.notHideVRCCard = false;
              }
            }
            else {
              this.notHideVRCard = false;
              this.lengthError = true;

            }

            this.HideVR = true;
            this.HideVRC = false;
            this.backDisable = false;
            this.saveAndNextDisable = true;

          },
            err => {
              if (err?.error?.errorCode) {
                this.errorCode = err.error.errorCode;
              }
              else {
                this.errorCode = "InternalServiceFault"
              }
              this.spinnerService.setIsLoading(false);
              this.deletedVRRecords = [...new Array<valueReduction>()];
              this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

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
            this.deletedVRRecords = [...new Array<valueReduction>()];
            this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

            this.exceptionBox = true;
          })
      }
      else {
        this.isErrors = true;
        this.VRNameTextBoxconfig.externalError = true;
        this.periodBaseDropdownConfig.externalError = true;
        this.VRCNameTextBoxconfig.externalError = true;
        this.dueTextBoxconfig.externalError = true;
        this.calculationBaseDropdownConfig.externalError = true;
        this.reductionTextBoxconfig.externalError = true;
      }
    }
    else {
      this.lengthBox = true;
    }
  }
  onBackclose() {
    const unsaved = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty 
    })
    if (unsaved != -1 || this.deletedVRCRecords.length > 0) {
      this.backShow = true;
    }
    else {
      this.backShow = false;
      this.back();

    }
  }
  onBackYes(GridData: valueReduction[]) {
    this.backShow = false;

    const filteredVRCData = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.map(item => { return item.name });
    const hasVRCValue = filteredVRCData.some(function (item, index) {
      return filteredVRCData.indexOf(item) != index
    })


    if (hasVRCValue) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {

      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {

          this.deletedVRRecords.push({ ...x })
        }

      })
      console.log(this.deletedVRRecords)
      this.deletedVRRecords.forEach(y => {
        if (y.state == stateModel.Deleted && y.periodBase?.caption == null) {
          y.periodBase = null as unknown as codeTable;
        }
        y.valueReductionConfigs.forEach(x => {
          if (x.state == stateModel.Deleted && x.valueReductionCalculationBase?.caption == null) {
            x.valueReductionCalculationBase = null as unknown as codeTable;
          }

        })

      })


      this.spinnerService.setIsLoading(true);
      this.valueReductionService.PostValueReductionResponse(this.deletedVRRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.show = false;
        this.backShow = false;
        this.deletedVRRecords = [...new Array<valueReduction>()];
        this.deletedVRCRecords = [...new Array<valueReductionConfig>()];
        this.back();
      },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.deletedVRRecords = [...new Array<valueReduction>()];
          this.deletedVRCRecords = [...new Array<valueReductionConfig>()];
         this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.VRNameTextBoxconfig.externalError = true;
      this.periodBaseDropdownConfig.externalError = true;
      this.VRCNameTextBoxconfig.externalError = true;
      this.dueTextBoxconfig.externalError = true;
      this.calculationBaseDropdownConfig.externalError = true;
      this.reductionTextBoxconfig.externalError = true;
    }
  }
  onBackNo() {
    this.backShow = false;
    this.VRNameTextBoxconfig.externalError = false;
    this.periodBaseDropdownConfig.externalError = false;
    this.VRCNameTextBoxconfig.externalError = false;
    this.dueTextBoxconfig.externalError = false;
    this.calculationBaseDropdownConfig.externalError = false;
    this.reductionTextBoxconfig.externalError = false;
    this.RemoveBusinessError(this.businessError);
    this.removeVRCErrors();
    this.removeVRCErrors();
    this.back();

  }
  onBackCancel() {
    this.backShow = false;
  }

  onclose() {
    const unsaved = this.getValueReduction.valueReductionPrincipleList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    if (this.deletedVRRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: valueReduction[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.VRNameTextBoxconfig.externalError = false;
    this.periodBaseDropdownConfig.externalError = false;
    this.VRCNameTextBoxconfig.externalError = false;
    this.dueTextBoxconfig.externalError = false;
    this.calculationBaseDropdownConfig.externalError = false;
    this.reductionTextBoxconfig.externalError = false;
    this.RemoveBusinessError(this.businessError);
    this.removeVRCErrors();
    this.removeVRCErrors();
    //navigate
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  onLengthBox() {
    this.lengthBox = false;
  }

  onSave(GridData: valueReduction[]) {

    const filteredVRCData = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.map(item => { return item.name });
    const VRChasValue = filteredVRCData.some(function (item, index) {
      return filteredVRCData.indexOf(item) != index
    })

    const filteredVRData = this.getValueReduction.valueReductionPrincipleList.map(item => { return item.name });
    const hasValue = filteredVRData.some(function (item, index) {
      return filteredVRData.indexOf(item) != index
    })


    if (VRChasValue || hasValue) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {

      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {

          this.deletedVRRecords.push({ ...x })
        }
        
      })
    console.log(this.deletedVRRecords)
      this.deletedVRRecords.forEach(y => {
        if (y.state == stateModel.Deleted && y.periodBase?.caption == null) {
          y.periodBase = null as unknown as codeTable;
        }
        y.valueReductionConfigs.forEach(x => {
          if (x.state == stateModel.Deleted && x.valueReductionCalculationBase?.caption == null) {
            x.valueReductionCalculationBase = null as unknown as codeTable;
          }
         
        })
        
      })


      this.spinnerService.setIsLoading(true);
      this.valueReductionService.PostValueReductionResponse(this.deletedVRRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
       

          this.show = false;
          this.backShow = false;
          this.deletedVRRecords = [...new Array<valueReduction>()];
          this.deletedVRCRecords = [...new Array<valueReductionConfig>()];


          this.valueReductionService.GetValueReductionResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as getValueReductionResponse
            this.getValueReduction = { ...getResponse };

            this.VRNameTextBoxconfig.externalError = false;
            this.periodBaseDropdownConfig.externalError = false;
            this.VRCNameTextBoxconfig.externalError = false;
            this.dueTextBoxconfig.externalError = false;
            this.calculationBaseDropdownConfig.externalError = false;
            this.reductionTextBoxconfig.externalError = false;
            this.RemoveBusinessError(this.businessError);
            this.removeVRCErrors();
            this.removeVRCErrors();

            if (this.backDisable) {
              if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
                this.lengthError = false;

                this.SettingVRFalse();
                this.ValuereductionIndex = this.getValueReduction.valueReductionPrincipleList.findIndex(i => {
                  return ((i.periodBase?.caption == this.ValueReductionCard.periodBase?.caption) && (i.name == this.ValueReductionCard.name))
                })
                this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].isEntered = true;
                this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex]
              }
              else {
                this.notHideVRCard = false;
                this.lengthError = true;
              }
            }
            else if (this.saveAndNextDisable) {
              if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
                this.lengthError = false;
                this.SettingVRFalse();
                this.ValuereductionIndex = this.getValueReduction.valueReductionPrincipleList.findIndex(i => {
                  return ((i.periodBase?.caption == this.ValueReductionCard.periodBase?.caption) && (i.name == this.ValueReductionCard.name))
                })
                this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].isEntered = true;
                this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex]

                this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.forEach(x => {
                  x.modifiedReduction = parseFloat(x.reduction as unknown as string).toFixed(2)
                  x.modifiedReduction = this.decimalpipe.transform(x.modifiedReduction) as string
                })

                if (this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.length > 0) {
                  this.SettingVRCFalse();
                  this.ValuereductionConfigIndex = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs.findIndex(i => {
                    return ((i.valueReductionCalculationBase?.caption == this.ValuereductionConfigCard.valueReductionCalculationBase?.caption) && (i.name == this.ValuereductionConfigCard.name) &&
                      (i.dueElapsedPeriod == this.ValuereductionConfigCard.dueElapsedPeriod) && (i.reduction == this.ValuereductionConfigCard.reduction))
                  })
                  this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex].isEntered = true;
                  this.ValuereductionConfigCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].valueReductionConfigs[this.ValuereductionConfigIndex]
                }
                else {
                  this.notHideVRCCard = false;
                 }
              }
              else {
                this.notHideVRCard = false;
                this.lengthError = true;
              }
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
              this.deletedVRRecords = [...new Array<valueReduction>()];
              this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

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
          this.deletedVRRecords = [...new Array<valueReduction>()];
          this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

           this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.VRNameTextBoxconfig.externalError = true;
      this.periodBaseDropdownConfig.externalError = true;
      this.VRCNameTextBoxconfig.externalError = true;
      this.dueTextBoxconfig.externalError = true;
      this.calculationBaseDropdownConfig.externalError = true;
      this.reductionTextBoxconfig.externalError = true;

    }
  }

  ngOnInit(): void {
    this.buildConfiguration()

    this.valueHeader = [
      { header: this.translate.instant('financial.valueReduction.tabel.name'), field: 'name', width: '50%' },
      { header: this.translate.instant('financial.valueReduction.tabel.periodBase'), field: 'periodBase.caption', width: '45%' },
      { header: this.translate.instant('financial.valueReduction.tabel.'), field: '', width: '5%',fieldType:'deleteButton' },
    ];

    
    this.valueoHeader = [
      { header: this.translate.instant('financial.valueReduction.tabel.nameo'), field: 'name', width: '25%' },
      { header: this.translate.instant('financial.valueReduction.tabel.CalculationBase'), field: 'valueReductionCalculationBase.caption', width: '25%' },
      { header: this.translate.instant('financial.valueReduction.tabel.DueElapsed'), field: 'dueElapsedPeriod', width: '25%' },
      { header: this.translate.instant('financial.valueReduction.tabel.Percentage'), field: 'modifiedReduction', width: '20%', amountSort:'reduction' },
      { header: this.translate.instant('financial.valueReduction.tabel.'), field: '', width: '5%', fieldType: 'deleteButton' }

    ];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.valueReductionData
        this.getValueReduction = { ...getResponse };
        console.log(this.getValueReduction)
        this.HideVRC = true;
        this.HideVR = false;
        this.backDisable = true;
        this.saveAndNextDisable = false;
        this.deletedVRRecords = [...new Array<valueReduction>()];
        this.deletedVRCRecords = [...new Array<valueReductionConfig>()];

        this.ValuereductionIndex = 0;
        if (this.getValueReduction.valueReductionPrincipleList.length > 0) {
          this.notHideVRCard = true;
          this.lengthError = false;

          this.SettingVRFalse();
          this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex].isEntered = true;
          this.ValueReductionCard = this.getValueReduction.valueReductionPrincipleList[this.ValuereductionIndex];
        }
        else {
          this.notHideVRCard = false;
          this.lengthError = true;

        }
      }
    }
    );
  }

  buildConfiguration() {

    const periodBaseRequired = new ErrorDto;
    periodBaseRequired.validation = "required";
    periodBaseRequired.isModelError = true;
    periodBaseRequired.validationMessage = this.translate.instant('financial.valueReduction.mandatory.PeriodBase') + this.translate.instant('financial.valueReduction.mandatory.required');
    this.periodBaseDropdownConfig.Errors = [periodBaseRequired];
    this.periodBaseDropdownConfig.required = true

    const VRNameRequired = new ErrorDto;
    VRNameRequired.validation = "required";
    VRNameRequired.isModelError = true;
    VRNameRequired.validationMessage = this.translate.instant('financial.valueReduction.mandatory.name') + this.translate.instant('financial.valueReduction.mandatory.required');
    this.VRNameTextBoxconfig.Errors = [VRNameRequired]
    this.VRNameTextBoxconfig.required = true

    const VRCNameRequired = new ErrorDto;
    VRCNameRequired.validation = "required";
    VRCNameRequired.isModelError = true;
    VRCNameRequired.validationMessage = this.translate.instant('financial.valueReduction.mandatory.nameo') + this.translate.instant('financial.valueReduction.mandatory.required');
    this.VRCNameTextBoxconfig.Errors = [VRCNameRequired];
    this.VRCNameTextBoxconfig.required = true

    const calBaseRequired = new ErrorDto;
    calBaseRequired.validation = "required";
    calBaseRequired.isModelError = true;
    calBaseRequired.validationMessage = this.translate.instant('financial.valueReduction.mandatory.CalculationBase') + this.translate.instant('financial.valueReduction.mandatory.required');
    this.calculationBaseDropdownConfig.Errors = [calBaseRequired];
    this.calculationBaseDropdownConfig.required = true

    const dueElapsedRequired = new ErrorDto;
    dueElapsedRequired.validation = "required";
    dueElapsedRequired.isModelError = true;
    dueElapsedRequired.validationMessage = this.translate.instant('financial.valueReduction.mandatory.DueElapse') + this.translate.instant('financial.valueReduction.mandatory.required');
    this.dueTextBoxconfig.Errors = [dueElapsedRequired];
    this.dueTextBoxconfig.required = true

    const reductionRequired = new ErrorDto;
    reductionRequired.validation = "required";
    reductionRequired.isModelError = true;
    reductionRequired.validationMessage = this.translate.instant('financial.valueReduction.mandatory.Reduction') + this.translate.instant('financial.valueReduction.mandatory.required');
    this.reductionTextBoxconfig.Errors = [reductionRequired];
    this.reductionTextBoxconfig.required = true
    this.reductionTextBoxconfig.invalidDefaultValidation = this.translate.instant('financial.valueReduction.mandatory.Reduction') + this.translate.instant('financial.valueReduction.mandatory.required');
  }

}
