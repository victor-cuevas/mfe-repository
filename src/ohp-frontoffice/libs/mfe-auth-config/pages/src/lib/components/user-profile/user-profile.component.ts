
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlsBaseService, FluidControlTextBoxConfig, ErrorDto, ValidationErrorDto, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core';
import { FunctionalityInfoDto, ManageUserProfileScreenDto, UserProfileDetailDto } from '../../components/user-profile/models/manage-user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { ConfigContextService } from '@close-front-office/shared/config';
import { UserProfileService } from './service/user-profile.service';

@Component({
  selector: 'mauth-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  @ViewChild("UserProfile", { static: true }) UserProfile!: NgForm;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  dataSelected: any;
  showDialog!: boolean;
  showUserProfileDetail!: boolean
  userProfileList: ManageUserProfileScreenDto = new ManageUserProfileScreenDto;
  userProfileDetail: UserProfileDetailDto = new UserProfileDetailDto;
  FunctionalityInfo: FunctionalityInfoDto[] = [];
  saveUserProfile: ManageUserProfileScreenDto = new ManageUserProfileScreenDto;
  selectUserHeader = [{ header: this.translate.instant('userProfile.labels.functionalities'), field: 'functionalityCaption', width: '70%' }, { header: '', field: 'functionalityId', width: '10%' }, { header: this.translate.instant('userProfile.labels.access'), field: 'isAccessible', fieldType: 'checkbox', width: '20%' }];
  selectUserProfileHeader = [{ header: this.translate.instant('userProfile.labels.name'), field: 'name', width: '80%' }, { header: '', field: '', width: '20%' }]
  isReadOnly!: boolean;
  validationHeader = this.translate.instant('validation.validationHeader');
  navigateUrl!: string
  exceptionBox!: boolean
  errorCode!: string

  constructor(public fluidService: FluidControlsBaseService, private service: UserProfileService, public route: ActivatedRoute, private commonService: ConfigContextService,
    private translate: TranslateService, private fluidValidation: fluidValidationService, private spinnerService: SpinnerService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.isReadOnly = true;
    this.route.data.subscribe((res:any) => {
      if (res.userProfileData != null) {
        this.spinnerService.setIsLoading(false);
        this.userProfileList = res.userProfileData;
        this.userProfileList.userProfileDetail.forEach(x => {
          if (x.functionalityInfo.length != this.userProfileList.functionalityInfoList.length) {
            if (x.functionalityInfo.length == 0) {
              for (let i = 0; i < this.userProfileList.functionalityInfoList.length; i++) {
                x.functionalityInfo.push({ ...new FunctionalityInfoDto });
                x.functionalityInfo[i] = { ...this.userProfileList.functionalityInfoList[i] };
              }
            }
            else {
              x.functionalityInfo.forEach(y => this.userProfileList.functionalityInfoList.forEach(z => {
                const index = x.functionalityInfo.findIndex(x => x.functionalityId == z.functionalityId);
                if (z.functionalityId != y.functionalityId && index == -1) {
                  let functionalityList = new FunctionalityInfoDto;
                  functionalityList = z;
                  x.functionalityInfo.push(functionalityList);
                }
              }))
            }
          }
          setTimeout(() => {
            this.userProfileList.userProfileDetail.forEach(x => {
              x.functionalityInfo.sort((a, b) => {
                return (a.functionalityCaption.toLowerCase() < b.functionalityCaption.toLowerCase()) ? -1 : 1;
              })
            });
          }, 2)
        })
        if (this.userProfileList.userProfileDetail.length > 0) {
          this.showUserProfileDetail = true;
          this.userProfileList.userProfileDetail[0].isSelected = true;
          this.userProfileDetail = this.userProfileList.userProfileDetail[0];
        }
        else {
          this.showUserProfileDetail = false;
        }
      }
    });
  }

  Duplicate(): boolean {
    const valueArr = this.userProfileList.userProfileDetail.map(function (item) { return item.name });
    return valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
  }

  dataSelection(event: UserProfileDetailDto) {
    if (this.UserProfile.valid) {
      this.settingIsSelectedFalse();
      const valueArr = this.userProfileList.userProfileDetail.map(function (item) { return item.name });
      const isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });

      if (!isDuplicate) {
        if (event) {
          if (event.state == 1)
            this.isReadOnly = false;
          else
            this.isReadOnly = true;
          this.userProfileDetail = event;
          this.userProfileDetail.isSelected = true;
        }
      }
      else
        this.throwBusinessError(this.translate.instant('userProfile.validationError.uniqueName'));
    }
    else {
      this.RequiredTextBoxconfig.externalError = true;
    }
  }

  onFunctionalityChange(event: any) {

    const index = this.userProfileList.userProfileDetail.findIndex(x => x.isSelected)
    if (index != -1) {
      if (event.length != 0 && this.userProfileList.userProfileDetail[index].state != 1) {
        event.state = 3;
        this.userProfileList.userProfileDetail[index].state = 3;
      }
    }
  }

  onChangeName(event: any) {
    if (event.target?.value) {
      this.userProfileDetail.name = event.target?.value;
    }
    else {
      this.userProfileDetail.name = event.target?.value;
      this.RequiredTextBoxconfig.externalError = true;
    }
    if (!this.Duplicate()) {
      this.RemoveBusinessError(this.translate.instant('userProfile.validationError.uniqueName'))
    }
  }

  onChangeReadOnly(event: boolean) {
    const index = this.userProfileList.userProfileDetail.findIndex(x => x.isSelected)
    if (index != -1) {
      if (this.userProfileList.userProfileDetail[index].state != 1)
        this.userProfileList.userProfileDetail[index].state = 3;
    }
    this.userProfileList.userProfileDetail[index].isReadOnly = event;
    this.userProfileDetail.isReadOnly = event;

  }

  addUser() {
    const valueArr = this.userProfileList.userProfileDetail.map(function (item) { return item.name });
    const isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
    if (this.UserProfile.valid && !isDuplicate) {
      this.showUserProfileDetail = true;
      this.isReadOnly = false;
      const newRow = new UserProfileDetailDto;
      newRow.isSelected = true
      const newuserList = this.userProfileList.userProfileDetail;
      newuserList.push({ ...newRow });
      this.userProfileList.userProfileDetail = [...newuserList];
      this.settingIsSelectedFalse();
      this.userProfileDetail = new UserProfileDetailDto;
      this.UserProfile.resetForm();
      this.userProfileList.functionalityInfoList.forEach(x => this.userProfileDetail.functionalityInfo.push({ ...x }));
      this.userProfileDetail.pKey = 0;
      this.userProfileDetail.rowVersion = 1;
      this.userProfileDetail.defaultFunctionality = null;
      this.userProfileDetail.defaultWebFunctionality = null;
      this.userProfileDetail.state = 1;
      this.userProfileDetail.rights = [];
      this.userProfileDetail.isSelected = true;
      this.userProfileDetail.isReadOnly = false;
      this.userProfileList.userProfileDetail[this.userProfileList.userProfileDetail.length - 1] = this.userProfileDetail;
    }
    else {
      this.RequiredTextBoxconfig.externalError = true;
      if (isDuplicate) {
        this.throwBusinessError(this.translate.instant('userProfile.validationError.uniqueName'));
      }
    }

  }

  onSave(details: ManageUserProfileScreenDto) {

    const valueArr = this.userProfileList.userProfileDetail.map(function (item) { return item.name });
    const isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });

    if (this.UserProfile.valid && !isDuplicate) {
      const saveData = [...details.userProfileDetail];
      saveData.forEach(x => {
        if (x.state != 0) {
          this.saveUserProfile.userProfileDetail.push({ ...x })
        }
      });

      this.saveUserProfile.userProfileDetail.forEach(x => {
        x.functionalityInfo = x.functionalityInfo.filter(y => y.isAccessible)
      })

      this.spinnerService.setIsLoading(true);
      this.service.saveUserProfile(this.saveUserProfile).subscribe(result => {

        this.service.getUserProfileList().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          this.userProfileList = { ...res as ManageUserProfileScreenDto };

          this.userProfileList.userProfileDetail.forEach(x => {
            if (x.functionalityInfo.length != this.userProfileList.functionalityInfoList.length) {
              if (x.functionalityInfo.length == 0) {
                for (let i = 0; i < this.userProfileList.functionalityInfoList.length; i++) {
                  x.functionalityInfo.push({ ...new FunctionalityInfoDto });
                  x.functionalityInfo[i] = { ...this.userProfileList.functionalityInfoList[i] };
                }
              }
              else {
                x.functionalityInfo.forEach(y => this.userProfileList.functionalityInfoList.forEach(z => {
                  const index = x.functionalityInfo.findIndex(x => x.functionalityId == z.functionalityId);
                  if (z.functionalityId != y.functionalityId && index == -1) {
                    let functionalityList = new FunctionalityInfoDto;
                    functionalityList = z;
                    x.functionalityInfo.push(functionalityList);
                  }
                }))
              }
            }
          })

          this.userProfileList.userProfileDetail.forEach(x => {
            x.functionalityInfo.sort((a, b) => {
              return (a.functionalityCaption.toLowerCase() < b.functionalityCaption.toLowerCase()) ? -1 : 1;
            })
          });

          if (this.userProfileList.userProfileDetail.length > 0) {
            this.settingIsSelectedFalse();
            this.userProfileList.userProfileDetail[0].isSelected = true;
            this.userProfileDetail = this.userProfileList.userProfileDetail[0];
            this.userProfileDetail.functionalityInfo = this.userProfileList.userProfileDetail[0].functionalityInfo;
            this.userProfileDetail.state = 0;
            this.isReadOnly = true;
          }
          this.saveUserProfile.userProfileDetail = [];
        }, err => {
          this.spinnerService.setIsLoading(false);
          if (err?.error?.errorCode) {
            this.errorCode = err?.error?.errorCode;
          }
          else {
            this.errorCode = 'InternalServiceFault';
          }
          this.exceptionBox = true;
          this.saveUserProfile.userProfileDetail = [];
        })

      }, err => {
        this.spinnerService.setIsLoading(false);
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
        this.exceptionBox = true;
        this.saveUserProfile.userProfileDetail = [];
      });


    }
    else {
      if (this.Duplicate())
        this.throwBusinessError(this.translate.instant('userProfile.validationError.uniqueName'));
    }
  }

  settingIsSelectedFalse() {
    this.userProfileList.userProfileDetail.forEach(x => x.isSelected = false);
  }

  buildConfiguration() {
    const requiredError = new ErrorDto;
    requiredError.validation = "required";
    requiredError.isModelError = true;
    requiredError.validationMessage = this.translate.instant('userProfile.validationError.name');
    this.RequiredTextBoxconfig.required = true;
    this.RequiredTextBoxconfig.Errors = [requiredError];
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
        if (x.ErrorMessage != ErrorMessage && !x.IsBusinessError) {
          this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
        }
      })
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
    const updated = this.userProfileList.userProfileDetail.findIndex(x => x.state == 1 || x.state == 3);
    if (this.saveUserProfile.userProfileDetail.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(userProfileList: ManageUserProfileScreenDto) {
    this.showDialog = false;
    this.onSave(userProfileList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.RequiredTextBoxconfig.externalError = false;
    this.RemoveBusinessError(this.translate.instant('userProfile.validationError.uniqueName'))
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }
  onClickCancel() {
    this.showDialog = false;
  }

}
