import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { RoleTypeService } from './Service/role-type.service';
import { cmRoleType2PartyQualityCodeTables } from './Models/cmRoleType2PartyQualityCodeTables.model';
import { cmRoleType2PartyQuality } from './Models/cmRoleType2PartyQuality.model';
import { stateModel } from './Models/state.model';
import { codeTable } from '../prepayment-reason/Models/codeTable.model';

@Component({
  selector: 'maic-role-type',
  templateUrl: './role-type.component.html',
  styleUrls: ['./role-type.component.scss']
})
export class RoleTypeComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;


  placeholder = 'select';
  Header = this.translate.instant('app-instance.validation.validationHeader')
  codeTableList!: cmRoleType2PartyQualityCodeTables;
  roleTypeList2PartyQuality: cmRoleType2PartyQuality[] = [];
  roleType2PartyQualityCard!: cmRoleType2PartyQuality;
  deletedRecords: cmRoleType2PartyQuality[] = [];
  index: any
  targetList: codeTable[] = [];
  source: codeTable[] = [];
  target: codeTable[] = [];
  roleType: codeTable[] = [];
  roletypeHeader!: any[];
  DuplicateBusinessError = this.translate.instant('app-instance.roleType.mandatory.DupBusinessError');
  PicklistError = this.translate.instant('app-instance.roleType.mandatory.PicklistError') + this.translate.instant('app-instance.roleType.mandatory.required');
  notEditable!: boolean;
  exceptionBox!: boolean;
  show!: boolean;
  Nothide!: boolean;
  isErrors!: boolean;
  navigateUrl!: string
  errorCode!:string
 
  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public roleTypeService: RoleTypeService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }
  SettingFalse() {
    this.roleTypeList2PartyQuality.forEach(x => x.isEntered = false)
  }

  DuplicateCheck(): boolean {
    const mappedData = this.roleTypeList2PartyQuality.map(item => {
      return item.partyQualityName?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (hasValue)
      return true;
    else return false;
  }

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.roleTypeList2PartyQuality[index].roleTypeList.forEach(user => {
      const filter = this.codeTableList.roleTypeList.findIndex(y => {
        return user.codeId == y.codeId;
      });
      if (filter != -1) {
        this.targetList.push(this.codeTableList.roleTypeList[filter]);
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.codeTableList.roleTypeList];
    this.target.forEach(user => {
      const index = sourcelist.findIndex(value => {
        return value.codeId == user.codeId;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];
  }

  changePartyQuality(event: any) {
    this.index = this.roleTypeList2PartyQuality.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.roleTypeList2PartyQuality[this.index].state == stateModel.Unknown) {
      this.roleTypeList2PartyQuality[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.roleTypeList2PartyQuality[this.index].partyQualityName = event?.value;
      this.roleType2PartyQualityCard.partyQualityName = event?.value;

    }
    else {
      this.roleTypeList2PartyQuality[this.index].partyQualityName = null as unknown as codeTable;
      this.roleType2PartyQualityCard.partyQualityName = null as unknown as codeTable;
      if (this.DuplicateCheck()) {
        this.throwBusinessError(this.DuplicateBusinessError);
      }
      else {
        this.RemoveBusinessError(this.DuplicateBusinessError);
      }
      this.DropdownConfig.externalError = true;
    }
  }

  changeTarget(event: codeTable[]) {
    if (event != null && event.length != 0) {
      console.log(event)
        this.index = this.roleTypeList2PartyQuality.findIndex(get => {
          return get.isEntered == true;
        });
     
      if (this.roleTypeList2PartyQuality[this.index].state == stateModel.Unknown) {
        this.roleTypeList2PartyQuality[this.index].state = stateModel.Dirty;
      }
      this.roleType = [];
      event.forEach(x => {
        const dupIndex = this.roleType.findIndex(y => {
          return y.caption == x.caption;
        });
        if (dupIndex == -1) {
          this.roleType.push(x);
        }
      });
      this.roleTypeList2PartyQuality[this.index].roleTypeList = this.roleType;
      this.RemoveBusinessError(this.PicklistError)
    }
  }

  clickGrid(data: cmRoleType2PartyQuality) {
    if (data) {
      
      if ((!this.userDetailsform.invalid && this.target.length != 0)) {
        if (!this.DuplicateCheck()) {
          this.SettingFalse();
          this.index = this.roleTypeList2PartyQuality.findIndex(item => {
            return item == data;
          });
          this.roleTypeList2PartyQuality[this.index].isEntered = true;
          this.notEditable = true;
          this.roleType2PartyQualityCard = data;
          this.assigningSourceTarget(this.index);
          this.RemoveBusinessError(this.DuplicateBusinessError);
          this.DropdownConfig.externalError = false;
          this.RemoveBusinessError(this.PicklistError);
        } else {
          this.throwBusinessError(this.DuplicateBusinessError);
        }
      } else {
        this.DropdownConfig.externalError = true;
        if (this.target.length == 0) {
          this.throwBusinessError(this.PicklistError)
        }
      }
    }
  }

  addRow() {
    
    if ((!this.userDetailsform.invalid && this.target.length != 0) || this.roleTypeList2PartyQuality.length == 0) {
      if (!this.DuplicateCheck() ) {
        this.SettingFalse();
        const addRow = new cmRoleType2PartyQuality();
        addRow.state = stateModel.Dirty;
        addRow.pKey = 0;
        addRow.canValidate = false;
        addRow.isEntered = true;
        addRow.rowVersion = 0;
        addRow.roleTypeList = [];
        this.notEditable = false;
        this.target = [];
        this.roleType = [];
      this.source = [...this.codeTableList.roleTypeList];
      const newlist = this.roleTypeList2PartyQuality;
        newlist.push({ ...addRow });
      this.roleTypeList2PartyQuality = [...newlist];
        this.Nothide = true;
       this.roleType2PartyQualityCard = new cmRoleType2PartyQuality();
        this.roleType2PartyQualityCard = this.roleTypeList2PartyQuality[this.roleTypeList2PartyQuality.length - 1]
        this.RemoveBusinessError(this.DuplicateBusinessError);
        this.RemoveBusinessError(this.PicklistError);
        this.DropdownConfig.externalError = false;
      } else {
       
         this.throwBusinessError(this.DuplicateBusinessError);
      }
    } else {
      this.DropdownConfig.externalError = true;
      if (this.target.length == 0) {
        this.throwBusinessError(this.PicklistError)
      }
    }
  }

  onRowDelete(event: cmRoleType2PartyQuality, array: cmRoleType2PartyQuality[]) {
    
    if (((event.partyQualityName?.caption == null || this.target.length == 0) &&
      event.isEntered) || (!this.userDetailsform.invalid && this.target.length != 0)
    ) {
      const deletedata = array.findIndex(data => {
        return data == event;
      });

      if (!this.DuplicateCheck() || (this.DuplicateCheck() && event.isEntered)){
      if (event.state != stateModel.Created) {
        event.state = stateModel.Deleted;
        this.deletedRecords.push({ ...event });
        }
        array.splice(deletedata, 1);
        this.RemoveBusinessError(this.DuplicateBusinessError);
        this.DropdownConfig.externalError = false;
        this.RemoveBusinessError(this.PicklistError);

        this.roleTypeList2PartyQuality = [...array];
      if (this.roleTypeList2PartyQuality.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
        }
      if (this.roleTypeList2PartyQuality.length > 0) {
        this.SettingFalse();
        this.roleType2PartyQualityCard = this.roleTypeList2PartyQuality[this.roleTypeList2PartyQuality.length - 1]
        this.roleTypeList2PartyQuality[this.roleTypeList2PartyQuality.length - 1].isEntered = true;
        this.assigningSourceTarget(this.roleTypeList2PartyQuality.length - 1);
        this.notEditable = true;
       }
        
      } else {
        this.throwBusinessError(this.DuplicateBusinessError);
      }
    } else {
      this.DropdownConfig.externalError = true;
      if (this.target.length == 0) this.throwBusinessError(this.PicklistError);
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
    const unsaved = this.roleTypeList2PartyQuality.findIndex(x => {
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
  onYes(GridData: cmRoleType2PartyQuality[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.DuplicateBusinessError);
    this.DropdownConfig.externalError = false;
    this.RemoveBusinessError(this.PicklistError);
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }

  onSave(GridData: cmRoleType2PartyQuality[]) {

    if (this.DuplicateCheck()) {
      this.throwBusinessError(this.DuplicateBusinessError);
       this.isErrors = true;
    } else if (!this.userDetailsform.invalid && this.target.length != 0) {
      this.isErrors = false;
      const saveData = [...GridData];
    saveData.forEach(x => {
      if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x });
        }
        this.deletedRecords.forEach(y => {
          if (y.state == stateModel.Deleted && y.partyQualityName?.caption == null) {
            y.partyQualityName = null as unknown as codeTable;
          }
        });
      });

      console.log(this.deletedRecords)
    this.spinnerService.setIsLoading(true);
      this.roleTypeService.PutRoleTypeList(this.deletedRecords).subscribe(
        res => {
          this.notEditable = true;
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<cmRoleType2PartyQuality>()];

        this.roleTypeService.GetRoleTypeListResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = [ ...(res as cmRoleType2PartyQuality[]) ];
            this.roleTypeList2PartyQuality = [...getResponse];

          this.DropdownConfig.externalError = false;
          this.RemoveBusinessError(this.DuplicateBusinessError)
          this.RemoveBusinessError(this.PicklistError);

          if (this.roleTypeList2PartyQuality.length > 0) {
             this.Nothide = true;
              this.SettingFalse();
            this.index = this.roleTypeList2PartyQuality.findIndex(section => {
                return (
                  section.partyQualityName?.caption == this.roleType2PartyQualityCard.partyQualityName?.caption
                );
              });

            this.roleTypeList2PartyQuality[this.index].isEntered = true;
            this.roleType2PartyQualityCard = this.roleTypeList2PartyQuality[this.index];
            this.assigningSourceTarget(this.index);
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
              this.deletedRecords = [...new Array<cmRoleType2PartyQuality>()];
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
          this.deletedRecords = [...new Array<cmRoleType2PartyQuality>()];
          this.exceptionBox = true;
        }
      );
    }
    else {
      this.isErrors = true;
      this.DropdownConfig.externalError = true;
      if (this.target.length == 0) this.throwBusinessError(this.PicklistError);
    }
  }

  ngOnInit(): void {

   this.buildConfiguration()

    this.roletypeHeader = [
      { header: this.translate.instant('app-instance.roleType.tabel.PartyQualityName'), field: 'partyQualityName.caption', width: '95%' },
      { field: 'Delete', width: '5%',fieldType:"deleteButton" }];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      this.codeTableList = res.codeTableData as cmRoleType2PartyQualityCodeTables
      console.log(this.codeTableList)
    }
    )

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      if (res) {
        const getResponse = res.roleTypeListData

        this.roleTypeList2PartyQuality = [...getResponse];
        console.log(this.roleTypeList2PartyQuality)
        this.deletedRecords = [...new Array<cmRoleType2PartyQuality>()];
        this.index = 0;
        if (this.roleTypeList2PartyQuality.length > 0) {
          this.Nothide = true;
          this.notEditable = true;
          this.SettingFalse();
          this.roleTypeList2PartyQuality[this.index].isEntered = true;
          this.roleType2PartyQualityCard = this.roleTypeList2PartyQuality[this.index];
          this.assigningSourceTarget(this.index);
        } else
        {
          this.Nothide = false;
        }
      }
    }
    )

    
  }

  buildConfiguration() {
    const partyQualityRequired = new ErrorDto();
    partyQualityRequired.validation = 'required';
    partyQualityRequired.isModelError = true;
    partyQualityRequired.validationMessage =
      this.translate.instant('app-instance.roleType.mandatory.PartyQualityName') +
    this.translate.instant('app-instance.roleType.mandatory.required');
    this.DropdownConfig.Errors = [partyQualityRequired];
    this.DropdownConfig.required = true;
  }
}
