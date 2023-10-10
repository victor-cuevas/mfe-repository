import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { RevisionPeriodService } from './Service/revision-period-service.service';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { revisionPeriodDefList } from './Models/revisionPeriodDefList.model';
import { ActivatedRoute } from '@angular/router';
import { revisionPeriodDef } from './Models/revisionPeriodDef.model';
import { stateModel } from './Models/state.model';
import { codeTable } from '../general/Models/codeTable.model';



@Component({
  selector: 'maic-revision-period-definition',
  templateUrl: './revision-period-definition.component.html',
  styleUrls: ['./revision-period-definition.component.scss']
})
export class RevisionPeriodDefinitionComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public periodInYearsTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public revisionPeriodDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public revisionPeriodTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

  placeholder = 'select';
  Header = this.translate.instant('app-instance.validation.validationHeader');
  index: any
  revisionPeriodResponse!: revisionPeriodDefList
  revisionPeriodCard!: revisionPeriodDef
  RevisionHeader!: any[];
  deletedRecords: revisionPeriodDef[] = []
  revisonperiodDup: revisionPeriodDef[] = []
  Nothide!: boolean
  maxvalue = 2147483647;
  show!: boolean
  exceptionBox!: boolean
  isErrors!: boolean
  navigateUrl!: string
  errorCode!:string
  businessError="Only one revision period definition can be specified for the same revision period type and revision period"


  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public revisionPeriodService: RevisionPeriodService, public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  SettingFalse() {
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList.length > 0) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList.forEach(x => {
        x.isEntered = false;
      })
    }

  }

  isBusinessError(): boolean {

    this.revisonperiodDup = this.revisionPeriodResponse.revisionPeriodDefinitionList.reduce((array: revisionPeriodDef[], current) => {
      if ((
        !array.some(
          (item: revisionPeriodDef) => item.revisionPeriodType?.caption == current.revisionPeriodType?.caption &&
            item.revisionPeriod?.caption == current.revisionPeriod?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.revisonperiodDup.length != this.revisionPeriodResponse.revisionPeriodDefinitionList.length) {

      return true;
    }
    else {

      this.revisonperiodDup = [];
      return false;
    }

  }


  clickGrid(dataselected: revisionPeriodDef) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        
        this.SettingFalse();
        this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(item => {
          return item == dataselected
        })
        this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isEntered = true;
        this.revisionPeriodCard = dataselected;
        this.RemoveBusinessError(this.businessError);
        this.visibilityForStartsOnNextQuarter();
      }
      else {
        this.revisionPeriodDropdownConfig.externalError = true;
        this.revisionPeriodTypeDropdownConfig.externalError = true;
        this.periodInYearsTextBoxconfig.externalError = true;
        
      }
    }
  }

  addRow() {

    if ((this.userDetailsform.valid) ||
      this.revisionPeriodResponse.revisionPeriodDefinitionList.length == 0) {

       if (!this.isBusinessError()) {
      const revisionPeriodObj = new revisionPeriodDef();
      this.SettingFalse();
      revisionPeriodObj.isEntered = true;
      revisionPeriodObj.state = stateModel.Created;
      revisionPeriodObj.pKey = 0;
      revisionPeriodObj.canValidate = false;
      revisionPeriodObj.rowVersion = 0;
     revisionPeriodObj.modifiedPeriodInMonths = "N/A"
      revisionPeriodObj.modifiedPeriodInYears = "N/A"
    const newlist = this.revisionPeriodResponse.revisionPeriodDefinitionList;
      newlist.push({ ...revisionPeriodObj });
      this.revisionPeriodResponse.revisionPeriodDefinitionList = [...newlist];
      this.userDetailsform.resetForm();
      this.revisionPeriodCard = new revisionPeriodDef();
      this.revisionPeriodCard = this.revisionPeriodResponse.revisionPeriodDefinitionList[this.revisionPeriodResponse.revisionPeriodDefinitionList.length - 1]
      this.Nothide = true;
      this.RemoveBusinessError(this.businessError)
      this.revisionPeriodDropdownConfig.externalError = false;
      this.revisionPeriodTypeDropdownConfig.externalError = false;
      this.periodInYearsTextBoxconfig.externalError = false;

      }
      else {
       this.throwBusinessError(this.businessError)
      }

    }
    else {
      this.revisionPeriodDropdownConfig.externalError = true;
      this.revisionPeriodTypeDropdownConfig.externalError = true;
      this.periodInYearsTextBoxconfig.externalError = true;

      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: revisionPeriodDef, array: revisionPeriodDef[]) {


    if (this.userDetailsform.valid || ((event.revisionPeriod?.caption == null || event.revisionPeriodType?.caption == null ||
      event.periodInYears == null) && event.isEntered)) {
    const deletedata = array.findIndex(data => {
      return data == event;
    })
    console.log(deletedata)

    if (event.state != stateModel.Created) {
      event.state = stateModel.Deleted;
      this.deletedRecords.push({ ...event })
    }
    array.splice(deletedata, 1);
    this.revisionPeriodResponse.revisionPeriodDefinitionList = [...array];
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList.length == 0) {
      setTimeout(() => {
        this.Nothide = false;
      }, 5);
     
    }
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList.length > 0) {
      this.SettingFalse();
      this.revisionPeriodCard = this.revisionPeriodResponse.revisionPeriodDefinitionList[this.revisionPeriodResponse.revisionPeriodDefinitionList.length - 1]
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.revisionPeriodResponse.revisionPeriodDefinitionList.length - 1].isEntered = true;
      this.visibilityForStartsOnNextQuarter();
    }
    this.RemoveBusinessError(this.businessError);
    this.revisionPeriodDropdownConfig.externalError = false;
    this.revisionPeriodTypeDropdownConfig.externalError = false;
    this.periodInYearsTextBoxconfig.externalError = false;

    }
    else {
    this.revisionPeriodDropdownConfig.externalError = true;
    this.revisionPeriodTypeDropdownConfig.externalError = true;
    this.periodInYearsTextBoxconfig.externalError = true;
    }

  }



  changeRevisionPeriod(event: any) {

    this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state == stateModel.Unknown) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.revisionPeriodCard.revisionPeriod = event?.value;
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriod = event?.value;
      this.visibilityForStartsOnNextQuarter()
    }
    else {
      this.revisionPeriodCard.revisionPeriod = null as unknown as codeTable;
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriod = null as unknown as codeTable;
      this.RemoveBusinessError(this.businessError)
      this.revisionPeriodDropdownConfig.externalError = true;
    }
  }

  changeRevisionPeriodType(event: any) {

    this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state == stateModel.Unknown) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.revisionPeriodCard.revisionPeriodType = event?.value;
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriodType = event?.value;

      if (this.revisionPeriodCard.revisionPeriodType.codeId == 1) {

        this.revisionPeriodCard.isRevisionPeriodEditable = false;
        this.revisionPeriodCard.isRevisionPeriodTypeRateRevision = false;
        this.revisionPeriodCard.isRevisionPeriodTypeVariable = false;

        const fixedIndex = this.revisionPeriodResponse.revisionPeriodList.findIndex(x => {
          return x.codeId == 12
        })
        if (fixedIndex != -1) {
          this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriod = this.revisionPeriodResponse.revisionPeriodList[fixedIndex]

        }
      }
      else if (this.revisionPeriodCard.revisionPeriodType.codeId == 3) {
        this.revisionPeriodCard.isRevisionPeriodEditable = true;
        this.revisionPeriodCard.isRevisionPeriodTypeRateRevision = true;
        this.revisionPeriodCard.isRevisionPeriodTypeVariable = false;
      }
      else {
        this.revisionPeriodCard.isRevisionPeriodEditable = true;
        this.revisionPeriodCard.isRevisionPeriodTypeRateRevision = false;
        this.revisionPeriodCard.isRevisionPeriodTypeVariable = true;
      }
      this.visibilityForStartsOnNextQuarter();
    }
    else {
      this.revisionPeriodCard.isRevisionPeriodEditable = false;
      this.revisionPeriodCard.isRevisionPeriodTypeRateRevision = false;
      this.revisionPeriodCard.isRevisionPeriodTypeVariable = false;
      this.revisionPeriodCard.revisionPeriodType = null as unknown as codeTable;
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriodType = null as unknown as codeTable;
      this.RemoveBusinessError(this.businessError)
      this.revisionPeriodTypeDropdownConfig.externalError = true;
    }
    this.revisionPeriodCard.periodInMonths = null as unknown as number
    this.revisionPeriodCard.periodInYears = null as unknown as number
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInYears = null as unknown as number
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInMonths = "N/A"
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInYears = "N/A"
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInMonths = null as unknown as number
    this.revisionPeriodCard.isAllowedForRateRevision = false;
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isAllowedForRateRevision = false;

    if (this.revisionPeriodCard.isRevisionPeriodEditable || this.revisionPeriodCard.revisionPeriodType == null) {
      this.revisionPeriodCard.revisionPeriod = null as unknown as codeTable
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriod = null as unknown as codeTable
    }
    this.removeErrors();
    this.RemoveBusinessError(this.businessError);
    this.revisionPeriodDropdownConfig.externalError = false;
    this.revisionPeriodTypeDropdownConfig.externalError = false;
    this.periodInYearsTextBoxconfig.externalError = false;
  }

  changePeriodInYears(event: any) {

    this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state == stateModel.Unknown) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state = stateModel.Dirty;
    }

    if (event != null && event != '0' && event <= this.maxvalue) {

      this.revisionPeriodCard.periodInYears = parseInt(event);
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInYears = parseInt(event)
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInYears = event
    
    }
    else {
      if (event > this.maxvalue) {
        this.revisionPeriodCard.periodInYears = event;
       
        setTimeout(() => {
          this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInYears = null as unknown as number
          this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInYears = "N/A"
          this.revisionPeriodCard.periodInYears = null as unknown as number;
          this.periodInYearsTextBoxconfig.externalError = true;
        }, 10)
      }
      else {

        this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInYears = "0"
        this.periodInYearsTextBoxconfig.externalError = true;
      }
      
      
    }
  }

  changePeriodInMonths(event: any) {

    this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state == stateModel.Unknown) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state = stateModel.Dirty;
    }
    if (event != null && event <= this.maxvalue) {

      this.revisionPeriodCard.periodInMonths = parseInt(event);
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInMonths = parseInt(event)
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInMonths = event
    }
    else {
      if (event > this.maxvalue) {
        this.revisionPeriodCard.periodInMonths = event;
        setTimeout(() => {
          this.revisionPeriodCard.periodInMonths = null as unknown as number;
          this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInMonths = null as unknown as number
          this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInMonths = "N/A";
        },10)
        }
      else {
        this.revisionPeriodCard.periodInMonths = event;
        this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].periodInMonths = event
        this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].modifiedPeriodInMonths = "N/A";
      }
     
    }
  }

  visibilityForStartsOnNextQuarter() {
   
    if ((this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriodType != null &&
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriod != null) &&
      (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriodType.codeId == 2 &&
        this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriod.codeId == 19)) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isStartsOnNextQuarterVisible = true;
      this.revisionPeriodCard.isStartsOnNextQuarterVisible = true;
    }
    else {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isStartsOnNextQuarterVisible = false;
      this.revisionPeriodCard.isStartsOnNextQuarterVisible = false;
      this.revisionPeriodCard.revisionPeriodStartsOnNextQuarter = false;
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriodStartsOnNextQuarter = false;
    }
  }

  changeAllowedForRateRevision(event: boolean) {

    this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state == stateModel.Unknown) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state = stateModel.Dirty;
    }
    this.revisionPeriodCard.isAllowedForRateRevision = event;
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isAllowedForRateRevision = event
  }

  changeStartOnNextQuarter(event: boolean) {

    this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state == stateModel.Unknown) {
      this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].state = stateModel.Dirty;
    }
    this.revisionPeriodCard.revisionPeriodStartsOnNextQuarter = event;
    this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].revisionPeriodStartsOnNextQuarter = event;
  }

  removeErrors() {
    const removeRevsionPeriodErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('app-instance.revision-period.mandatory.RevisionPeriod') + this.translate.instant('app-instance.revision-period.mandatory.required')

    );

    if (removeRevsionPeriodErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeRevsionPeriodErrors, 1);

    }

    const removeRevisionperiodTypeErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('app-instance.revision-period.mandatory.RevisionPT') + this.translate.instant('app-instance.revision-period.mandatory.required')

    );

    if (removeRevisionperiodTypeErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeRevisionperiodTypeErrors, 1);

    }

    const removePeriodInYearsErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('app-instance.revision-period.mandatory.PeriodInYears') + " must be greater than zero"

    );

    if (removePeriodInYearsErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePeriodInYearsErrors, 1);

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
    this.RevisionHeader = [
      { header: this.translate.instant('app-instance.revision-period.tabel.RevisionPeriod'), field: 'revisionPeriodType.caption', width: '25%' },
      { header: this.translate.instant('app-instance.revision-period.tabel.RevisionP'), field: 'revisionPeriod.caption', width: '25%' },
      { header: this.translate.instant('app-instance.revision-period.tabel.PeriodInYears'), field: 'modifiedPeriodInYears', width: '25%' },
      { header: this.translate.instant('app-instance.revision-period.tabel.PeriodInMonths'), field: 'modifiedPeriodInMonths', width: '15%' },
      { header: this.translate.instant('app-instance.revision-period.tabel.delete'), field: 'delete', width: '10%', fieldType: 'deleteButton' }];

    this.onInitCall();

  }

  onclose() {
    const unsaved = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(x => {
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
  onYes(GridData: revisionPeriodDef[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.removeErrors();
    this.RemoveBusinessError(this.businessError);
    this.revisionPeriodDropdownConfig.externalError = false;
    this.revisionPeriodTypeDropdownConfig.externalError = false;
    this.periodInYearsTextBoxconfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  onInitCall() {
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      if (res) {
        const getResponse = res.revisionPeriodData
        this.revisionPeriodResponse = { ...getResponse } as revisionPeriodDefList;
        this.revisionPeriodResponse.revisionPeriodDefinitionList = [...getResponse.revisionPeriodDefinitionList]
        console.log(this.revisionPeriodResponse);
        this.deletedRecords = [...new Array<revisionPeriodDef>()];
        this.index = 0;
        if (this.revisionPeriodResponse.revisionPeriodDefinitionList.length > 0) {
          this.Nothide = true;
          this.revisionPeriodResponse.revisionPeriodDefinitionList.forEach(x => {

            if (x.revisionPeriodType.codeId == 1) {

              x.isRevisionPeriodEditable = false;
              x.isRevisionPeriodTypeRateRevision = false;
              x.isRevisionPeriodTypeVariable = false;
            }
            else if (x.revisionPeriodType.codeId == 3) {
              x.isRevisionPeriodEditable = true;
              x.isRevisionPeriodTypeRateRevision = true;
              x.isRevisionPeriodTypeVariable = false;
            }
            else {
              x.isRevisionPeriodEditable = true;
              x.isRevisionPeriodTypeRateRevision = false;
              x.isRevisionPeriodTypeVariable = true;
            }


            if (x.periodInYears == null) {
              x.modifiedPeriodInYears = "N/A";
            }
            else {
              x.modifiedPeriodInYears = x.periodInYears.toString();
            }
            if (x.periodInMonths == null) {
              x.modifiedPeriodInMonths = "N/A";
            }
            else {
              x.modifiedPeriodInMonths = x.periodInMonths.toString();
            }
             
          })
          this.SettingFalse();
          this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isEntered = true;
          this.revisionPeriodCard = this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index];
          this.visibilityForStartsOnNextQuarter();
        }
      }
    })
  }

  onSave(GridData: revisionPeriodDef[]) {

    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {
      this.RemoveBusinessError(this.businessError)
      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x })
        }

      })
      
      this.deletedRecords.forEach(y => {
        if (y.state == stateModel.Deleted && y.revisionPeriod?.caption == null) {
          y.revisionPeriod = null as unknown as codeTable;
        }
        if (y.state == stateModel.Deleted && y.revisionPeriodType?.caption == null) {
          y.revisionPeriodType = null as unknown as codeTable;
        }
        
      })
      console.log(this.deletedRecords);

      this.spinnerService.setIsLoading(true);
      this.revisionPeriodService.PutRevisionPeriodResponse(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {
           this.show = false;
          this.deletedRecords = [...new Array<revisionPeriodDef>()];
          this.revisionPeriodResponse.revisionPeriodDefinitionList = [...res as revisionPeriodDef[]]

          console.log(this.revisionPeriodResponse.revisionPeriodDefinitionList )
          if (this.revisionPeriodResponse.revisionPeriodDefinitionList.length > 0) {
            this.Nothide = true;
            this.revisionPeriodResponse.revisionPeriodDefinitionList.forEach(x => {

              if (x.revisionPeriodType.codeId == 1) {

                x.isRevisionPeriodEditable = false;
                x.isRevisionPeriodTypeRateRevision = false;
                x.isRevisionPeriodTypeVariable = false;
              }
              else if (x.revisionPeriodType.codeId == 3) {
                x.isRevisionPeriodEditable = true;
                x.isRevisionPeriodTypeRateRevision = true;
                x.isRevisionPeriodTypeVariable = false;
              }
              else {
                x.isRevisionPeriodEditable = true;
                x.isRevisionPeriodTypeRateRevision = false;
                x.isRevisionPeriodTypeVariable = true;
              }


              if (x.periodInYears == null) {
                x.modifiedPeriodInYears = "N/A";
              }
              else {
                x.modifiedPeriodInYears = x.periodInYears.toString();
              }
              if (x.periodInMonths == null) {
                x.modifiedPeriodInMonths = "N/A";
              }
              else {
                x.modifiedPeriodInMonths = x.periodInMonths.toString();
              }
              
            })
            this.revisionPeriodDropdownConfig.externalError = false;
            this.revisionPeriodTypeDropdownConfig.externalError = false;
            this.periodInYearsTextBoxconfig.externalError = false;

            this.index = this.revisionPeriodResponse.revisionPeriodDefinitionList.findIndex(i => {
              return ((i.revisionPeriod?.caption == this.revisionPeriodCard.revisionPeriod?.caption) && (i.revisionPeriodType?.caption == this.revisionPeriodCard.revisionPeriodType?.caption)) 
            })
            this.SettingFalse();
            this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index].isEntered = true;
            this.revisionPeriodCard = this.revisionPeriodResponse.revisionPeriodDefinitionList[this.index];
            this.visibilityForStartsOnNextQuarter();
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
          this.deletedRecords = [...new Array<revisionPeriodDef>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.revisionPeriodDropdownConfig.externalError = true;
      this.revisionPeriodTypeDropdownConfig.externalError = true;
      this.periodInYearsTextBoxconfig.externalError = true;

    }
  }

  buildConfiguration() {
    const revisionPeriodRequired = new ErrorDto;
    revisionPeriodRequired.validation = "required";
    revisionPeriodRequired.isModelError = true;
    revisionPeriodRequired.validationMessage = this.translate.instant('app-instance.revision-period.mandatory.RevisionPeriod') + this.translate.instant('app-instance.revision-period.mandatory.required');
    this.revisionPeriodDropdownConfig.Errors = [revisionPeriodRequired];
    this.revisionPeriodDropdownConfig.required = true

    const revisionPeriodTypeRequired = new ErrorDto;
    revisionPeriodTypeRequired.validation = "required";
    revisionPeriodTypeRequired.isModelError = true;
    revisionPeriodTypeRequired.validationMessage = this.translate.instant('app-instance.revision-period.mandatory.RevisionPT') + this.translate.instant('app-instance.revision-period.mandatory.required');
    this.revisionPeriodTypeDropdownConfig.Errors = [revisionPeriodTypeRequired];
    this.revisionPeriodTypeDropdownConfig.required = true

    
    const periodInYearsRequired = new ErrorDto;
    periodInYearsRequired.validation = "required";
    periodInYearsRequired.isModelError = true;
    periodInYearsRequired.validationMessage = this.translate.instant('app-instance.revision-period.mandatory.PeriodInYears') + " must be greater than zero";
    this.periodInYearsTextBoxconfig.Errors = [periodInYearsRequired];
    this.periodInYearsTextBoxconfig.invalidDefaultValidation = this.translate.instant('app-instance.revision-period.mandatory.PeriodInYears') + "must be greater than zero";
    this.periodInYearsTextBoxconfig.required = true
  }

}
