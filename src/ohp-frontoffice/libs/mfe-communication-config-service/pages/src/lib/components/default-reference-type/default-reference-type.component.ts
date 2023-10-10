import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { referenceType } from './Models/referenceType.model';
import { referenceTypeUsage } from './Models/referenceTypeUsage.model';
import { defaultReferenceType } from './Models/defaultReferenceType.model';
import { DefaultReferenceTypeService } from './Service/default-reference-type.service';
import { stateModel } from './Models/state.model';


@Component({
  selector: 'mccs-default-reference-type',
  templateUrl: './default-reference-type.component.html',
  styleUrls: ['./default-reference-type.component.scss']
})
export class DefaultReferenceTypeComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TypeUsageDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select';
  Header = this.translate.instant('communication.Validation.validationHeader');
  DuplicateBusinessError = this.translate.instant('communication.DefaultReference.mandatory.DupBusinessError');
  deletedRecords: defaultReferenceType[] = [];
  referenceTypeList: referenceType[] = []
  referenceTypeUsageList: referenceTypeUsage[] = [];
  defaultRefTypeList: defaultReferenceType[] = [];
  index: any
  defualtRefTypeCard!: defaultReferenceType
  defaultHeader!: any[];
  notEditable!: boolean;
  exceptionBox!: boolean;
  show!: boolean;
  Nothide!: boolean;
  isErrors!: boolean;
  navigateUrl!: string
  errorCode!: string;

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public defaultRefTypeService: DefaultReferenceTypeService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  SettingFalse() {
    this.defaultRefTypeList.forEach(x => x.isEntered = false)
  }

  DuplicateCheck(): boolean {
    const mappedData = this.defaultRefTypeList.map(item => {
      return item.referenceTypeUsage?.codeId;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (hasValue)
      return true;
    else return false;
  }

  changeReferenceType(event: any) {
    this.index = this.defaultRefTypeList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.defaultRefTypeList[this.index].state == stateModel.Unknown) {
      this.defaultRefTypeList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.defaultRefTypeList[this.index].referenceType = event?.value;
      this.defualtRefTypeCard.referenceType = event?.value;
      this.RemoveBusinessError(this.DuplicateBusinessError);
    }
    else {
      this.defaultRefTypeList[this.index].referenceType = null as unknown as referenceType;
      this.defualtRefTypeCard.referenceType = null as unknown as referenceType;
      if (this.DuplicateCheck()) {
        this.throwBusinessError(this.DuplicateBusinessError);
      }
      else {
        this.RemoveBusinessError(this.DuplicateBusinessError);
      }
      this.TypeDropdownConfig.externalError = true;
    }
  }

  changeReferenceTypeUsage(event: any) {
    this.index = this.defaultRefTypeList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.defaultRefTypeList[this.index].state == stateModel.Unknown) {
      this.defaultRefTypeList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.defaultRefTypeList[this.index].referenceTypeUsage = event?.value;
      this.defualtRefTypeCard.referenceTypeUsage = event?.value;

    }
    else {
      this.defaultRefTypeList[this.index].referenceTypeUsage = null as unknown as referenceTypeUsage;
      this.defualtRefTypeCard.referenceTypeUsage = null as unknown as referenceTypeUsage;
      this.TypeUsageDropdownConfig.externalError = true;
    }
  }

  clickGrid(data: defaultReferenceType) {
    if (data) {

      if ((!this.userDetailsform.invalid)) {
        if (!this.DuplicateCheck()) {
          this.SettingFalse();
          this.index = this.defaultRefTypeList.findIndex(item => {
            return item == data;
          });
          this.defaultRefTypeList[this.index].isEntered = true;
          this.notEditable = true;
          this.defualtRefTypeCard = data;
          this.RemoveBusinessError(this.DuplicateBusinessError);
          this.TypeDropdownConfig.externalError = false;
          this.TypeUsageDropdownConfig.externalError = false;
        } else {
          this.throwBusinessError(this.DuplicateBusinessError);
        }
      } else {
        this.TypeDropdownConfig.externalError = true;
        this.TypeUsageDropdownConfig.externalError = true;
      }
    }
  }

  addRow() {

    if ((!this.userDetailsform.invalid) || this.defaultRefTypeList.length == 0) {
      if (!this.DuplicateCheck()) {
        this.SettingFalse();
        const addRow = new defaultReferenceType();
        addRow.state = stateModel.Created;
        addRow.pKey = 0;
        addRow.canValidate = false;
        addRow.isEntered = true;
        addRow.rowVersion = 0;
        this.notEditable = false;
        const newlist = this.defaultRefTypeList;
        newlist.push({ ...addRow });
        this.defaultRefTypeList = [...newlist];
        this.Nothide = true;
        this.defualtRefTypeCard = new defaultReferenceType();
        this.defualtRefTypeCard = this.defaultRefTypeList[this.defaultRefTypeList.length - 1]
        this.RemoveBusinessError(this.DuplicateBusinessError);
      this.TypeDropdownConfig.externalError = false;
      this.TypeUsageDropdownConfig.externalError = false;
      } else {
        this.throwBusinessError(this.DuplicateBusinessError);
      }
    } else {
      this.TypeDropdownConfig.externalError = true;
      this.TypeUsageDropdownConfig.externalError = true;
    }
  }

  onRowDelete(event: defaultReferenceType, array: defaultReferenceType[]) {

    if (((event.referenceType?.name == null || event.referenceTypeUsage?.caption == null) &&
      event.isEntered) || (!this.userDetailsform.invalid)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      });

      if (!this.DuplicateCheck() || (this.DuplicateCheck() && event.isEntered)) {
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedRecords.push({ ...event });
        }
        array.splice(deletedata, 1);
        this.RemoveBusinessError(this.DuplicateBusinessError);
      this.TypeDropdownConfig.externalError = false;
      this.TypeUsageDropdownConfig.externalError = false;
        this.defaultRefTypeList = [...array];
      if (this.defaultRefTypeList.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
        }
        if (this.defaultRefTypeList.length > 0) {
          this.SettingFalse();
          this.defualtRefTypeCard = this.defaultRefTypeList[this.defaultRefTypeList.length - 1]
          this.defaultRefTypeList[this.defaultRefTypeList.length - 1].isEntered = true;
          this.notEditable = true;
        }

      } else {
        this.throwBusinessError(this.DuplicateBusinessError);
      }
    } else {
      this.TypeDropdownConfig.externalError = true;
      this.TypeUsageDropdownConfig.externalError = true;
    }
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage;
      });
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
      }
    } else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError
      );

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }

  onclose() {
    const unsaved = this.defaultRefTypeList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty;
    });
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: defaultReferenceType[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.DuplicateBusinessError);
    this.TypeDropdownConfig.externalError = false;
    this.TypeUsageDropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }

  ngOnInit(): void {

    this.buildConfiguration();
    
    this.defaultHeader = [
      { header: this.translate.instant('communication.DefaultReference.tabel.Referencetypeusage'), field: 'referenceTypeUsage.caption', width: '45%' },
      { header: this.translate.instant('communication.DefaultReference.tabel.ReferencetypeName'), field: 'referenceType.name', width: '50%' }, 
      { field: 'Delete', width: '5%',fieldType:'deleteButton' }];


    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.referenceTypeList = res.refTypeData
      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.referenceTypeUsageList = res.RefTypeUsageData
        console.log(this.referenceTypeUsageList)
      }
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.defaultRefTypeList = res.defaultRefData
        console.log(this.defaultRefTypeList)
        this.deletedRecords = [...new Array<defaultReferenceType>()];
        this.index = 0;
        if (this.defaultRefTypeList.length > 0) {
          this.Nothide = true;
          this.notEditable = true;
          this.SettingFalse();
          this.defaultRefTypeList[this.index].isEntered = true;
          this.defualtRefTypeCard = this.defaultRefTypeList[this.index];
        } else {
          this.Nothide = false;
        }
      }
    })
  }

  onSave(GridData: defaultReferenceType[]) {

    if (this.DuplicateCheck()) {
      this.throwBusinessError(this.DuplicateBusinessError);
      this.isErrors = true;
    } else if (!this.userDetailsform.invalid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x });
        }
        this.deletedRecords.forEach(y => {
          if (y.state == stateModel.Deleted && y.referenceType?.name == null) {
            y.referenceType = null as unknown as referenceType;
          }

          if (y.state == stateModel.Deleted && y.referenceTypeUsage?.caption == null) {
            y.referenceTypeUsage = null as unknown as referenceTypeUsage;
          }
        });
      });

      console.log(this.deletedRecords)
      this.spinnerService.setIsLoading(true);
      this.defaultRefTypeService.SaveDefaultReferenceType(this.deletedRecords).subscribe(
        res => {
         
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<defaultReferenceType>()];

          this.defaultRefTypeService.GetDefaultReferenceType().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = [...(res as defaultReferenceType[])];
            this.defaultRefTypeList = [...getResponse];
            this.notEditable = true;
            this.TypeDropdownConfig.externalError = false;
            this.TypeUsageDropdownConfig.externalError = false;
            this.RemoveBusinessError(this.DuplicateBusinessError)
            if (this.defaultRefTypeList.length > 0) {
              this.Nothide = true;
              this.SettingFalse();
              this.index = this.defaultRefTypeList.findIndex(section => {
                return (
                  section.referenceTypeUsage?.caption == this.defualtRefTypeCard.referenceTypeUsage?.caption
                );
              });

              this.defaultRefTypeList[this.index].isEntered = true;
              this.defualtRefTypeCard = this.defaultRefTypeList[this.index];
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
              this.deletedRecords = [...new Array<defaultReferenceType>()];
              this.exceptionBox = true;
            });
        },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<defaultReferenceType>()];
          this.exceptionBox = true;
        }
      );
    }
    else {
      this.isErrors = true;
      this.TypeDropdownConfig.externalError = true;
      this.TypeUsageDropdownConfig.externalError = true;    }
  }

  buildConfiguration() {
    const TypeRequired = new ErrorDto();
    TypeRequired.validation = 'required';
    TypeRequired.isModelError = true;
    TypeRequired.validationMessage =
      this.translate.instant('communication.DefaultReference.mandatory.ReferencetypeName') +
    this.translate.instant('communication.DefaultReference.mandatory.required');
    this.TypeDropdownConfig.Errors = [TypeRequired];
    this.TypeDropdownConfig.required = true;

    const TypeUsageRequired = new ErrorDto();
    TypeUsageRequired.validation = 'required';
    TypeUsageRequired.isModelError = true;
    TypeUsageRequired.validationMessage =
    this.translate.instant('communication.DefaultReference.mandatory.Referencetypeusage') +
    this.translate.instant('communication.DefaultReference.mandatory.required');
    this.TypeUsageDropdownConfig.Errors = [TypeUsageRequired];
    this.TypeUsageDropdownConfig.required = true;
  }
}
