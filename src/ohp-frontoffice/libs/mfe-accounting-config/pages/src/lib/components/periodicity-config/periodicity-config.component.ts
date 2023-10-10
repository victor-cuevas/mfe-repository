import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, ValidationErrorDto} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { PeriodicityConfigForAccountingModuleDto } from './Models/periodicityconfigforaccountingmoduleDto.model';
import { FinancialAmortizationTypeDto } from './Models/financialamortizationtypeDto.model';
import { PeriodicityDto } from './Models/periodicityDto.model';
import { PeriodicityService } from './services/periodicity-config.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
@Component({
  selector: 'mactc-periodicity-config',
  templateUrl: './periodicity-config.component.html',
  styleUrls: ['./periodicity-config.component.scss']
})
export class PeriodicityConfigComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  placeholder = 'select';
  Response: PeriodicityConfigForAccountingModuleDto[] = [];
  financialAmortizationTypeResponse: FinancialAmortizationTypeDto[] = [];
  periodicityNameResponse: PeriodicityDto[] = [];
  businessErrorforFinancialAmortizationType!: string;
  isErrors!: boolean
  businessError!: string;
  deletedRecords: PeriodicityConfigForAccountingModuleDto[] = [];
  targetList: FinancialAmortizationTypeDto[] = [];
  source: FinancialAmortizationTypeDto[] = [];
  target: FinancialAmortizationTypeDto[] = [];
  financialAmortizationTypeList: FinancialAmortizationTypeDto[] = [];
  index: any;
  section!: PeriodicityConfigForAccountingModuleDto;
  selectedDetails!: PeriodicityConfigForAccountingModuleDto
  exceptionBox!: boolean;
  show!: boolean;
  navigateUrl!: string
  isClicked!: boolean;
  Nothide!: boolean;
  dataSelected: any;
  Header = this.translate.instant('accounting.Validation.Header');
  actionDeselect: PeriodicityDto = { ...new PeriodicityDto() };
  clearIcon = true;
  editable!: boolean;
  errorCode!:string
  PeriodicityHeader = [
    { header: this.translate.instant('accounting.Periodicity.tabel.Periodicity'), field: 'periodicityCd.caption', width: '93%' },
    { header: this.translate.instant('accounting.Periodicity.tabel.delete'), field: 'delete', width: '8%', fieldType: 'deleteButton' }];
  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public actionService: PeriodicityService,
    public fluidValidation: fluidValidationService
  ) {
    this.editable = true;
    this.businessError = this.translate.instant('accounting.Periodicity.ValidationError.buisnessError');
    this.businessErrorforFinancialAmortizationType = this.translate.instant('accounting.Periodicity.ValidationError.businessErrorforFinancialAmortizationType');
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.route.data.subscribe(
      (res: any) => {        
        if (res.periodicityList != null) {
          this.spinnerService.setIsLoading(false);
          this.periodicityNameResponse = [...(res.periodicityList as PeriodicityDto[])];
        }        
      }
    );
    this.route.data.subscribe(
      (res: any) => {
        if (res.financialAmortizationTypeList != null) {
          this.spinnerService.setIsLoading(false);
          this.financialAmortizationTypeResponse = [...(res.financialAmortizationTypeList as FinancialAmortizationTypeDto[])];
        }
      }
    );
    this.route.data.subscribe(
      (res: any) => {
        if (res.periodicityData != null) {
          this.spinnerService.setIsLoading(false);
          this.Response = (res.periodicityData as PeriodicityConfigForAccountingModuleDto[]);
          this.DropdownConfig.externalError = false;
          this.index = 0;
          this.deletedRecords = [...new Array<PeriodicityConfigForAccountingModuleDto>()];
          if (this.Response.length > 0) {
            this.Nothide = true;
            this.SettingFalse();
            this.Response[this.index].isEntered = true;
            this.section = this.Response[this.index];
            
            this.selectedDetails = this.Response[this.index];
            this.assigningSourceTarget(this.index);
          }
        }
      }
    );
  }
  SettingFalse() {
    this.Response.forEach(set => {
      set.isEntered = false;
    });
  }
  click(data: PeriodicityConfigForAccountingModuleDto) {
    if (data) {
      const filteredData = this.Response.map(item => {
        return item.periodicityCd?.caption;
      });
      const hasValue = filteredData.some(function (item, index) {
        return filteredData.indexOf(item) != index;
      });
      if (!this.userDetailsform.invalid) {
        if (!hasValue) {
          if (!this.isErrors) {
            this.SettingFalse();
            this.index = this.Response.findIndex(item => {
              return item == data;
            });
            this.Response[this.index].isEntered = true;
            this.section = data;
            this.selectedDetails = data;
            this.assigningSourceTarget(this.index);
            this.dataSelected = null;
            this.isClicked = true;
            this.editable = true;
          }          
        } else {
          this.throwBusinessError(this.businessError);
        }
      } else {
        this.DropdownConfig.externalError = true;
        if (hasValue) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }
  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.Response[index].financialAmortizationTypeList.forEach(amortization => {
      const filter = this.financialAmortizationTypeResponse.findIndex(y => {
        return amortization.caption == y.caption;
      });
      if (filter != -1) {
        this.targetList.push(this.financialAmortizationTypeResponse[filter]);
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.financialAmortizationTypeResponse];
    this.target.forEach(amortization => {
      const index = sourcelist.findIndex(value => {
        return value.caption == amortization.caption;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];
  }
  onRowDelete(dataselect: PeriodicityConfigForAccountingModuleDto, array: PeriodicityConfigForAccountingModuleDto[]) {
    const mappedData = this.Response.map(item => {
      return item.periodicityCd?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (this.target.length == 0) {
      this.throwBusinessError(this.businessErrorforFinancialAmortizationType)
      this.isErrors = true;
    }
    else {
      this.RemoveBusinessError(this.businessErrorforFinancialAmortizationType)
      this.isErrors = false;
    }
    if (
      ((dataselect.periodicityCd?.caption == null) &&
        dataselect.isEntered) ||
      !this.userDetailsform.invalid
    ) {
      if (!this.isErrors || (this.isErrors && dataselect.isEntered)) {
        const deletedata = array.findIndex(data => {
          return data == dataselect;
        });

        if (!hasValue || (hasValue && dataselect.isEntered)) {
          if (dataselect.state != DtoState.Created) {
            dataselect.state = DtoState.Deleted;
            this.deletedRecords.push({ ...dataselect });
          }
          array.splice(deletedata, 1);
          this.removeBusinessErrorCall();
          this.RemoveBusinessError(this.businessErrorforFinancialAmortizationType);
          this.DropdownConfig.externalError = false;
          this.Response = [...array];
          if (this.Response.length == 0) {
            setTimeout(() => {
              this.Nothide = false;
            }, 5);
          }
          this.section = new PeriodicityConfigForAccountingModuleDto();
          if (this.Response.length > 0) {
            this.section.periodicityCd =
              this.Response[this.Response.length - 1].periodicityCd
            this.target = this.Response[this.Response.length - 1].financialAmortizationTypeList
            this.RemoveBusinessError(this.businessErrorforFinancialAmortizationType)
            this.isErrors = false;
            this.section = this.Response[this.Response.length - 1]
            this.selectedDetails = this.Response[this.Response.length - 1]
            this.SettingFalse();
            this.Response[this.Response.length - 1].isEntered = true;
            this.editable = true;
          }
        } else {
          this.throwBusinessError(this.businessError);
        }
      }      
    } else {
      this.DropdownConfig.externalError = true;
      if (hasValue) {
        this.throwBusinessError(this.businessError);
      }
    }
  }
  addRow() {
    const mappedData = this.Response.map(item => {
      return item.periodicityCd?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (this.target.length == 0) {
      this.throwBusinessError(this.businessErrorforFinancialAmortizationType)
      this.isErrors = true;
    }
    else {
      this.RemoveBusinessError(this.businessErrorforFinancialAmortizationType)
      this.isErrors = false;
    }
    if (!this.userDetailsform.invalid || this.Response.length == 0) {
      if (!hasValue) {
        if (!this.isErrors) {
          this.SettingFalse();
          const addRow = new PeriodicityConfigForAccountingModuleDto();
          addRow.state = DtoState.Created;
          addRow.pKey = 0;
          addRow.canValidate = false;
          addRow.isEntered = true;
          addRow.rowVersion = 0;
          addRow.financialAmortizationTypeList = [];
          this.target = [];
          this.financialAmortizationTypeList = [];
          this.source = [...this.financialAmortizationTypeResponse];
          const codetable = { ...new PeriodicityDto() };
          addRow.periodicityCd = codetable;
          const newlist = this.Response;
          newlist.push({ ...addRow });
          this.Response = [...newlist];
          this.isClicked = false;
          this.Nothide = true;
          this.userDetailsform.resetForm();
          this.section = new PeriodicityConfigForAccountingModuleDto();
          this.selectedDetails = this.Response[this.Response.length - 1]
          this.removeBusinessErrorCall();
          this.DropdownConfig.externalError = false;
          this.editable = false;
        }
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      this.DropdownConfig.externalError = true;
      if (hasValue) {
        this.throwBusinessError(this.businessError);
      }
    }
  }
  changeSectionGridData(event: any) {
    if (event != undefined) {
      if (!this.isClicked) {
        this.index = this.Response.findIndex(get => {
          return get.isEntered == true;
        });
      }
      if (this.Response[this.index].state == DtoState.Unknown) {
        this.Response[this.index].state = DtoState.Dirty;
      }
      if (event?.value != null) {
        this.Response[this.index].periodicityCd = event?.value;
        this.section.periodicityCd = event?.value;
        this.DropdownConfig.externalError = false;
        this.removeBusinessErrorCall();
      } else {
        this.Response[this.index].periodicityCd = null;
        this.section.periodicityCd = null;
        this.DropdownConfig.externalError = true;
      }
    }
  }
  changeTarget(event: FinancialAmortizationTypeDto[]) {
    if (event != undefined) {
      if (!this.isClicked) {
        this.index = this.Response.findIndex(get => {
          return get.isEntered == true;
        });
      }
      if (this.Response[this.index].state == DtoState.Unknown) {
        this.Response[this.index].state = DtoState.Dirty;
      }
      this.financialAmortizationTypeList = [];
      event.forEach(x => {
        const dupIndex = this.financialAmortizationTypeList.findIndex(y => {
          return y.caption == x.caption;
        });
        if (dupIndex == -1) {
          this.financialAmortizationTypeList.push(x);
        }
      });
      this.Response[this.index].financialAmortizationTypeList = this.financialAmortizationTypeList;
    }
  }
  onclose() {
    const unsaved = this.Response.findIndex(x => {
      return x.state == DtoState.Created || x.state == DtoState.Dirty;
    });
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: PeriodicityConfigForAccountingModuleDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.removeBusinessErrorCall();
    this.DropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }
  removeBusinessErrorCall() {
    const mappedData = this.Response.map(item => {
      return item.periodicityCd?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });

    if (!hasValue) {
      this.RemoveBusinessError(this.businessError);
    } else {
      this.throwBusinessError(this.businessError);
    }
  }
  onSave(GridData: PeriodicityConfigForAccountingModuleDto[]) {
    const mappedData = GridData.map(item => {
      return item.periodicityCd?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (this.target.length == 0) {
      this.throwBusinessError(this.businessErrorforFinancialAmortizationType)
      this.isErrors = true;
    }
    else {
      this.RemoveBusinessError(this.businessErrorforFinancialAmortizationType)
      this.isErrors = false;
    }
    if (hasValue) {
      this.throwBusinessError(this.businessError);
      this.isErrors = true;
    }
    else if (!this.userDetailsform.invalid && !this.isErrors) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.deletedRecords.push({ ...x });
        }
        this.deletedRecords.forEach(y => {
          if (y.state == DtoState.Deleted && y.periodicityCd?.caption == null) {
            y.periodicityCd = null;
          }
        });
      });


      this.spinnerService.setIsLoading(true);
      this.actionService.savePeriodicityScreenData(this.deletedRecords).subscribe(
        res => {
          this.spinnerService.setIsLoading(false);
          this.editable = true;
          this.deletedRecords = [...new Array<PeriodicityConfigForAccountingModuleDto>()];
          this.actionService.getPeriodicityScreenData().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            this.financialAmortizationTypeList = [];
            const getResponse = res as PeriodicityConfigForAccountingModuleDto[]

            this.Response = [...getResponse];

            this.DropdownConfig.externalError = false;

            if (this.Response.length > 0) {
              this.SettingFalse();
              this.target.forEach(x => {
                this.financialAmortizationTypeList.push(x);
              });
              this.index = this.Response.findIndex(section => {
                return (
                  section.periodicityCd?.caption == this.section.periodicityCd?.caption 
                );
              });

              this.Response[this.index].isEntered = true;
              this.section = this.Response[this.index];
              this.selectedDetails = this.Response[this.index]
              this.assigningSourceTarget(this.index)

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
              this.deletedRecords = [...new Array<PeriodicityConfigForAccountingModuleDto>()];
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
          this.deletedRecords = [...new Array<PeriodicityConfigForAccountingModuleDto>()];
          this.exceptionBox = true;
        }
      );
    }
    else {
      this.isErrors = true;
      this.DropdownConfig.externalError = true;
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
  buildConfiguration() {
    const periodicityRequired = new ErrorDto();
    periodicityRequired.validation = 'required';
    periodicityRequired.isModelError = true;
    periodicityRequired.validationMessage =
      this.translate.instant('accounting.Periodicity.ValidationError.section') +
    this.translate.instant('accounting.Periodicity.ValidationError.required');
    this.DropdownConfig.Errors = [periodicityRequired];
    this.DropdownConfig.required = true;
  }
}
