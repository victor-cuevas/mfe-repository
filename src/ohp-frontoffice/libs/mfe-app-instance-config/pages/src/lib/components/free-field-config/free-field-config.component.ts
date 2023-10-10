import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, ErrorDto, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FreeFieldConfigService } from './service/free-field-config.service';
import { CmFreeFieldConfig2FreeFieldContextSubTypeValueDto, CmFreeFieldConfig2ListValueDto, CmFreeFieldConfigDto, DtoState, GetFreeFieldConfigScreenDto } from './models/free-field-config.model';
import { CodeTable } from '../manage-credit-provider/model/credit-provider.model';

@Component({
  selector: 'maic-free-field-config',
  templateUrl: './free-field-config.component.html',
  styleUrls: ['./free-field-config.component.scss']
})
export class FreeFieldConfigComponent implements OnInit {
  @ViewChild("freeFieldform", { static: true }) freeFieldform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public FieldTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public FreeFieldDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ContextDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public LegalEntityDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MaxLimitTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;


  placeholder = 'select';
  freeFieldScreenData!: GetFreeFieldConfigScreenDto
  freeFieldList: CmFreeFieldConfigDto[]=[]
  freeFieldDetail!: CmFreeFieldConfigDto
  targetList: CodeTable[] = [];
  source: CodeTable[] = [];
  target: CodeTable[] = [];
  dossiersource: CodeTable[] = []
  dossiertarget: CodeTable[] = []
  dossiertargetList: CodeTable[] = [];
  saveFreeField: CmFreeFieldConfigDto[] = []
  freeFieldListValue: CodeTable[] = []
  dossierListValue: CodeTable[]=[]
  saveFreeFieldData: CmFreeFieldConfigDto[]=[]
  validationHeader = this.translate.instant('app-instance.validation.validationHeader');

  exceptionBox!: boolean
  showDetails!: boolean
  navigateUrl!: string
  errorCode!: string
  showDialog!: boolean
  intMaxValue = 2147483647;
  maxErrorDto: ErrorDto[]=[]

  freefieldHeader!: any[];

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public service: FreeFieldConfigService, private commonService: ConfigContextService, public router: Router,
    public route: ActivatedRoute, private spinnerService: SpinnerService, private fluidValidation: fluidValidationService) {
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.freeFieldScreenData = res.freeFieldScreenData
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.freeFieldList = res.freeFieldData

      if (this.freeFieldList?.length > 0) {

        this.freeFieldList.forEach(x => {
          if (x.fieldType.codeId == 1) {
            x.enablefreeFieldLen = true;
          }
          else {
            x.enablefreeFieldLen = false;
          }
      })

        this.showDetails = true;
        this.settingIsSelectedFalse();
        this.freeFieldList[0].isSelected = true;
        this.freeFieldDetail = this.freeFieldList[0];
        if (this.freeFieldDetail.fieldType?.codeId == 6) {
          this.assigningSourceTarget();
        }
        if (this.freeFieldDetail.freeFieldContextSubType != null) {
          this.assigningSourceTargetForDossier();
        }
      }
      else {
        this.showDetails = false;
      }
    })

    this.freefieldHeader = [
      { header: this.translate.instant('app-instance.freefield.tabel.FieldName'), field: 'fieldName', width: '12%' },
      { header: this.translate.instant('app-instance.freefield.tabel.TagName'), field: 'tagName', width: '12%' },
      { header: this.translate.instant('app-instance.freefield.tabel.ContextType'), field: 'freeFieldContextType.caption', width: '12%' },
      { header: this.translate.instant('app-instance.freefield.tabel.ContextSubType'), field: 'freeFieldContextSubType.caption', width: '11%' },
      { header: this.translate.instant('app-instance.freefield.tabel.FreeField'), field: 'freeField.caption', width: '11%' },
      { header: this.translate.instant('app-instance.freefield.tabel.FreeFieldType'), field: 'fieldType.caption', width: '9%' },
      { header: this.translate.instant('app-instance.freefield.tabel.FreeFieldLength'), field: 'freeFieldLength', width: '9%' },
      { header: this.translate.instant('app-instance.freefield.tabel.Sequence'), field: 'sequence', width: '9%' },
      { header: this.translate.instant('app-instance.freefield.tabel.LegalEntity'), field: 'legalEntity.name', width: '10%' },
      { header: '', field: 'Delete',fieldType:'deleteButton', width: '5%' }];
  }

  onSave(freeFieldData: CmFreeFieldConfigDto[]) {
    if (this.freeFieldform.valid) {
      freeFieldData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.saveFreeField.push({ ...x });
        }
      })
      this.spinnerService.setIsLoading(true);
      this.service.saveFreeFieldConfig(this.saveFreeField).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        this.freeFieldList = res

        if (this.freeFieldList.length > 0) {

          this.freeFieldList.forEach(x => {
            if (x.fieldType.codeId == 1) {
              x.enablefreeFieldLen = true;
            }
            else {
              x.enablefreeFieldLen = false;
            }
          })

          this.showDetails = true;
          this.settingIsSelectedFalse();
          const index = this.freeFieldList.findIndex(x => x?.fieldName == this.freeFieldDetail?.fieldName &&
            x?.tagName == this.freeFieldDetail?.tagName &&
            x?.freeFieldContextType?.codeId == this.freeFieldDetail?.freeFieldContextType?.codeId &&
            x?.freeFieldContextSubType?.codeId == this.freeFieldDetail?.freeFieldContextSubType?.codeId &&
            x?.freeField?.codeId == this.freeFieldDetail?.freeField?.codeId &&
            x?.fieldType?.codeId == this.freeFieldDetail?.fieldType?.codeId &&
            x?.freeFieldLength == this.freeFieldDetail?.freeFieldLength &&
            x?.sequence == this.freeFieldDetail?.sequence);
          this.freeFieldList[index].isSelected = true;
          this.freeFieldDetail = this.freeFieldList[index];
          if (this.freeFieldDetail.fieldType?.codeId == 6) {
            this.assigningSourceTarget();
          }
          if (this.freeFieldDetail.freeFieldContextSubType != null) {
            this.assigningSourceTargetForDossier();
          }
        }
        else {
          this.showDetails = false;
        }
        this.saveFreeField = [];
      }, err => {
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
        this.saveFreeField = [];
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
      });
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  dataSelection(event: CmFreeFieldConfigDto) {
    if (this.freeFieldform.valid) {
      this.settingIsSelectedFalse();
      this.freeFieldDetail = event;
      this.freeFieldDetail.isSelected = true;
      if (this.freeFieldDetail.fieldType?.codeId == 6) {
        this.assigningSourceTarget();
      }
      if (this.freeFieldDetail.freeFieldContextSubType != null) {
        this.assigningSourceTargetForDossier();
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addFreeField() {
    if (this.freeFieldform.valid) {
      this.settingExternalErrorFalse();
      this.showDetails = true;
      const newRow = new CmFreeFieldConfigDto;
      newRow.isSelected = true;
      const newuserList = this.freeFieldList;
      newuserList.push({ ...newRow });
      this.freeFieldDetail = new CmFreeFieldConfigDto();
      this.freeFieldList = [...newuserList];

      this.settingIsSelectedFalse();
      this.freeFieldDetail.state = DtoState.Created;
      this.freeFieldDetail.pKey = 0;
      this.freeFieldDetail.isSelected = true;
      this.freeFieldDetail.enablefreeFieldLen = false;

      this.freeFieldList[this.freeFieldList.length - 1] = this.freeFieldDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRowDelete(event: CmFreeFieldConfigDto, gridData: CmFreeFieldConfigDto[]) {
    if (this.freeFieldform.valid || event.fieldName == "" || event.fieldName == undefined || event.fieldType == null || event.freeField == null
      || event.freeFieldContextType == null || event.legalEntity == null) {
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      if (this.freeFieldList[deletedata].state != DtoState.Created) {
        event.state = DtoState.Deleted;
        this.saveFreeField.push({ ...event });
      }

      gridData.splice(deletedata, 1);
      this.freeFieldList = [...gridData]
      if (gridData.length > 0) {
        this.settingIsSelectedFalse();
        this.freeFieldList[this.freeFieldList.length - 1].isSelected = true;
        this.freeFieldDetail = this.freeFieldList[this.freeFieldList.length - 1];
        if (this.freeFieldDetail.fieldType?.codeId == 6) {
          this.assigningSourceTarget();
        }
        if (this.freeFieldDetail.freeFieldContextSubType != null) {
          this.assigningSourceTargetForDossier();
        }
      }
      else {
        this.settingExternalErrorFalse();
        setTimeout(() => {
          this.showDetails = false;
        }, 1)
      }
    }
  }

  settingIsSelectedFalse() {
    this.freeFieldList.forEach(x => x.isSelected = false);
  }

  settingFreeFieldDirty() {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    if (this.freeFieldList[index].state != DtoState.Created) {
      this.freeFieldList[index].state = DtoState.Dirty
    }
  }

  onChangeFieldName(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].fieldName = event?.target?.value;
    this.freeFieldDetail.fieldName = event?.target?.value;
    if (event?.target?.value == "") {
      this.NameTextBoxconfig.externalError = true;
    }
  }

  onChangeTagName(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].tagName = event?.target?.value;
    this.freeFieldDetail.tagName = event?.target?.value;
  }

  onChangeContextType(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].freeFieldContextType = event?.value;
    this.freeFieldDetail.freeFieldContextType = event?.value;
    if (event?.value == null) {
      this.ContextDropdownConfig.externalError = true;
    }
  }

  onChangeContextSubType(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].freeFieldContextSubType = event?.value;
    this.freeFieldDetail.freeFieldContextSubType = event?.value;
    this.freeFieldDetail.freeFieldConfig2ContextSubTypeValueList = [];
    if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 1) {
      this.dossiertarget = [];
      this.freeFieldListValue = [];
      this.dossiersource = [...this.freeFieldScreenData.debtSourceTypeList]
      this.assigningSourceTargetForDossier();
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 2) {
      this.dossiertarget = [];
      this.freeFieldListValue = [];
      this.dossiersource = [...this.freeFieldScreenData.debtSourceSubTypeList]
      this.assigningSourceTargetForDossier();
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 3) {
      this.dossiertarget = [];
      this.freeFieldListValue = [];
      this.dossiersource = [...this.freeFieldScreenData.collectionMeasureTypeList]
      this.assigningSourceTargetForDossier();
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 4) {
      this.dossiertarget = [];
      this.freeFieldListValue = [];
      this.dossiersource = [...this.freeFieldScreenData.salesTypeList]
      this.assigningSourceTargetForDossier();
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 5) {
      this.dossiertarget = [];
      this.freeFieldListValue = [];
      this.dossiersource = [...this.freeFieldScreenData.dossierTypeList]
      this.assigningSourceTargetForDossier();
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 6) {
      this.dossiertarget = [];
      this.freeFieldListValue = [];
      this.dossiersource = [...this.freeFieldScreenData.roleTypeList]
      this.assigningSourceTargetForDossier();
    }
  }

  onChangeFreeField(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].freeField = event?.value;
    this.freeFieldDetail.freeField = event?.value;
    if (event?.value == null) {
      this.FreeFieldDropdownConfig.externalError = true;
    }
  }

  onChangeFreeFieldType(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].fieldType = event?.value;
    this.freeFieldDetail.fieldType = event?.value;
    if (this.freeFieldDetail.fieldType?.codeId == 1) {
      this.freeFieldDetail.enablefreeFieldLen = true;
    }
    else {
      this.freeFieldList[index].freeFieldLength = null as unknown as number;
      this.freeFieldDetail.freeFieldLength = null as unknown as number;
      setTimeout(() => {
        this.freeFieldDetail.enablefreeFieldLen = false;
        this.FieldTypeDropdownConfig.externalError = true;
      },1)
    }

    if (this.freeFieldDetail.fieldType?.codeId == 6) {
      this.assigningSourceTarget();
    }
  }

  onChangeFreeFieldLength(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    if (event != null) {
      this.freeFieldList[index].freeFieldLength = parseInt(event);
      this.freeFieldDetail.freeFieldLength = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MaxLimitTextBoxconfig.externalError = true;
      }
    }
    else {
      this.freeFieldList[index].freeFieldLength = event;
      this.freeFieldDetail.freeFieldLength = event;
    }
  }

  onChangeSequence(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    if (event != null) {
      this.freeFieldList[index].sequence = parseInt(event);
      this.freeFieldDetail.sequence = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MaxLimitTextBoxconfig.externalError = true;
      }
    }
    else {
      this.freeFieldList[index].sequence = event;
      this.freeFieldDetail.sequence = event;
    }
  }

  onChangeLegalEntity(event: any) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    this.settingFreeFieldDirty()
    this.freeFieldList[index].legalEntity = event?.value;
    this.freeFieldDetail.legalEntity = event?.value;
    if (event?.value == null) {
      this.LegalEntityDropdownConfig.externalError = true;
    }
  }

  assigningSourceTarget() {
    const index = this.freeFieldList.findIndex(x => x.isSelected);
    this.targetList = [];
    this.freeFieldList[index].freeFieldConfig2ListValueList.forEach(x => {
      const filter = this.freeFieldScreenData.fieldListValueList.findIndex(y => {
        return x.freeFieldListValue?.codeId == y.codeId;
      });
      if (filter != -1) {
        this.targetList.push(this.freeFieldScreenData.fieldListValueList[filter]);
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.freeFieldScreenData.fieldListValueList];
    this.target.forEach(x => {
      const deleteindex = sourcelist.findIndex(value => {
        return value.caption == x.caption;
      });
      if (index != -1) {
        sourcelist.splice(deleteindex, 1);
      }
    });
    this.source = [...sourcelist];
  }
  
  assigningSourceTargetForDossier() {
    const index = this.freeFieldList.findIndex(x => x.isSelected);
    this.dossiertargetList = [];
    if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 1) {
      this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.forEach(x => {
        const filter = this.freeFieldScreenData.debtSourceTypeList.findIndex(y => {
          return x.freeFieldContextSubType == y.codeId;
        });
        if (filter != -1) {
          this.dossiertargetList.push(this.freeFieldScreenData.debtSourceTypeList[filter]);
        }
      });
      this.dossiertarget = [...this.dossiertargetList];
      const sourcelist = [...this.freeFieldScreenData.debtSourceTypeList];
      this.dossiertarget.forEach(x => {
        const deleteindex = sourcelist.findIndex(value => {
          return value.codeId == x.codeId;
        });
        if (index != -1) {
          sourcelist.splice(deleteindex, 1);
        }
      });
      this.dossiersource = [...sourcelist];
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 2) {
      this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.forEach(x => {
        const filter = this.freeFieldScreenData.debtSourceSubTypeList.findIndex(y => {
          return x.freeFieldContextSubType == y.codeId;
        });
        if (filter != -1) {
          this.dossiertargetList.push(this.freeFieldScreenData.debtSourceSubTypeList[filter]);
        }
      });
      this.dossiertarget = [...this.dossiertargetList];
      const sourcelist = [...this.freeFieldScreenData.debtSourceSubTypeList];
      this.dossiertarget.forEach(x => {
        const deleteindex = sourcelist.findIndex(value => {
          return value.codeId == x.codeId;
        });
        if (index != -1) {
          sourcelist.splice(deleteindex, 1);
        }
      });
      this.dossiersource = [...sourcelist];
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 3) {
      this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.forEach(x => {
        const filter = this.freeFieldScreenData.collectionMeasureTypeList.findIndex(y => {
          return x.freeFieldContextSubType == y.codeId;
        });
        if (filter != -1) {
          this.dossiertargetList.push(this.freeFieldScreenData.collectionMeasureTypeList[filter]);
        }
      });
      this.dossiertarget = [...this.dossiertargetList];
      const sourcelist = [...this.freeFieldScreenData.collectionMeasureTypeList];
      this.dossiertarget.forEach(x => {
        const deleteindex = sourcelist.findIndex(value => {
          return value.codeId == x.codeId;
        });
        if (index != -1) {
          sourcelist.splice(deleteindex, 1);
        }
      });
      this.dossiersource = [...sourcelist];
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 4) {
      this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.forEach(x => {
        const filter = this.freeFieldScreenData.salesTypeList.findIndex(y => {
          return x.freeFieldContextSubType == y.codeId;
        });
        if (filter != -1) {
          this.dossiertargetList.push(this.freeFieldScreenData.salesTypeList[filter]);
        }
      });
      this.dossiertarget = [...this.dossiertargetList];
      const sourcelist = [...this.freeFieldScreenData.salesTypeList];
      this.dossiertarget.forEach(x => {
        const deleteindex = sourcelist.findIndex(value => {
          return value.codeId == x.codeId;
        });
        if (index != -1) {
          sourcelist.splice(deleteindex, 1);
        }
      });
      this.dossiersource = [...sourcelist];
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 5) {
      this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.forEach(x => {
        const filter = this.freeFieldScreenData.dossierTypeList.findIndex(y => {
          return x.freeFieldContextSubType == y.codeId;
        });
        if (filter != -1) {
          this.dossiertargetList.push(this.freeFieldScreenData.dossierTypeList[filter]);
        }
      });
      this.dossiertarget = [...this.dossiertargetList];
      const sourcelist = [...this.freeFieldScreenData.dossierTypeList];
      this.dossiertarget.forEach(x => {
        const deleteindex = sourcelist.findIndex(value => {
          return value.codeId == x.codeId;
        });
        if (index != -1) {
          sourcelist.splice(deleteindex, 1);
        }
      });
      this.dossiersource = [...sourcelist];
    }
    else if (this.freeFieldDetail.freeFieldContextSubType?.codeId == 6) {
      this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.forEach(x => {
        const filter = this.freeFieldScreenData.roleTypeList.findIndex(y => {
          return x.freeFieldContextSubType == y.codeId;
        });
        if (filter != -1) {
          this.dossiertargetList.push(this.freeFieldScreenData.roleTypeList[filter]);
        }
      });
      this.dossiertarget = [...this.dossiertargetList];
      const sourcelist = [...this.freeFieldScreenData.roleTypeList];
      this.dossiertarget.forEach(x => {
        const deleteindex = sourcelist.findIndex(value => {
          return value.codeId == x.codeId;
        });
        if (index != -1) {
          sourcelist.splice(deleteindex, 1);
        }
      });
      this.dossiersource = [...sourcelist];
    }
  }


  changeTarget(event: CodeTable[]) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    if (event != undefined) {
      if (this.freeFieldList[index].state != DtoState.Created) {
        this.freeFieldList[index].state = DtoState.Dirty;
      }
      this.freeFieldListValue = [];
      event.forEach(x => {
        const dupIndex = this.freeFieldListValue.findIndex(y => {
          return y.caption == x.caption;
        });
        if (dupIndex == -1) {
          this.freeFieldListValue.push(x);
        }
      });
      this.freeFieldList[index].freeFieldConfig2ListValueList = [];
      for (let i = 0; i < this.freeFieldListValue.length; i++) {
        this.freeFieldList[index].freeFieldConfig2ListValueList.push({ ...new CmFreeFieldConfig2ListValueDto });
        this.freeFieldList[index].freeFieldConfig2ListValueList[i].freeFieldListValue = this.freeFieldListValue[i];
      }
    }
  }

  changeDossierTarget(event: CodeTable[]) {
    const index = this.freeFieldList.findIndex(x => x.isSelected)
    if (event != undefined) {
      if (this.freeFieldList[index].state != DtoState.Created) {
        this.freeFieldList[index].state = DtoState.Dirty;
      }
      this.dossierListValue = [];
        event.forEach(x => {
          const dupIndex = this.dossierListValue.findIndex(y => {
            return y.caption == x.caption;
          });
          if (dupIndex == -1) {
            this.dossierListValue.push(x);
          }
        });
        this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList = [];
        for (let i = 0; i < this.dossierListValue.length; i++) {
          this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList.push({ ...new CmFreeFieldConfig2FreeFieldContextSubTypeValueDto });
          this.freeFieldList[index].freeFieldConfig2ContextSubTypeValueList[i].freeFieldContextSubType = this.dossierListValue[i].codeId;
        }
    }
  }

  settingExternalErrorTrue() {
    this.NameTextBoxconfig.externalError = true;
    this.FieldTypeDropdownConfig.externalError = true;
    this.FreeFieldDropdownConfig.externalError = true;
    this.LegalEntityDropdownConfig.externalError = true;
    this.ContextDropdownConfig.externalError = true;
  }

  settingExternalErrorFalse() {
    this.NameTextBoxconfig.externalError = false;
    this.FieldTypeDropdownConfig.externalError = false;
    this.FreeFieldDropdownConfig.externalError = false;
    this.LegalEntityDropdownConfig.externalError = false;
    this.ContextDropdownConfig.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.freeFieldList.findIndex(x => x.state == DtoState.Created || x.state == DtoState.Dirty);
    if (this.saveFreeFieldData.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(freeFieldList: CmFreeFieldConfigDto[]) {
    this.showDialog = false;
    this.onSave(freeFieldList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.settingExternalErrorFalse();
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
    fieldNamerequiredError.validationMessage = this.translate.instant('app-instance.freefield.validation.FieldName');
    this.NameTextBoxconfig.required = true;
    this.NameTextBoxconfig.Errors = [fieldNamerequiredError];

    const fieldTyperequiredError = new ErrorDto;
    fieldTyperequiredError.validation = "required";
    fieldTyperequiredError.isModelError = true;
    fieldTyperequiredError.validationMessage = this.translate.instant('app-instance.freefield.validation.FieldType');
    this.FieldTypeDropdownConfig.required = true;
    this.FieldTypeDropdownConfig.Errors = [fieldTyperequiredError];

    const freeFieldError = new ErrorDto;
    freeFieldError.validation = "required";
    freeFieldError.isModelError = true;
    freeFieldError.validationMessage = this.translate.instant('app-instance.freefield.validation.FreeField');
    this.FreeFieldDropdownConfig.required = true;
    this.FreeFieldDropdownConfig.Errors = [freeFieldError];

    const contextError = new ErrorDto;
    contextError.validation = "required";
    contextError.isModelError = true;
    contextError.validationMessage = this.translate.instant('app-instance.freefield.validation.ContextType');
    this.ContextDropdownConfig.required = true;
    this.ContextDropdownConfig.Errors = [contextError];

    const legalEntityError = new ErrorDto;
    legalEntityError.validation = "required";
    legalEntityError.isModelError = true;
    legalEntityError.validationMessage = this.translate.instant('app-instance.freefield.validation.LegalEntity');
    this.LegalEntityDropdownConfig.required = true;
    this.LegalEntityDropdownConfig.Errors = [legalEntityError];

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('app-instance.freefield.validation.numberInt32Check');
    this.maxErrorDto = [maxLimitValidation];
    this.MaxLimitTextBoxconfig.maxValueValidation = this.translate.instant('app-instance.freefield.validation.InputIncorrect');

  }

}
