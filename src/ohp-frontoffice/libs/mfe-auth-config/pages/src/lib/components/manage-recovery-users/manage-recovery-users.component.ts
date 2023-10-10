import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, ErrorDto, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, FluidCheckBoxConfig, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { RecoveryUserService } from './service/recovery-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core'
import { ConfigContextService } from '@close-front-office/shared/config';
import { ActionReceiver2UserDto, ActionReceiverDto, DtoState, LanguageDto, LimitationInfoDto, RecoveryUserDto, SearchUsersRequestDto, ServicingLabelRefDto, UserProfileInfoDto } from './models/recovery-user.model';
import { CodeTable, RecoveryUserProfileDto } from '../manage-recovery-user-profile/models/recovery-user-profile.model';

@Component({
  selector: 'mauth-manage-recovery-users',
  templateUrl: './manage-recovery-users.component.html',
  styleUrls: ['./manage-recovery-users.component.scss']
})
export class ManageRecoveryUsersComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public UserNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public UserTypeTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PriorityTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;


  searchRequest: SearchUsersRequestDto = new SearchUsersRequestDto
  languageList!: LanguageDto[];
  actionReceiverList!: ActionReceiverDto[];
  servicingLabelList!: ServicingLabelRefDto[];
  userProfileLimitationList!: CodeTable[];
  userProfileList !: RecoveryUserProfileDto[];
  userList!: RecoveryUserDto[]
  userDetail: RecoveryUserDto = new RecoveryUserDto
  linkedUserProfileDetail!: UserProfileInfoDto
  userProfileDetail!: RecoveryUserProfileDto
  limitationDetail!: ServicingLabelRefDto
  saveUser: RecoveryUserDto[] = [];
  invalidErrorMsg: ErrorDto[] = []
  intMaxValue = 2147483647;
  uniqueUserNameError!: string
  exceptionBox!: boolean
  placeholder = 'select';
  UserHeader!: any[];
  userProfileHeader!: any[];
  limitationHeader!: any[];
  actionReceiverHeader!: any[];
  showUserDetails!: boolean
  showLimitation!: boolean
  showDialog!: boolean
  navigateUrl!: string
  errorCode!: string
  validationHeader = this.translate.instant('validation.validationHeader');

  constructor(public fluidService: FluidControlsBaseService, private service: RecoveryUserService, public route: ActivatedRoute,
    private translate: TranslateService, private fluidValidation: fluidValidationService, public router: Router,
    public spinnerService: SpinnerService, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();

    this.showUserDetails = false;
    this.showLimitation = false;

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.languageList = res.recoveryLanguageListData;
      this.actionReceiverList = res.actionReciverList;
      this.servicingLabelList = res.servicingLabelRefList;
      this.userProfileLimitationList = res.userProfileLimitationList;
      this.userProfileList = res.userProfileList;
    })

    this.spinnerService.setIsLoading(true);
    this.service.getUserData(this.searchRequest).subscribe(res => {
      this.spinnerService.setIsLoading(false);
      this.userList = res as RecoveryUserDto[];
      this.userList.forEach(x => x.userType = "-1");

      if (this.userList.length > 0) {
        this.settingIsSelectedFalse();
        this.userList[0].isSelected = true;
        this.userDetail = this.userList[0];
      }
    }, err => {
      this.spinnerService.setIsLoading(false);
      this.exceptionBox = true;
      if (err?.error?.errorCode) {
        this.errorCode = err?.error?.errorCode;
      }
      else {
        this.errorCode = 'InternalServiceFault';
      }
    })

    this.UserHeader = [
      { header: this.translate.instant('manage-recovery-user.tabel.Username'), field: 'userName', width: '24%' },
      { header: this.translate.instant('manage-recovery-user.tabel.LastName'), field: 'name', width: '23%' },
      { header: this.translate.instant('manage-recovery-user.tabel.FirstName'), field: 'firstName', width: '24%' },
      { header: this.translate.instant('manage-recovery-user.tabel.EmailId'), field: 'email', width: '24%' },
      { header: this.translate.instant('manage-recovery-user.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }];


    this.userProfileHeader = [
      { header: this.translate.instant('manage-recovery-user.tabel.Links'), field: 'userProfileName', property: 'userProfileName', width: '60%' },
      { header: this.translate.instant('manage-recovery-user.tabel.Priority'), field: 'priority', property: 'priority', width: '35%' },
      { header: this.translate.instant('manage-recovery-user.tabel.'), field: '', fieldType: 'deleteButton', property: 'Delete', width: '5%' }];

    this.limitationHeader = [
      { header: this.translate.instant('manage-recovery-user.tabel.Limitation'), field: 'name', width: '95%' },
      { header: this.translate.instant('manage-recovery-user.tabel.'), field: 'delete1', fieldType: 'deleteButton', width: '5%' }];

    this.actionReceiverHeader = [
      { header: this.translate.instant('manage-recovery-user.tabel.User'), field: 'isSelected', fieldType: 'checkbox', width: '20%' },
      { header: this.translate.instant('manage-recovery-user.tabel.ActionReceiver'), field: 'actionReceiver.actionReceiverType.caption', width: '60%' },
      { header: this.translate.instant('manage-recovery-user.tabel.taskcreation'), field: 'isOnlyForTaskCreation', fieldType: 'checkbox', width: '20%' }];

  }

  onSave(userData: RecoveryUserDto[]) {

    if (this.userDetailsform.valid && !this.Duplicate()) {
      this.RemoveBusinessError(this.uniqueUserNameError);
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
      userData.forEach(x => {
        if (x.state != DtoState.unknown) {
          this.saveUser.push({ ...x })
        }
      });

      if (this.saveUser.length > 0) {
        this.spinnerService.setIsLoading(true);
        this.service.saveUserData(this.saveUser).subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const saveResponse = res as RecoveryUserDto[]

          if (saveResponse.length > 0) {

            this.userList.forEach(x => {
              const userIndex = saveResponse.findIndex(y => { return x.userName == y.userName })
              const listIndex = this.userList.findIndex(y => { return x.userName == y.userName })
              if (userIndex != -1) {
                this.userList[listIndex] = saveResponse[userIndex];
              }
            });
            this.userList.forEach(x => x.userType = "-1");
            const userListIndex = this.userList.findIndex(x => x.userName == this.userDetail.userName)
            this.userList[userListIndex].isSelected = true;
            this.userDetail = this.userList[userListIndex];
            this.showLimitation = false;
          }
          this.saveUser = [];
        }, err => {
          this.spinnerService.setIsLoading(false);
          if (err.error.toString().indexOf('Username (') > -1) {
            this.uniqueUserNameError = err.error.split('"')[1];
            this.throwBusinessError(this.uniqueUserNameError);
          }
          else {
            this.exceptionBox = true;
            if (err?.error?.errorCode) {
              this.errorCode = err?.error?.errorCode;
            }
            else {
              this.errorCode = 'InternalServiceFault';
            }
          }
          this.saveUser = [];
        })
      }
    }
    else {
      this.settingExternalErrorTrue();

    }
  }

  dataSelection(event: RecoveryUserDto) {
    if (this.userDetailsform.valid && !this.Duplicate()) {
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));

      this.settingIsSelectedFalse();
      this.userDetail = event;
      this.showUserDetails = true;
      this.showLimitation = false;
      this.userDetail.isSelected = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  userProfileDataSelect(event: UserProfileInfoDto) {
    if (this.userDetailsform.valid && !this.Duplicate()) {

      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));

      this.settingIsUserProfileSelectedFalse();
      this.linkedUserProfileDetail = event;
      this.showLimitation = true;
      this.linkedUserProfileDetail.isUserProfileSelected = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addUser() {
    if (this.userDetailsform.valid && !this.Duplicate()) {

      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));

      this.settingIsSelectedFalse();
      this.settingExternalErrorFalse();
      this.showUserDetails = true;
      const newRow = new RecoveryUserDto;
      newRow.isSelected = true;
      const newuserList = this.userList;
      newuserList.push({ ...newRow });
      this.userList = [...newuserList];
      this.userDetail = new RecoveryUserDto;
      this.userDetail.state = DtoState.created;
      this.userDetail.pKey = 0;
      this.userDetail.userType = "0";
      this.userDetail.isSelected = true;
      for (let i = 0; i < this.actionReceiverList.length; i++) {
        this.userDetail.actionReceiver2UserList.push({ ...new ActionReceiver2UserDto });
        this.userDetail.actionReceiver2UserList[i].actionReceiver = { ...this.actionReceiverList[i] };
        this.userDetail.actionReceiver2UserList[i].isOnlyForTaskCreation = false;
        this.userDetail.actionReceiver2UserList[i].isSelected = false;
      }
      this.userList[this.userList.length - 1] = this.userDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onUserDelete(event: RecoveryUserDto, gridData: RecoveryUserDto[]) {
    const index = this.userDetail.userProfiles?.findIndex(x => x.priority == null)
    if (this.userDetailsform.valid && !this.Duplicate() || event.userName == null || event.userType == null || index != -1 || (this.Duplicate() && event.isSelected)) {

      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      if (this.userList[deletedata].state != 1) {
        event.state = DtoState.deleted;
        this.saveUser.push({ ...event });
      }
      gridData.splice(deletedata, 1);
      this.userList = [...gridData];

      this.showUserDetails = false;
    }
  }

  addUserProfile() {
    if (this.userProfileDetail) {
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
      if (this.userDetailsform.valid && !this.Duplicate()) {
        this.settingIsUserProfileSelectedFalse();
        this.settingExternalErrorFalse();
        this.settingUserDirty();
        this.showLimitation = true;
        const index = this.userList.findIndex(x => x.isSelected)
        const newRow = new UserProfileInfoDto;
        newRow.isUserProfileSelected = true;
        const newuserList = this.userList[index].userProfiles;
        newuserList.push({ ...newRow });
        this.userList[index].userProfiles = [...newuserList];
        this.linkedUserProfileDetail = new UserProfileInfoDto;
        this.linkedUserProfileDetail.state = DtoState.created;
        this.linkedUserProfileDetail.pKey = this.userProfileDetail.pKey;
        this.linkedUserProfileDetail.isUserProfileSelected = true;
        this.linkedUserProfileDetail.userProfileName = this.userProfileDetail.name;
        this.userList[index].userProfiles[this.userList[index].userProfiles.length - 1] = this.linkedUserProfileDetail;
      }
      else {
        this.settingExternalErrorTrue();
      }
    }
    else {
      this.throwBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
    }
  }

  onUserProfileDelete(event: UserProfileInfoDto, gridData: UserProfileInfoDto[]) {
    if (this.userDetailsform.valid && !this.Duplicate() || event.priority == null || (this.Duplicate() && event.isUserProfileSelected)) {

      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
      const index = this.userList.findIndex(x => x.isSelected)

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      event.priority = 0;
      setTimeout(() => {
        gridData.splice(deletedata, 1);
        this.userList[index].userProfiles = [...gridData];
        this.settingUserDirty();
        if (this.userList[index].userProfiles.length > 0) {
          this.settingIsUserProfileSelectedFalse();
          this.userList[index].userProfiles[this.userList[index].userProfiles.length - 1].isUserProfileSelected = true;
          this.linkedUserProfileDetail = this.userList[index].userProfiles[this.userList[index].userProfiles.length - 1];
        }
        else {
          this.PriorityTextBoxconfig.externalError = false;
          setTimeout(() => {
            this.showLimitation = false;
          }, 1)
        }
      },0.00009)
    }
  }

  Duplicate(): boolean {
    if (this.linkedUserProfileDetail?.limitations.length > 0) {
      const valueArr = this.linkedUserProfileDetail?.limitations.map(function (item) { return item.name });
      return valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
    }
    return false;
  }

  addLimitations() {
    if (this.limitationDetail) {
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
      if (this.userDetailsform.valid && !this.Duplicate()) {

        const index = this.userList.findIndex(x => x.isSelected)
        const profileIndex = this.userList[index].userProfiles.findIndex(x => x.isUserProfileSelected)
        const newRow = new LimitationInfoDto;
        newRow.state = DtoState.created;
        newRow.pKey = this.limitationDetail.pKey;
        newRow.name = this.limitationDetail.name;
        const limitationIndex = this.userProfileLimitationList.findIndex(x => x.codeId == 4)
        newRow.limitationType = this.userProfileLimitationList[limitationIndex];

        const newuserList = this.userList[index].userProfiles[profileIndex].limitations;
        newuserList.push({ ...newRow });

        this.userList[index].userProfiles[profileIndex].limitations = [...newuserList];
        this.settingUserDirty();

      }
      else {
        this.settingExternalErrorTrue();
      }
    }
    else {
      this.throwBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
    }
  }

  onLimitationDelete(event: LimitationInfoDto, gridData: LimitationInfoDto[]) {
    const UniqueIndex = gridData.findIndex(x => x == event)
    if (this.userDetailsform.valid && !this.Duplicate() || (this.Duplicate() && UniqueIndex == (gridData.length - 1))) {

      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
      this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationDuplicate'))

      const index = this.userList.findIndex(x => x.isSelected)
      const profileIndex = this.userList[index].userProfiles.findIndex(x => x.isUserProfileSelected);
      this.settingUserDirty();
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      gridData.splice(deletedata, 1);
      this.userList[index].userProfiles[profileIndex].limitations = [...gridData];
    }
    else {
      this.settingExternalErrorTrue();

    }
  }

  settingIsSelectedFalse() {
    this.userList.forEach(x => x.isSelected = false);
  }

  settingIsUserProfileSelectedFalse() {
    const index = this.userList.findIndex(x => x.isSelected)
    if (this.userList[index].userProfiles?.length > 0) {
      this.userList[index].userProfiles.forEach(x => x.isUserProfileSelected = false);
    }
  }

  settingUserDirty() {
    const index = this.userList.findIndex(x => x.isSelected)
    if (this.userList[index].state != DtoState.created) {
      this.userList[index].state = DtoState.dirty;
    }
  }

  onChangeUserName(event: any) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    if (event?.target?.value) {
      this.userList[index].userName = event?.target?.value;
      this.userDetail.userName = event?.target?.value;
    }
    else {
      this.userList[index].userName = null;
      this.userDetail.userName = null;
      this.UserNameTextBoxconfig.externalError = true;
    }
  }

  onChangePassword(event: string) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].password = event;
    this.userDetail.password = event;
  }

  onChangeLastName(event: any) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].name = event?.target?.value;
    this.userDetail.name = event?.target?.value;
  }

  onChangeFirstName(event: any) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].firstName = event?.target?.value;
    this.userDetail.firstName = event?.target?.value;
  }

  onChangeEmail(event: any) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].email = event?.target?.value;
    this.userDetail.email = event?.target?.value;
  }

  onChangeTelNr(event: string) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].telNr = event;
    this.userDetail.telNr = event;
  }

  onChangeLanguage(event: any) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].language = event?.value;
    this.userDetail.language = event?.value;
  }

  onChangeFaxNr(event: string) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].faxNr = event;
    this.userDetail.faxNr = event;
  }

  onChangeUserType(event: string) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].userType = event;
    this.userDetail.userType = event;
    if (event == "") {
      this.UserTypeTextBoxconfig.externalError = true;
    }
  }

  onChangeEmployeeNr(event: any) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    if (event) {
      this.userList[index].employeeNr = parseInt(event);
      this.userDetail.employeeNr = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.userList[index].employeeNr = null as unknown as number;
          this.userDetail.employeeNr = null as unknown as number;
        }, 1)
      }
    }
    else {
      this.userList[index].employeeNr = event;
      this.userDetail.employeeNr = event;
    }
  }

  onChangeAccess2Config(event: boolean) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    this.userList[index].access2config = event;
    this.userDetail.access2config = event;
  }

  onChangePriority(event: any, listindex: number) {
    const index = this.userList.findIndex(x => x.isSelected)
    this.settingUserDirty();
    if (this.userList[index].userProfiles[listindex].state != DtoState.created) {
      this.userList[index].userProfiles[listindex].state = DtoState.dirty
    }
    if (event) {
      this.userList[index].userProfiles[listindex].priority = parseInt(event);
      this.userDetail.userProfiles[listindex].priority = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.userList[index].userProfiles[listindex].priority = null;
        this.userDetail.userProfiles[listindex].priority = null;
        this.PriorityTextBoxconfig.externalError = true;
      }
    }
    else {
      this.userDetail.userProfiles[listindex].priority = event;
      setTimeout(() => {
        this.userList[index].userProfiles[listindex].priority = 0;
        this.userDetail.userProfiles[listindex].priority = 0;
        this.PriorityTextBoxconfig.externalError = true;
      }, 1)
    }
  }

  onChangeUserProfileDetail(event: RecoveryUserProfileDto) {
    this.userProfileDetail = event;
  }

  onCheckboxChange(event: ActionReceiver2UserDto) {
    this.settingUserDirty();
  }

  settingExternalErrorTrue() {
    this.UserNameTextBoxconfig.externalError = true;
    this.UserTypeTextBoxconfig.externalError = true;
    this.PriorityTextBoxconfig.externalError = true;
    if (this.Duplicate()) {
      this.throwBusinessError(this.translate.instant('manage-recovery-user.validation.limitationDuplicate'))
    }
  }

  settingExternalErrorFalse() {
    this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.userProfileNotNull'));
    this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationNotNull'));
    this.RemoveBusinessError(this.translate.instant('manage-recovery-user.validation.limitationDuplicate'))
    this.UserNameTextBoxconfig.externalError = false;
    this.UserTypeTextBoxconfig.externalError = false;
    this.PriorityTextBoxconfig.externalError = false;
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
    const updated = this.userList.findIndex(x => x.state == DtoState.created || x.state == DtoState.dirty);
    if (this.saveUser.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(userList: RecoveryUserDto[]) {
    this.showDialog = false;
    this.onSave(userList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.settingExternalErrorFalse();
    this.RemoveBusinessError(this.uniqueUserNameError);
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }

  onClickCancel() {
    this.showDialog = false;
  }


  buildConfiguration() {
    const userNameError = new ErrorDto;
    userNameError.validation = "required";
    userNameError.isModelError = true;
    userNameError.validationMessage = this.translate.instant('manage-recovery-user.validation.userName');
    this.UserNameTextBoxconfig.required = true;
    this.UserNameTextBoxconfig.Errors = [userNameError];

    const userTypeError = new ErrorDto;
    userTypeError.validation = "required";
    userTypeError.isModelError = true;
    userTypeError.validationMessage = this.translate.instant('manage-recovery-user.validation.userType');
    this.UserTypeTextBoxconfig.required = true;

    const errorMsg = new ErrorDto;
    errorMsg.validation = "required";
    errorMsg.isModelError = true;
    errorMsg.validationMessage = this.translate.instant('manage-recovery-user.validation.errorMsg')
    this.invalidErrorMsg = [errorMsg]
    this.UserTypeTextBoxconfig.Errors = [userTypeError];

    const priorityError = new ErrorDto;
    priorityError.validation = "required";
    priorityError.isModelError = true;
    priorityError.validationMessage = this.translate.instant('manage-recovery-user.validation.priority');
    this.PriorityTextBoxconfig.required = true;
    this.PriorityTextBoxconfig.Errors = [priorityError];
  }
}
