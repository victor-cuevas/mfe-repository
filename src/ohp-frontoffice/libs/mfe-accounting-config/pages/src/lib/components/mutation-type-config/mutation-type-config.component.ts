import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlsBaseService, FluidDropDownConfig, ValidationErrorDto} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-accounting-config/core';
import { MutationTypeConfigForAccountingModuleDto } from './Models/mutationtypeconfigforaccountingmoduleDto.model';
import { MutationTypeDto } from './Models/mutationtypeDto.model';
import { MutationTypeService } from './Services/mutation-type-config.service';
import { DtoState } from './Models/entityDtoBase.model';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
@Component({
  selector: 'mactc-mutation-type-config',
  templateUrl: './mutation-type-config.component.html',
  styleUrls: ['./mutation-type-config.component.scss']
})
export class MutationTypeConfigComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select';
  Response: MutationTypeConfigForAccountingModuleDto[] = [];
  mutationTypeNameResponse: MutationTypeDto[] = [];
  isErrors!: boolean
  businessError!: string;
  deletedRecords: MutationTypeConfigForAccountingModuleDto[] = [];
  index: any;
  section!: MutationTypeConfigForAccountingModuleDto;
  selectedDetails!: MutationTypeConfigForAccountingModuleDto
  exceptionBox!: boolean;
  show!: boolean;
  navigateUrl!: string
  isClicked!: boolean;
  Nothide!: boolean;
  dataSelected: any;
  Header = this.translate.instant('accounting.Validation.Header');
  actionDeselect: MutationTypeDto = { ...new MutationTypeDto() };
  clearIcon = true;
  MutationHeader = [
    { header: this.translate.instant('accounting.mutation-type.tabel.MutationT'), field: 'mutationTypeList.caption', width: '93%' },
    { header: this.translate.instant('accounting.mutation-type.tabel.delete'), field: 'delete', width: '8%', fieldType: 'deleteButton'}];
  editable!: boolean;
  mutationTypeDup: MutationTypeConfigForAccountingModuleDto[] = []
  errorCode!:string
  constructor(public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public mutationService: MutationTypeService,
    public fluidValidation: fluidValidationService
  ) {
    this.editable= true;
    this.businessError = this.translate.instant('accounting.mutation-type.ValidationError.buisnessError');
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }
  
  buildConfiguration() {
    const mutationTypeRequired = new ErrorDto();
    mutationTypeRequired.validation = 'required';
    mutationTypeRequired.isModelError = true;
    mutationTypeRequired.validationMessage =
      this.translate.instant('accounting.mutation-type.ValidationError.section') +
    this.translate.instant('accounting.mutation-type.ValidationError.required');
    this.DropdownConfig.Errors = [mutationTypeRequired];
    this.DropdownConfig.required = true;
  }
  SettingFalse() {
    if (this.Response.length > 0) {
      this.Response.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  isBusinessError(): boolean {
    this.mutationTypeDup = this.Response.reduce((array: MutationTypeConfigForAccountingModuleDto[], current) => {
      if ((
        !array.some(
          (item: MutationTypeConfigForAccountingModuleDto) => item.mutationTypeList?.caption == current.mutationTypeList?.caption 
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.mutationTypeDup.length != this.Response.length) {
      return true;
    }
    else {
      this.mutationTypeDup = [];
      return false;
    }
  }

  clickGrid(dataselected: MutationTypeConfigForAccountingModuleDto) {
    if (dataselected) {
      if (!this.userDetailsform.invalid) {
        if (!this.isBusinessError()) {
          this.SettingFalse();
          this.index = this.Response.findIndex(item => {
            return item == dataselected
          })
          this.Response[this.index].isEntered = true;
          this.section = dataselected;
          this.editable = true;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.DropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {
    if ((!this.userDetailsform.invalid) ||
      this.Response.length == 0) {

      if (!this.isBusinessError()) {
        const mutationTypeObj = new MutationTypeConfigForAccountingModuleDto();
        this.SettingFalse();
        mutationTypeObj.isEntered = true;
        mutationTypeObj.state = DtoState.Created;
        mutationTypeObj.pKey = 0;
        mutationTypeObj.canValidate = false;
        mutationTypeObj.rowVersion = 0;
        const newlist = this.Response;
        newlist.push({ ...mutationTypeObj });
        this.Response = [...newlist];
        this.userDetailsform.resetForm();
        this.section = new MutationTypeConfigForAccountingModuleDto();
        this.section = this.Response[this.Response.length - 1]
        this.Nothide = true;
        this.RemoveBusinessError(this.businessError)
        this.DropdownConfig.externalError = false;
        this.editable = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.DropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: MutationTypeConfigForAccountingModuleDto, array: MutationTypeConfigForAccountingModuleDto[]) {
    if (!this.userDetailsform.invalid || ((event.mutationTypeList?.caption == null ) &&
      event.isEntered)) {
      if (!this.isBusinessError() || (this.isBusinessError() && event.isEntered)) {
        const deletedata = array.findIndex(data => {
          return data == event;
        })
        if (event.state != DtoState.Created) {
          event.state = DtoState.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.Response = [...array];
        if (this.Response.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
        }
        if (this.Response.length > 0) {
          this.SettingFalse();
          this.section = this.Response[this.Response.length - 1]
          this.Response[this.Response.length - 1].isEntered = true;
          this.editable = true;
        }
        this.RemoveBusinessError(this.businessError);
        this.DropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }      
    }
    else {
      this.DropdownConfig.externalError = true;
    }
  }

  changeMutationTypeName(event: any) {
    this.index = this.Response.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.Response[this.index].state == DtoState.Unknown) {
      this.Response[this.index].state = DtoState.Dirty;
    }

    if (event?.value != null) {
      this.Response[this.index].mutationTypeList = event?.value;
      this.section.mutationTypeList = event?.value;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
    }
    else {
      this.Response[this.index].mutationTypeList = null as unknown as MutationTypeDto;
      this.section.mutationTypeList = null as unknown as MutationTypeDto;
      this.DropdownConfig.externalError = true;
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

  onclose() {
    const unsaved = this.Response.findIndex(x => {
      return x.state == DtoState.Created || x.state == DtoState.Dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: MutationTypeConfigForAccountingModuleDto[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.DropdownConfig.externalError = false;
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }


  onSave(GridData: MutationTypeConfigForAccountingModuleDto[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }
    else if (!this.userDetailsform.invalid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(y => {
        if (y.state == DtoState.Deleted && y.mutationTypeList?.caption == null) {
          y.mutationTypeList = null as unknown as MutationTypeDto;
        }
      })


      this.spinnerService.setIsLoading(true);
      this.mutationService.saveMutationTypeScreenData(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {
          this.editable = true;
          this.show = false;
          this.deletedRecords = [...new Array<MutationTypeConfigForAccountingModuleDto>()];

          this.mutationService.getMutationTypeScreenData().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as MutationTypeConfigForAccountingModuleDto[]
            this.Response = [...getResponse];

            this.DropdownConfig.externalError = false;

            if (this.Response.length > 0) {

              this.SettingFalse();
              this.index = this.Response.findIndex(i => {
                return ((i.mutationTypeList?.caption == this.section.mutationTypeList?.caption))
              })
              this.Response[this.index].isEntered = true;
              this.section = this.Response[this.index]
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
              this.deletedRecords = [...new Array<MutationTypeConfigForAccountingModuleDto>()];
              this.exceptionBox = true;
            })
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
          this.deletedRecords = [...new Array<MutationTypeConfigForAccountingModuleDto>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.DropdownConfig.externalError = true;
    }
  }


  ngOnInit(): void {
    this.buildConfiguration();
    
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.mutationtypeData
        this.Response = [...getResponse];
        this.deletedRecords = [...new Array<MutationTypeConfigForAccountingModuleDto>()];
        this.index = 0;
        if (this.Response.length > 0) {
          this.Nothide = true;
          this.SettingFalse();
          this.Response[this.index].isEntered = true;
          this.section = this.Response[this.index];
        }
      }
    }
    )
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        this.mutationTypeNameResponse = res.mutationTypeList
      }
    })
  }
}
