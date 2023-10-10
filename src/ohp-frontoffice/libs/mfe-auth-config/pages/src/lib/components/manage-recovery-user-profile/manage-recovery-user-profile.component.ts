import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlsBaseService, FluidControlTextBoxConfig, ErrorDto, ValidationErrorDto, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core';
import { RecoveryUserProfileService } from './service/recovery-user-profile.service';
import { ConfigContextService } from '@close-front-office/shared/config';
import { DtoState, FunctionalityInfoDto, GetRecoveryUserProfileScreenDto, RecoveryUserProfileDto, RecoveryUserProfileScreenDto } from './models/recovery-user-profile.model';

@Component({
  selector: 'mauth-manage-recovery-user-profile',
  templateUrl: './manage-recovery-user-profile.component.html',
  styleUrls: ['./manage-recovery-user-profile.component.scss']
})
export class ManageRecoveryUserProfileComponent implements OnInit {

  @ViewChild("UserProfileForm", { static: true }) UserProfileForm!: NgForm;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public SequenceTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;


  userProfileList!: RecoveryUserProfileDto[]
  userProfileScreenData!: GetRecoveryUserProfileScreenDto
  userProfileDetail!: RecoveryUserProfileDto
  userProfileHeader!: any[]
  LinkedWebMenuHeader!: any[]
  LinkedWebFunctionalityHeader!: any[]
  LinkedFunctionalitiesHeader!: any[]
  LinkedApplicationHeader!: any[]
  LinkedPortalMenuHeader!: any[]
  LinkedPortalFuncHeader!: any[]
  saveUserProfile: RecoveryUserProfileScreenDto = new RecoveryUserProfileScreenDto
  dataSelected: any
  exceptionBox!: boolean
  showDialog!: boolean
  navigateUrl!: string
  showDetails!: boolean
  errorCode!: string
  intMaxValue = 2147483647;
  validationHeader = this.translate.instant('validation.validationHeader');

  constructor(public fluidService: FluidControlsBaseService, private translate: TranslateService, public service: RecoveryUserProfileService,
    public route: ActivatedRoute, private spinnerService: SpinnerService, private fluidValidation: fluidValidationService, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {

    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.userProfileScreenData = res.recoveryUserProfileScreenData;
      console.log(res.recoveryUserProfileScreenData)
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.userProfileList = res.recoveryUserProfileData;

      this.settingListValues();

      if (this.userProfileList.length > 0) {
        this.showDetails = true;
        this.settingIsSelectedFalse();
        this.userProfileList[0].isSelected = true;
        this.userProfileDetail = this.userProfileList[0];
      }
      else {
        this.showDetails = false;
      }
    })

    this.userProfileHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.userprofile'), field: 'name', width: '95%' },
      { header: '', field: '', fieldType: 'deleteButton', width: '5%' }
    ]

    this.LinkedWebMenuHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.access'), field: 'isAccessible', property: 'access', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.linkedWebMenu'), field: 'name.caption', property: 'label', width: '40%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.landingPage'), field: 'isDefault', property: 'landingPage', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.sequence'), field: 'seq', property: 'sequence', width: '25%' }
    ]

    this.LinkedWebFunctionalityHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.access'), field: 'isAccessible', fieldType: 'checkbox', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.linkedWebFunctionalities'), field: 'name.caption', width: '80%' }
    ]

    this.LinkedFunctionalitiesHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.access'), field: 'isAccessible', property: 'access', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.linkedFunctionalities'), field: 'name.caption', property: 'label', width: '60%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.landingPage'), field: 'isDefault', property: 'landingPage', width: '20%' }
    ]

    this.LinkedApplicationHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.access'), field: 'isAccessible', fieldType: 'checkbox', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.linkedAppItems'), field: 'name.caption', width: '80%' }
    ]

    this.LinkedPortalMenuHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.access'), field: 'isAccessible', fieldType: 'checkbox', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.linkedPortalItems'), field: 'name.caption', width: '80%' }
    ]

    this.LinkedPortalFuncHeader = [
      { header: this.translate.instant('manage-recovery-user-profile.table.access'), field: 'isAccessible', fieldType: 'checkbox', width: '20%' },
      { header: this.translate.instant('manage-recovery-user-profile.table.linkedPortalFunc'), field: 'name.caption', width: '80%' }
    ]

  }

  onSave(userProfileData: RecoveryUserProfileDto[]) {
    let isValid = -1
    const index = this.userProfileList.findIndex(x => x.isSelected);
    isValid = this.userProfileList[index]?.webMenuItemList?.findIndex(x => x.isAccessible && x.seq == null)

    this.RemoveBusinessError(this.translate.instant('manage-recovery-user-profile.validation.oneDefaultUserProfile'))
    let count = 0;
    userProfileData.forEach(x => {
      if (x.isDefaultDebtorProfileForPortal) {
        count = count + 1;
      }
    })

    if (this.UserProfileForm.valid && !this.IsDuplicateName() && count < 2 && (isValid == -1)) {

      userProfileData.forEach(x => {
        x.webMenuItemList.forEach(y => {
          if (y.isDefault) {
            x.defaultWebFunctionality = y;
          }
        })

        x.functionalityMenuItemInfo.forEach(y => {
          if (y.isDefault) {
            x.defaultFunctionality = y;
          }
        })
      })

      userProfileData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.saveUserProfile.userProfileDetail.push({ ...x })
        }
      });

      this.saveUserProfile.userProfileDetail.forEach(x => {
        x.webFunctionalityList = x.webFunctionalityList.filter(y => y.isAccessible)
        x.functionalityApplicationRelatedActionInfo = x.functionalityApplicationRelatedActionInfo.filter(y => y.isAccessible)
        x.portalFunctionalityInfo = x.portalFunctionalityInfo.filter(y => y.isAccessible)
        x.portalMenuItemInfo = x.portalMenuItemInfo.filter(y => y.isAccessible)
      })

      if (this.saveUserProfile.userProfileDetail.length > 0) {
        this.spinnerService.setIsLoading(true);
        this.service.saveUserProfiles(this.saveUserProfile).subscribe(result => {
          this.service.getUserProfiles().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            this.userProfileList = res;

            this.settingListValues();

            if (this.userProfileList.length > 0) {
              const index = this.userProfileList.findIndex(x => x.name == this.userProfileDetail.name)
              this.showDetails = true;
              this.settingIsSelectedFalse();
              this.userProfileList[index].isSelected = true;
              this.userProfileDetail = this.userProfileList[index];
            }
            else {
              this.showDetails = false;
            }

            this.saveUserProfile.userProfileDetail = [];
          }, err => {
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
            this.saveUserProfile.userProfileDetail = [];
            if (err?.error?.errorCode) {
              this.errorCode = err?.error?.errorCode;
            }
            else {
              this.errorCode = 'InternalServiceFault';
            }
          })
        }, err => {
          this.spinnerService.setIsLoading(false);
          this.exceptionBox = true;
          this.saveUserProfile.userProfileDetail = [];
          if (err?.error?.errorCode) {
            this.errorCode = err?.error?.errorCode;
          }
          else {
            this.errorCode = 'InternalServiceFault';
          }
        })
      }
    }
    else {
      this.settingExternalErrorTrue();
      if (count > 1) {
        this.throwBusinessError(this.translate.instant('manage-recovery-user-profile.validation.oneDefaultUserProfile'))
      }
      if (isValid != -1) {
        this.userProfileDetail.webMenuItemList.forEach(x => {
          if (!x.isAccessible) {
            this.SequenceTextBoxconfig.externalError = true;
          }
        })
      }
    }
  }

  addUserProfile() {
    let isValid = -1
    const index = this.userProfileList.findIndex(x => x.isSelected);
    isValid = this.userProfileList[index]?.webMenuItemList?.findIndex(x => x.isAccessible && x.seq == null);
    if (this.UserProfileForm.valid && !this.IsDuplicateName() && (isValid == -1 || isValid == undefined)) {
      this.showDetails = true;
      this.NameTextBoxconfig.externalError = false;
      this.SequenceTextBoxconfig.externalError = false;

      this.settingIsSelectedFalse();
      const newRow = new RecoveryUserProfileDto;
      newRow.isSelected = true;
      const newuserList = this.userProfileList;
      newuserList.push({ ...newRow });
      this.userProfileList = [...newuserList];
      this.userProfileDetail = new RecoveryUserProfileDto;
      this.userProfileScreenData.webMenuItemList.forEach(x => this.userProfileDetail.webMenuItemList.push({ ...x }));
      this.userProfileScreenData.webFunctionalityList.forEach(x => this.userProfileDetail.webFunctionalityList.push({ ...x }));
      this.userProfileScreenData.menuItemFunctionalityInfoList.forEach(x => this.userProfileDetail.functionalityMenuItemInfo.push({ ...x }));
      this.userProfileScreenData.applicationRelatedActionFunctionalityInfoList.forEach(x => this.userProfileDetail.functionalityApplicationRelatedActionInfo.push({ ...x }));
      this.userProfileScreenData.portalFunctionalityInfoList.forEach(x => this.userProfileDetail.portalFunctionalityInfo.push({ ...x }));
      this.userProfileScreenData.portalMenuItemInfoList.forEach(x => this.userProfileDetail.portalMenuItemInfo.push({ ...x }));
      this.userProfileDetail.pKey = 0;
      this.userProfileDetail.state = DtoState.Created;
      this.userProfileDetail.isSelected = true;
      this.userProfileDetail.isReadOnly = false;
      this.userProfileList[this.userProfileList.length - 1] = this.userProfileDetail;
    }
    else {
      this.settingExternalErrorTrue()
      if (isValid != -1) {
        this.userProfileDetail.webMenuItemList.forEach(x => {
          if (!x.isAccessible) {
            this.SequenceTextBoxconfig.externalError = true;
          }
        })
      }
    }
  }

  dataSelection(event: RecoveryUserProfileDto) {
    let isValid = -1
    const index = this.userProfileList.findIndex(x => x.isSelected);
    isValid = this.userProfileList[index]?.webMenuItemList?.findIndex(x => x.isAccessible && x.seq == null)
    if (this.UserProfileForm.valid && !this.IsDuplicateName() && (isValid == -1 || isValid == undefined)) {

      this.NameTextBoxconfig.externalError = false;
      this.SequenceTextBoxconfig.externalError = false;

      this.settingIsSelectedFalse();
      this.userProfileDetail = event;
      this.userProfileDetail.isSelected = true;
    }
    else {
      this.settingExternalErrorTrue()
      if (isValid != -1) {
        this.userProfileDetail.webMenuItemList.forEach(x => {
          if (!x.isAccessible) {
            this.SequenceTextBoxconfig.externalError = true;
          }
        })
      }
    }
  }

  onRowDelete(event: RecoveryUserProfileDto, gridData: RecoveryUserProfileDto[]) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    const isValid = this.userProfileList[index].webMenuItemList.findIndex(x => x.isAccessible && x.seq == null)
    if ((this.UserProfileForm.valid && !this.IsDuplicateName() && isValid == -1) || event.name == "" || event.name == undefined || (this.IsDuplicateName() && event.isSelected) || (isValid != -1 && event.isSelected)) {
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      this.RemoveSequenceErrors();

      if (this.userProfileList[deletedata].state != 1) {
        event.state = DtoState.Deleted;
        this.saveUserProfile.userProfileDetail.push({ ...event });
      }
      gridData.splice(deletedata, 1);
      this.userProfileList = [...gridData];

      if (this.userProfileList.length > 0) {
        this.settingIsSelectedFalse();
        this.userProfileList[this.userProfileList.length - 1].isSelected = true;
        this.userProfileDetail = this.userProfileList[this.userProfileList.length - 1];
      }
      else {
        this.NameTextBoxconfig.externalError = false;
        this.SequenceTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.showDetails = false;
        }, 1)
      }
    }
  }

  settingListValues() {
    this.userProfileList.forEach(x => {

      if (x.webMenuItemList.length != this.userProfileScreenData.webMenuItemList.length) {
        if (x.webMenuItemList.length == 0) {
          for (let i = 0; i < this.userProfileScreenData.webMenuItemList.length; i++) {
            x.webMenuItemList.push({ ...new FunctionalityInfoDto });
            x.webMenuItemList[i] = { ...this.userProfileScreenData.webMenuItemList[i] };
          }
        }
        else {
          x.webMenuItemList.forEach(y => this.userProfileScreenData.webMenuItemList.forEach(z => {
            const index = x.webMenuItemList.findIndex(x => x.pKey == z.pKey);
            if (z.pKey != y.pKey && index == -1) {
              let webMenuItemList = new FunctionalityInfoDto;
              webMenuItemList = { ...z };
              x.webMenuItemList.push({ ...webMenuItemList });
            }
          }))
        }
      }

      x.webMenuItemList.forEach(x => {
        if (!x.isAccessible) {
          x.seq = null as unknown as number
        }
      });

      if (x.webFunctionalityList.length != this.userProfileScreenData.webFunctionalityList.length) {
        if (x.webFunctionalityList.length == 0) {
          for (let i = 0; i < this.userProfileScreenData.webFunctionalityList.length; i++) {
            x.webFunctionalityList.push({ ...new FunctionalityInfoDto });
            x.webFunctionalityList[i] = { ...this.userProfileScreenData.webFunctionalityList[i] };
          }
        }
        else {
          x.webFunctionalityList.forEach(y => this.userProfileScreenData.webFunctionalityList.forEach(z => {
            const index = x.webFunctionalityList.findIndex(x => x.pKey == z.pKey);
            if (z.pKey != y.pKey && index == -1) {
              let webFunctionalityList = new FunctionalityInfoDto;
              webFunctionalityList = { ...z };
              x.webFunctionalityList.push(webFunctionalityList);
            }
          }))
        }
      }

      if (x.functionalityMenuItemInfo.length != this.userProfileScreenData.menuItemFunctionalityInfoList.length) {
        if (x.functionalityMenuItemInfo.length == 0) {
          for (let i = 0; i < this.userProfileScreenData.menuItemFunctionalityInfoList.length; i++) {
            x.functionalityMenuItemInfo.push({ ...new FunctionalityInfoDto });
            x.functionalityMenuItemInfo[i] = { ...this.userProfileScreenData.menuItemFunctionalityInfoList[i] };
          }
        }
        else {
          x.functionalityMenuItemInfo.forEach(y => this.userProfileScreenData.menuItemFunctionalityInfoList.forEach(z => {
            const index = x.functionalityMenuItemInfo.findIndex(x => x.pKey == z.pKey);
            if (z.pKey != y.pKey && index == -1) {
              let functionalityMenuItemInfo = new FunctionalityInfoDto;
              functionalityMenuItemInfo = { ...z };
              x.functionalityMenuItemInfo.push(functionalityMenuItemInfo);
            }
          }))
        }
      }

      if (x.functionalityApplicationRelatedActionInfo.length != this.userProfileScreenData.applicationRelatedActionFunctionalityInfoList.length) {
        if (x.functionalityApplicationRelatedActionInfo.length == 0) {
          for (let i = 0; i < this.userProfileScreenData.applicationRelatedActionFunctionalityInfoList.length; i++) {
            x.functionalityApplicationRelatedActionInfo.push({ ...new FunctionalityInfoDto });
            x.functionalityApplicationRelatedActionInfo[i] = { ...this.userProfileScreenData.applicationRelatedActionFunctionalityInfoList[i] };
          }
        }
        else {
          x.functionalityApplicationRelatedActionInfo.forEach(y => this.userProfileScreenData.applicationRelatedActionFunctionalityInfoList.forEach(z => {
            const index = x.functionalityApplicationRelatedActionInfo.findIndex(x => x.pKey == z.pKey);
            if (z.pKey != y.pKey && index == -1) {
              let functionalityApplicationRelatedActionInfo = new FunctionalityInfoDto;
              functionalityApplicationRelatedActionInfo = { ...z };
              x.functionalityApplicationRelatedActionInfo.push(functionalityApplicationRelatedActionInfo);
            }
          }))
        }
      }

      if (x.portalMenuItemInfo.length != this.userProfileScreenData.portalMenuItemInfoList.length) {
        if (x.portalMenuItemInfo.length == 0) {
          for (let i = 0; i < this.userProfileScreenData.portalMenuItemInfoList.length; i++) {
            x.portalMenuItemInfo.push({ ...new FunctionalityInfoDto });
            x.portalMenuItemInfo[i] = { ...this.userProfileScreenData.portalMenuItemInfoList[i] };
          }
        }
        else {
          x.portalMenuItemInfo.forEach(y => this.userProfileScreenData.portalMenuItemInfoList.forEach(z => {
            const index = x.portalMenuItemInfo.findIndex(x => x.pKey == z.pKey);
            if (z.pKey != y.pKey && index == -1) {
              let portalMenuItemInfo = new FunctionalityInfoDto;
              portalMenuItemInfo = { ...z };
              x.portalMenuItemInfo.push(portalMenuItemInfo);
            }
          }))
        }
      }

      if (x.portalFunctionalityInfo.length != this.userProfileScreenData.portalFunctionalityInfoList.length) {
        if (x.portalFunctionalityInfo.length == 0) {
          for (let i = 0; i < this.userProfileScreenData.portalFunctionalityInfoList.length; i++) {
            x.portalFunctionalityInfo.push({ ...new FunctionalityInfoDto });
            x.portalFunctionalityInfo[i] = { ...this.userProfileScreenData.portalFunctionalityInfoList[i] };
          }
        }
        else {
          x.portalFunctionalityInfo.forEach(y => this.userProfileScreenData.portalFunctionalityInfoList.forEach(z => {
            const index = x.portalFunctionalityInfo.findIndex(x => x.pKey == z.pKey);
            if (z.pKey != y.pKey && index == -1) {
              let portalFunctionalityInfo = new FunctionalityInfoDto;
              portalFunctionalityInfo = { ...z };
              x.portalFunctionalityInfo.push(portalFunctionalityInfo);
            }
          }))
        }
      }

      if (x.defaultWebFunctionality != null) {
        x.webMenuItemList.forEach(y => {
          if (y.name?.codeId == x.defaultWebFunctionality?.name?.codeId) {
            y.isDefault = true;
          }
          else {
            y.isDefault = false;
          }
        })
      }


      if (x.defaultFunctionality != null) {
        x.functionalityMenuItemInfo.forEach(y => {
          if (y.name?.codeId == x.defaultFunctionality?.name?.codeId) {
            y.isDefault = true;
          }
          else {
            y.isDefault = false;
          }
        })
      }
    })
    
  }

  IsDuplicateName(): boolean {
    const valueArr = this.userProfileList.map(function (item) {
      return item.name
    });
    return valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
  }

  settingIsSelectedFalse() {
    this.userProfileList.forEach(x => x.isSelected = false);
  }

  settingUserProfileDirty() {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    if (this.userProfileList[index].state != DtoState.Created) {
      this.userProfileList[index].state = DtoState.Dirty;
    }
  }

  onChangeName(event: any) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    this.settingUserProfileDirty();
    this.userProfileList[index].name = event?.target?.value;
    this.userProfileDetail.name = event?.target?.value;
    if (event?.target?.value == "") {
      this.NameTextBoxconfig.externalError = true;
    }
  }

  onChangeIsReadOnly(event: boolean) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    this.settingUserProfileDirty();
    this.userProfileList[index].isReadOnly = event;
    this.userProfileDetail.isReadOnly = event;
  }

  onChangeIsDefaultDebtorProfileForPortal(event: boolean) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    this.settingUserProfileDirty();
    this.userProfileList[index].isDefaultDebtorProfileForPortal = event;
    this.userProfileDetail.isDefaultDebtorProfileForPortal = event;
  }

  onChangeWebMenuIsAccessible(event: boolean, rowData: FunctionalityInfoDto) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    this.settingUserProfileDirty();
    const listIndex = this.userProfileList[index].webMenuItemList.findIndex(x => x.name?.codeId == rowData.name.codeId)
    this.userProfileList[index].webMenuItemList[listIndex].isAccessible = event;
    this.userProfileDetail.webMenuItemList[listIndex].isAccessible = event;
  }

  onChangeWebMenuLandingPage(event: boolean, rowData: FunctionalityInfoDto) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    this.settingUserProfileDirty();
    this.userProfileList[index].webMenuItemList.forEach(x => x.isDefault = false);
    const listIndex = this.userProfileList[index].webMenuItemList.findIndex(x => x.name?.codeId == rowData.name.codeId)
    this.userProfileList[index].webMenuItemList[listIndex].isDefault = event;
    this.userProfileDetail.webMenuItemList[listIndex].isDefault = event;
  }

  onChangeSeq(event: any, rowData: FunctionalityInfoDto) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    const listIndex = this.userProfileList[index].webMenuItemList.findIndex(x => x.name?.codeId == rowData.name.codeId)
    this.settingUserProfileDirty();
    if (event != null) {
      this.userProfileList[index].webMenuItemList[listIndex].seq = parseInt(event);
      this.userProfileDetail.webMenuItemList[listIndex].seq = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.userProfileList[index].webMenuItemList[listIndex].seq = null as unknown as number;
        this.userProfileDetail.webMenuItemList[listIndex].seq = null as unknown as number;
        this.SequenceTextBoxconfig.externalError = true;
      }
    }
    else {
      this.userProfileDetail.webMenuItemList[listIndex].seq = event;
      setTimeout(() => {
        this.userProfileList[index].webMenuItemList[listIndex].seq = 0;
        this.userProfileDetail.webMenuItemList[listIndex].seq = 0;
        this.SequenceTextBoxconfig.externalError = true;
      }, 1)
    }
  }

  onChangeFuncMenuIsAccessible(event: boolean, rowData: FunctionalityInfoDto) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    const listIndex = this.userProfileList[index].functionalityMenuItemInfo.findIndex(x => x.name?.codeId == rowData.name.codeId)
    this.settingUserProfileDirty();
    this.userProfileList[index].functionalityMenuItemInfo[listIndex].isAccessible = event;
    this.userProfileDetail.functionalityMenuItemInfo[listIndex].isAccessible = event;
  }

  onChangeFuncMenuLandingPage(event: boolean, rowData: FunctionalityInfoDto) {
    const index = this.userProfileList.findIndex(x => x.isSelected);
    this.settingUserProfileDirty();
    this.userProfileList[index].functionalityMenuItemInfo.forEach(x => x.isDefault = false);
    const listIndex = this.userProfileList[index].functionalityMenuItemInfo.findIndex(x => x.name?.codeId == rowData.name.codeId)
    this.userProfileList[index].functionalityMenuItemInfo[listIndex].isDefault = event;
    this.userProfileDetail.functionalityMenuItemInfo[listIndex].isDefault = event;
  }

  onWebFunctionalityChange(event: any) {
    this.settingUserProfileDirty();
  }

  onApplicationFunctionalityChange(event: any) {
    this.settingUserProfileDirty();
  }

  onPortalMenuChange(event: any) {
    this.settingUserProfileDirty();
  }

  onPortalFunctionalityChange(event: any) {
    this.settingUserProfileDirty();
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.userProfileList.findIndex(x => x.state == DtoState.Created || x.state == DtoState.Dirty);
    if (this.saveUserProfile.userProfileDetail.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(userProfileList: RecoveryUserProfileDto[]) {
    this.showDialog = false;
    this.onSave(userProfileList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.NameTextBoxconfig.externalError = false;
    this.RemoveBusinessError(this.translate.instant('manage-recovery-user-profile.validation.oneDefaultUserProfile'))
    this.RemoveBusinessError(this.translate.instant('manage-recovery-user-profile.validation.uniqueName'))
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }

  onClickCancel() {
    this.showDialog = false;
  }

  settingExternalErrorTrue() {
    this.NameTextBoxconfig.externalError = true;
    if (this.IsDuplicateName()) {
      this.throwBusinessError(this.translate.instant('manage-recovery-user-profile.validation.uniqueName'));
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
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }

    })
  }

  RemoveSequenceErrors() {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('manage-recovery-user-profile.validation.sequence'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, this.userProfileScreenData?.webMenuItemList?.length);
      }
    })
  }

  buildConfiguration() {
    const requiredError = new ErrorDto;
    requiredError.validation = "required";
    requiredError.isModelError = true;
    requiredError.validationMessage = this.translate.instant('manage-recovery-user-profile.validation.name');
    this.NameTextBoxconfig.required = true;
    this.NameTextBoxconfig.Errors = [requiredError];

    const seqError = new ErrorDto;
    seqError.validation = "required";
    seqError.isModelError = true;
    seqError.validationMessage = this.translate.instant('manage-recovery-user-profile.validation.sequence');
    this.SequenceTextBoxconfig.required = true
    this.SequenceTextBoxconfig.Errors = [seqError];
  }
}
