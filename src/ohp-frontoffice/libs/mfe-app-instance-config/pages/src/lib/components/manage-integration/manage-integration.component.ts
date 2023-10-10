import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlsBaseService, ErrorDto, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { DtoState, FreeFieldConfig2ListValueDto, FreeFieldConfigDto, GetManageFreeFieldConfigScreenDataResponseDto } from './model/manage-integration.model';
import { ManageIntegrationService } from './service/manage-integration.service';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'maic-manage-integration',
  templateUrl: './manage-integration.component.html',
  styleUrls: ['./manage-integration.component.scss']
})
export class ManageIntegrationComponent implements OnInit {
  @ViewChild("integrationform", { static: true }) integrationform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

  public fieldDescriptionTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public tagNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public fieldTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public fieldCaptionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public servicingOrganizationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public freeFieldLenTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  integrationList!: GetManageFreeFieldConfigScreenDataResponseDto;
  integrationDetail!: FreeFieldConfigDto
  saveIntegrationData: FreeFieldConfigDto[] = []
  onShowDetails!: boolean
  placeholder = 'select';
  validationHeader!: string;
  showDialog!: boolean
  maxValue = 80;
  minValue = 1;
  minErrorDto: ErrorDto[] = []
  maxErrorDto: ErrorDto[] = []
  duplicateFieldName!: string;
  duplicateFieldCaption!: string;
  duplicateTagName!: string;
  navigateUrl!: string
  intMaxValue = 2147483647;
  exceptionBox!: boolean
  errorCode!:string

  IntegrationDataHeader = [
    { header: this.translate.instant('app-instance.manage-integration.tabel.FieldDescription'), field: 'fieldName', width: '30%' },
    { header: this.translate.instant('app-instance.manage-integration.tabel.FieldType'), field: 'fieldType.caption', width: '30%' },
    { header: this.translate.instant('app-instance.manage-integration.tabel.ServicingOrganization'), field: 'servicingOrganization.name.caption', width: '33%' },
    { header: this.translate.instant('app-instance.manage-integration.tabel.delete'), field: 'delete', fieldType: 'customizeDeleteButton', width: '7%' }];

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public service: ManageIntegrationService, private commonService: ConfigContextService, public router: Router,
    public route: ActivatedRoute, private spinnerService: SpinnerService, private fluidValidation: fluidValidationService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');

    this.route.data.subscribe((res:any) => {
      this.spinnerService.setIsLoading(false);
      this.integrationList = res.manageIntegrationData
      if (this.integrationList.freeFieldConfigList.length > 0) {
        this.onShowDetails = true
        this.settingIsSelectedFalse();
        this.integrationList.freeFieldConfigList[0].isSelected = true;
        this.integrationDetail = this.integrationList.freeFieldConfigList[0];
        this.integrationList.freeFieldConfigList.forEach(x => {
          if (x.fieldType?.codeId == 6) {
            x.isListItemVisible = true;
          }
          else {
            x.enablefreeFieldLen = false;
          }
        })
      }
      else {
        this.onShowDetails = false
      }
     

      this.integrationList.freeFieldConfigList.forEach(x => x.hasNoProductCopy = !x.isLinkedToFreeFieldValue)
      this.integrationList.freeFieldConfigList.forEach(x => {
        if (x.fieldType?.codeId == 1) {
          x.enablefreeFieldLen = true;
        }
        else {
          x.enablefreeFieldLen = false;
        }
      })
    }, err => {
      this.spinnerService.setIsLoading(false);
    })
  }

  dataSelection(event: FreeFieldConfigDto) {

    if (this.integrationDetail.state == DtoState.Created && this.integrationDetail.fieldType?.caption == "Text") {
      this.integrationDetail.freeFieldLen = 50;
    }

    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldNameBusinessError') + this.duplicateFieldName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.tagNameBusinessError') + this.duplicateTagName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))

    this.getDuplicateValues();
   
    setTimeout(() => {
      let index;
      if (this.integrationDetail.freeFieldConfig2ListValueList.length > 0) {
        index = this.integrationDetail.freeFieldConfig2ListValueList.findIndex(x => x.isSelected)
      }

      if (this.integrationform.valid && !this.DuplicateFieldCaption() && !this.DuplicateFieldName() && !this.DuplicateTagName() && index != -1) {
        if (event) {

          this.settingIsSelectedFalse();
          this.integrationDetail = event;
          this.integrationDetail.isSelected = true;
        }
      }
      else {
        this.validationCheck()
        if (index == -1 && this.integrationform.valid) {
          this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
        }
      }
    },1)
  }

  getDuplicateValues() {
    let fieldName;
    if (this.DuplicateFieldName()) {
      const valueArr = this.integrationList.freeFieldConfigList.map(function (item) {
        return item.fieldName
      });
      valueArr.some(function (item, idx) {
        if (valueArr.indexOf(item) != idx) {
          fieldName = item;
        }
      });
    }
    if (fieldName != undefined) {
      this.duplicateFieldName = fieldName as unknown as string
    }

    let fieldCaption;
    if (this.DuplicateFieldCaption()) {
      const valueArray = this.integrationList.freeFieldConfigList.map(function (item) {
        return item.freeField?.caption
      });
      valueArray.some(function (item, idx) {
        if (valueArray.indexOf(item) != idx) {
          fieldCaption = item;
        }
      });
    }

    if (fieldCaption != undefined) {
      this.duplicateFieldCaption = fieldCaption as unknown as string
    }

    let tagName;
    if (this.DuplicateTagName()) {
      const value = this.integrationList.freeFieldConfigList.map(function (item) {
        return item.tagName
      });
      value.some(function (item, idx) {
        if (value.indexOf(item) != idx) {
          tagName = item;
        }
      });
    }
    if (tagName != undefined) {
      this.duplicateTagName = tagName as unknown as string
    }
  }

  onSave(integrationData: FreeFieldConfigDto[]) {

    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldNameBusinessError') + this.duplicateFieldName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.tagNameBusinessError') + this.duplicateTagName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.getDuplicateValues();

    let index;
    if (this.integrationDetail.freeFieldConfig2ListValueList.length > 0) {
      index = this.integrationDetail.freeFieldConfig2ListValueList.findIndex(x => x.isSelected)
    }

    if (this.integrationform.valid && !this.DuplicateFieldCaption() && !this.DuplicateFieldName() && !this.DuplicateTagName() && index != -1) {

      integrationData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.saveIntegrationData.push({ ...x });
        }
      })

      this.spinnerService.setIsLoading(true);

      if (this.saveIntegrationData.length > 0) {
        this.service.saveManageIntegration(this.saveIntegrationData).subscribe(res => {
          this.spinnerService.setIsLoading(false);
          this.integrationList.freeFieldConfigList = res as FreeFieldConfigDto[];

          this.integrationList.freeFieldConfigList.forEach(x => x.state = DtoState.Unknown);

          if (this.integrationList.freeFieldConfigList.length > 0) {
            this.onShowDetails = true
          }
          this.settingIsSelectedFalse();
          const index = this.integrationList.freeFieldConfigList.findIndex(x => x.fieldName == this.integrationDetail.fieldName);
          this.integrationList.freeFieldConfigList[index].isSelected = true;
          this.integrationDetail = this.integrationList.freeFieldConfigList[index];
          this.integrationList.freeFieldConfigList.forEach(x => {
            if (x.fieldType?.codeId == 6) {
              x.isListItemVisible = true;
            }
            else {
              x.isListItemVisible = false;
            }
          })

          this.integrationList.freeFieldConfigList.forEach(x => x.hasNoProductCopy = !x.isLinkedToFreeFieldValue)
          this.integrationList.freeFieldConfigList.forEach(x => {
            if (x.fieldType?.codeId == 1) {
              x.enablefreeFieldLen = true;
            }
            else {
              x.enablefreeFieldLen = false;
            }
          })

          this.saveIntegrationData = [];
        }, err => {
          this.spinnerService.setIsLoading(false);
          this.exceptionBox = true;
          if (err?.error?.errorCode) {
            this.errorCode = err?.error?.errorCode;
          }
          else {
            this.errorCode = 'InternalServiceFault';
          }
          this.saveIntegrationData = [];
        });
      }
    }
    else {
      this.validationCheck()
      if (index == -1 && this.integrationform.valid) {
        this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
      }
    }
  }

  addIntegration() {

    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldNameBusinessError') + this.duplicateFieldName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.tagNameBusinessError') + this.duplicateTagName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))

    this.DuplicateFieldName();

    let index ;
    if (this.integrationDetail?.freeFieldConfig2ListValueList.length > 0) {
      index = this.integrationDetail.freeFieldConfig2ListValueList.findIndex(x => x.isSelected)
    }
    if (this.integrationform.valid && !this.DuplicateFieldCaption() && !this.DuplicateFieldName() && !this.DuplicateTagName() && index != -1) {

      this.onShowDetails = true;
      this.settingIsSelectedFalse();
      const newRow = new FreeFieldConfigDto;
      newRow.servicingOrganization = this.integrationList.manageFreeFieldConfigInitialData.servicingOrganizationList[0];
      newRow.isSelected = true
      newRow.hasNoProductCopy = true;
      const newuserList = this.integrationList.freeFieldConfigList;
      newuserList.push({ ...newRow });
      this.integrationDetail = new FreeFieldConfigDto();
      this.integrationList.freeFieldConfigList = [...newuserList];

      this.integrationDetail.pKey = 0;
      this.integrationDetail.state = DtoState.Created;
      this.integrationDetail.servicingOrganization = this.integrationList.manageFreeFieldConfigInitialData.servicingOrganizationList[0];
      this.integrationDetail.isSelected = true
      this.integrationDetail.hasNoProductCopy = true;

      this.integrationList.freeFieldConfigList[this.integrationList.freeFieldConfigList.length - 1] = this.integrationDetail;
    }
    else {
      this.validationCheck();
      if (index == -1 && this.integrationform.valid) {
        this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
      }
    }
  }

  onRowDelete(event: FreeFieldConfigDto, gridData: FreeFieldConfigDto[]) {

    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldNameBusinessError') + this.duplicateFieldName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.tagNameBusinessError') + this.duplicateTagName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))

    this.getDuplicateValues();

    let index;
    if (this.integrationDetail.freeFieldConfig2ListValueList.length > 0) {
      index = this.integrationDetail.freeFieldConfig2ListValueList.findIndex(x => x.isSelected)
    }
    if ((this.integrationform.valid && !this.DuplicateFieldName() && !this.DuplicateFieldCaption() && !this.DuplicateFieldCaption() && index != -1) || event.fieldName == "" || event.fieldName == undefined || event.servicingOrganization == null ||
      event.servicingOrganization == undefined || event.fieldType == null || event.fieldType == undefined || event.freeField == null ||
      event.freeField == undefined || event.tagName == "" || event.tagName == undefined || event.freeFieldLen == null || event.freeFieldLen == undefined ||
       (this.DuplicateTagName() && event.isSelected) ||
      (this.DuplicateFieldCaption() && event.isSelected) || (this.DuplicateTagName() && event.isSelected) || (index == -1 && event.isSelected)) {

      
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      if (this.integrationList.freeFieldConfigList[deletedata].state != DtoState.Created) {
        event.state = DtoState.Deleted;
        this.saveIntegrationData.push({ ...event });
      }
      gridData.splice(deletedata, 1);
      this.integrationList.freeFieldConfigList = [...gridData]
      if (this.integrationList.freeFieldConfigList.length > 0) {
        this.settingIsSelectedFalse();
        if (event.state == DtoState.Created) {
          let index : string;
          this.integrationList.freeFieldConfigList.forEach(x => {
            if (x.isLinkedToFreeFieldValue) {
              index = x.fieldName;
            }
          })
          const lastIndex = this.integrationList.freeFieldConfigList.findIndex(x => x.fieldName == index);
          this.integrationList.freeFieldConfigList[lastIndex].isSelected = true;
          this.integrationDetail = this.integrationList.freeFieldConfigList[lastIndex];
        }
        else {
          this.integrationList.freeFieldConfigList.forEach(x => {
            if (x == this.integrationList.freeFieldConfigList[0]) {
              x.isSelected = true;
            }
          })
          this.integrationDetail = this.integrationList.freeFieldConfigList[0];
        }
      }
      if (this.integrationList.freeFieldConfigList.length == 0) {
        this.fieldDescriptionTextBoxconfig.externalError = false
        this.freeFieldLenTextBoxconfig.externalError = false
        this.servicingOrganizationDropdownConfig.externalError = false
        this.fieldTypeDropdownConfig.externalError = false
        this.fieldCaptionDropdownConfig.externalError = false
        this.tagNameTextBoxconfig.externalError = false
        setTimeout(() => {
          this.onShowDetails = false;
        }, 10);
      }
    }
  }

  validationCheck() {
    if (this.integrationDetail.fieldName == "" || this.integrationDetail.fieldName == undefined) {
      this.fieldDescriptionTextBoxconfig.externalError = true;
    }
    if (this.integrationDetail.freeFieldLen == "" as unknown as number || this.integrationDetail.freeFieldLen == undefined) {
      this.freeFieldLenTextBoxconfig.externalError = true;
    }
    if (this.integrationDetail.servicingOrganization == null || this.integrationDetail.servicingOrganization == undefined) {
      this.servicingOrganizationDropdownConfig.externalError = true;
    }
    if (this.integrationDetail.fieldType == null || this.integrationDetail.fieldType == undefined) {
      this.fieldTypeDropdownConfig.externalError = true;
    }
    if (this.integrationDetail.freeField == null || this.integrationDetail.freeField == undefined) {
      this.fieldCaptionDropdownConfig.externalError = true;
    }
    if (this.integrationDetail.tagName == "" || this.integrationDetail.tagName == undefined) {
      this.tagNameTextBoxconfig.externalError = true;
    }
    if (this.DuplicateFieldName()) {
      this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldNameBusinessError') + this.duplicateFieldName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    }
    if (this.DuplicateFieldCaption()) {
      this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    }
    if (this.DuplicateTagName()) {
      this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.tagNameBusinessError') + this.duplicateTagName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    }
  }

  DuplicateFieldName(): boolean {
    const valueArr = this.integrationList.freeFieldConfigList.map(function (item) {
      return item.fieldName
    });
    return valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
  }

  DuplicateFieldCaption(): boolean {
    const valueArr = this.integrationList.freeFieldConfigList.map(function (item) {
      return item.freeField?.caption
    });
    return valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
  }

  DuplicateTagName(): boolean {
    const valueArr = this.integrationList.freeFieldConfigList.map(function (item) {
      return item.tagName
    });
    return valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
  }

  onChangeFieldName(event: any) {

    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (index != -1) {
      if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
        this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
      this.integrationList.freeFieldConfigList[index].fieldName = event?.target?.value;
    }

    this.integrationDetail.fieldName = event?.target?.value;
    if (event?.target?.value == "") {
      this.fieldDescriptionTextBoxconfig.externalError = true;
    }

    if (this.integrationDetail.tagName == undefined) {
      this.integrationList.freeFieldConfigList[index].tagName = event?.target?.value;
      this.integrationDetail.tagName = event?.target?.value;
    }

    if (this.DuplicateFieldCaption()) {
      this.getDuplicateValues();
      this.throwBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    }
    else {
      this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    }
  }

  onChangeServicingOrganization(event: any) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (index != -1) {
      if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
        this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
      this.integrationList.freeFieldConfigList[index].servicingOrganization = event?.value;
    }
    this.integrationDetail.servicingOrganization = event?.value;
    if (event?.value == null) {
      this.servicingOrganizationDropdownConfig.externalError = true;
    }
  }

  onChangeFieldType(event:any) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (index != -1) {
      if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
        this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
      this.integrationList.freeFieldConfigList[index].fieldType = event?.value;
      if (event?.value?.codeId == 6) {
        for (let i = 0; i < this.integrationList.manageFreeFieldConfigInitialData.freeFieldListValueList.length; i++) {
          this.integrationDetail.freeFieldConfig2ListValueList.push(new FreeFieldConfig2ListValueDto());
          this.integrationDetail.freeFieldConfig2ListValueList[i].listValue = { ...this.integrationList.manageFreeFieldConfigInitialData.freeFieldListValueList[i] };
          this.integrationDetail.freeFieldConfig2ListValueList[i].isSelected = false;
        }
      
        this.integrationDetail.isListItemVisible = true;
      }
      else {
        this.integrationDetail.freeFieldConfig2ListValueList = [];
        this.integrationDetail.isListItemVisible = false;
      }
      if (event?.value?.codeId == 1) {
        this.integrationDetail.enablefreeFieldLen = true;
        this.freeFieldLenTextBoxconfig.externalError = false;
        if (this.integrationDetail.state == DtoState.Created) {
          this.freeFieldLenTextBoxconfig.externalError = false;
          this.integrationList.freeFieldConfigList[index].freeFieldLen = 50;
          this.integrationDetail.freeFieldLen = 50;
        }
      }
      else {
        this.integrationDetail.enablefreeFieldLen = false;
        this.integrationList.freeFieldConfigList[index].freeFieldLen = null as unknown as number;
        this.integrationDetail.freeFieldLen = null as unknown as number;
      }
    }
    this.integrationDetail.fieldType = event?.value;
    if (event?.value == null) {
      this.fieldTypeDropdownConfig.externalError = true;
    }
  }

  onChangeFreeFieldLength(event:any) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
      this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
    if (event != null && event != '0') {
      if (index != -1) {
        this.integrationList.freeFieldConfigList[index].freeFieldLen = parseInt(event);
      }
      this.integrationDetail.freeFieldLen = parseInt(event);
      if (parseInt(event) > 80) {
          this.freeFieldLenTextBoxconfig.externalError = true;
      }
    }
    else {
      this.freeFieldLenTextBoxconfig.externalError = true;
    }
  }

  onChangeFieldCaption(event:any) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
      this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
    if (index != -1) {
      this.integrationList.freeFieldConfigList[index].freeField = event?.value;
    }
    this.integrationDetail.freeField = event?.value;
    if (event?.value == null) {
      this.fieldCaptionDropdownConfig.externalError = true;
    }
  }

  onChangeSequence(event: any) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
      this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
    if (event != null) {
      if (index != -1) {
        this.integrationList.freeFieldConfigList[index].sequence = parseInt(event);
      }
      this.integrationDetail.sequence = parseInt(event);
      setTimeout(() => {
        if (this.integrationDetail.sequence as number > this.intMaxValue) {
          this.integrationList.freeFieldConfigList[index].sequence = null;
          this.integrationDetail.sequence = null;
        }
        },2)
    }
    else {
      this.integrationList.freeFieldConfigList[index].sequence = null;
      this.integrationDetail.sequence = null;
    }
  }

  onChangeTagName(event:any) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (index != -1) {
      if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
        this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
      this.integrationList.freeFieldConfigList[index].tagName = event?.target?.value;
    }
    this.integrationDetail.tagName = event?.target?.value;
    if (event == "") {
      this.tagNameTextBoxconfig.externalError = true;
    }
  }

  onChangeisSelected(event: boolean,freeFieldConfigindex:number) {
    const index = this.integrationList.freeFieldConfigList.findIndex(x => x.isSelected)
    if (index != -1) {
      if (this.integrationList.freeFieldConfigList[index].state == DtoState.Unknown)
        this.integrationList.freeFieldConfigList[index].state = DtoState.Dirty;
      this.integrationList.freeFieldConfigList[index].freeFieldConfig2ListValueList[freeFieldConfigindex].isSelected = event;
    }
    this.integrationDetail.freeFieldConfig2ListValueList[freeFieldConfigindex].isSelected = event;
  }

  settingIsSelectedFalse() {
    this.integrationList.freeFieldConfigList.forEach(x => x.isSelected = false);
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

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.integrationList.freeFieldConfigList.findIndex(x => x.state == DtoState.Created || x.state == DtoState.Dirty);
    if (this.saveIntegrationData.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(integrationList: FreeFieldConfigDto[]) {
    this.showDialog = false;
      this.onSave(integrationList);
      setTimeout(() => {
        if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
          window.location.assign(this.navigateUrl);
        }
      }, 100)
  }

  onClickNo() {
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.oneListItems'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldNameBusinessError') + this.duplicateFieldName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.fieldCaptionBusinessError') + this.duplicateFieldCaption + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-integration.validationErrors.tagNameBusinessError') + this.duplicateTagName + this.translate.instant('app-instance.manage-integration.validationErrors.duplicateMessage'))
    this.fieldDescriptionTextBoxconfig.externalError = false
    this.freeFieldLenTextBoxconfig.externalError = false
    this.servicingOrganizationDropdownConfig.externalError = false
    this.fieldTypeDropdownConfig.externalError = false
    this.fieldCaptionDropdownConfig.externalError = false
    this.tagNameTextBoxconfig.externalError = false

    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }
  onClickCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {
    const fieldNamerequiredError = new ErrorDto;
    fieldNamerequiredError.validation = "required";
    fieldNamerequiredError.isModelError = true;
    fieldNamerequiredError.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.FieldName');
    this.fieldDescriptionTextBoxconfig.required = true;
    this.fieldDescriptionTextBoxconfig.Errors = [fieldNamerequiredError];

    const fieldTyperequiredError = new ErrorDto;
    fieldTyperequiredError.validation = "required";
    fieldTyperequiredError.isModelError = true;
    fieldTyperequiredError.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.FieldType');
    this.fieldTypeDropdownConfig.required = true;
    this.fieldTypeDropdownConfig.Errors = [fieldTyperequiredError];

    const fieldCaptionrequiredError = new ErrorDto;
    fieldCaptionrequiredError.validation = "required";
    fieldCaptionrequiredError.isModelError = true;
    fieldCaptionrequiredError.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.FieldCaption');
    this.fieldCaptionDropdownConfig.required = true;
    this.fieldCaptionDropdownConfig.Errors = [fieldCaptionrequiredError];

    const tagNamerequiredError = new ErrorDto;
    tagNamerequiredError.validation = "required";
    tagNamerequiredError.isModelError = true;
    tagNamerequiredError.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.TagName');
    this.tagNameTextBoxconfig.required = true;
    this.tagNameTextBoxconfig.Errors = [tagNamerequiredError];

    const servicingOrganizationrequiredError = new ErrorDto;
    servicingOrganizationrequiredError.validation = "required";
    servicingOrganizationrequiredError.isModelError = true;
    servicingOrganizationrequiredError.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.ServicingOrganization');
    this.servicingOrganizationDropdownConfig.required = true;
    this.servicingOrganizationDropdownConfig.Errors = [servicingOrganizationrequiredError];

    const minLimitValidation = new ErrorDto;
    minLimitValidation.validation = "maxError";
    minLimitValidation.isModelError = true;
    minLimitValidation.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.LengthLimit');
    this.minErrorDto = [minLimitValidation];
    const minLimitError = new ErrorDto;
    minLimitError.validation = "required";
    minLimitError.isModelError = true;
    this.freeFieldLenTextBoxconfig.required = true;
    this.freeFieldLenTextBoxconfig.Errors = [minLimitError];
    this.freeFieldLenTextBoxconfig.invalidDefaultValidation = this.translate.instant('app-instance.manage-integration.validationErrors.LengthLimit');

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.LengthLimit');
    this.maxErrorDto = [maxLimitValidation];
    const maxLimitError = new ErrorDto;
    maxLimitError.validation = "required";
    maxLimitError.isModelError = true;
    this.freeFieldLenTextBoxconfig.required = true;
    maxLimitError.validationMessage = this.translate.instant('app-instance.manage-integration.validationErrors.Length');
    this.freeFieldLenTextBoxconfig.Errors = [maxLimitError];
    this.freeFieldLenTextBoxconfig.maxValueValidation = this.translate.instant('app-instance.manage-integration.validationErrors.LengthLimit');
  }
}
