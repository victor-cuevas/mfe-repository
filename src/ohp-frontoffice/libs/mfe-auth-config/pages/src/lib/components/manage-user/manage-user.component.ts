
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ErrorDto, ValidationErrorDto, FluidControlGridConfig } from '@close-front-office/shared/fluid-controls';
import { CodeTableDto, CreditProviderDto, GetManageUserAssociationsResponseDto, ProductFamilyModuleCombinationDto, SearchUserRequestDto, UserDto, UserProfile2CreditProviderDto } from '../manage-user/models/manage-user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core'
import { ConfigContextService } from '@close-front-office/shared/config';
import { ManageUserService } from './service/manage-user.service';


@Component({
  selector: 'mauth-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

export class ManageUserComponent implements OnInit {

  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public FirstNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public UserNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public LastNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public InitialTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public GridConfig: FluidControlGridConfig = this.fluidService.FluidGridConfig;
  public CreditProviderConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public UserProfileConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ProductFamilyConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'select language';
  searchUsers: SearchUserRequestDto = new SearchUserRequestDto();
  searchDetails: any;
  user!: GetManageUserAssociationsResponseDto;
  userDetails: UserDto = new UserDto();
  public userList: UserDto[] = [];
  public saveUser: UserDto[] = [];
  searchUserList: UserDto[] = [];
  intMaxValue = 2147483647;
  creditProviderDropdown: any[] = [];
  userProfileDropdown: any[] = [];
  productFamilyDropdown: any[] = [];
  selectUserHeader!: any[];
  userProfileHeader!: any[];
  dataSelected: any;
  check!: boolean;
  onSelectUser!: boolean;
  formDisable!: boolean;
  selectedUser!: UserDto;
  showDialog!: boolean;
  validationHeader!: string
  isReadOnly!: boolean;
  uniqueUserNameError!: string;
  errorCode!: string
  navigateUrl: string
  exceptionBox!: boolean

  constructor(public fluidService: FluidControlsBaseService, private userService: ManageUserService, public route: ActivatedRoute,
    private translate: TranslateService, private fluidValidation: fluidValidationService, public router: Router,
    public spinnerService: SpinnerService, private commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }

  ngOnInit() {
    this.buildConfiguration();
    this.isReadOnly = true;
    this.route.data.subscribe((res: any) => {
      if (res.userAssociationData != null) {
        this.user = res.userAssociationData;
        this.spinnerService.setIsLoading(false);
        this.creditProviderDropdown = this.user.creditProviderList.map(x => {
          return { name: x.name.caption, value: x.name.codeId }
        });

        this.userProfileDropdown = this.user.userProfileNameList.map(x => {
          return { name: x.caption, value: x.codeId }
        });

        this.productFamilyDropdown = this.user.productFamilyModuleCombinationList.map(x => {
          return { name: x.productFamilyModuleCombinationCaption, value: x.productFamilyModuleCombinationCaption }
        })
      }
    });

    this.validationHeader = this.translate.instant('validation.validationHeader');

    this.userProfileHeader = [{ header: this.translate.instant('user.labels.creditProvider'), field: 'creditProvider', pSortableColumnDisabled: true, config: this.CreditProviderConfig, form: this.userDetailsform, fieldType: 'dropdown', width: '30%' },
    { header: this.translate.instant('user.labels.userProfile'), pSortableColumnDisabled: true, field: 'userProfile', config: this.UserProfileConfig, form: this.userDetailsform, fieldType: 'dropdown', width: '30%' },
    { header: this.translate.instant('user.labels.productFamilyModuleCombination'), field: 'productFamilyModuleCombination', pSortableColumnDisabled: true, config: this.ProductFamilyConfig, form: this.userDetailsform, fieldType: 'dropdown', width: '35%' }, { header: '', field: 'deleteButton', width: '5%', fieldType: 'deleteButton' }];

    this.selectUserHeader = [{ header: this.translate.instant('user.labels.userName'), field: 'userName', width: '24%' },
    { header: this.translate.instant('user.labels.lastName'), field: 'name', width: '24%' },
    { header: this.translate.instant('user.labels.firstName'), field: 'firstName', width: '24%' },
    { header: this.translate.instant('user.labels.employeeNo'), field: 'employeeNr', width: '25%' },
    { header: '', field: 'deleteButton', width: '5%', fieldType: 'deleteButton' }];
  }

  SearchForm(form: NgForm) {
    this.RemoveBusinessError(this.translate.instant('user.validationError.validSearch'));
    if (this.userDetailsform.valid && ((form.value.userName != "" && form.value.userName != null) || (form.value.lastName != "" && form.value.lastName != null) || (form.value.employeeNr != "" && form.value.employeeNr != null))) {
      this.RemoveBusinessError(this.translate.instant('user.validationError.searchCriteria'));
      this.RemoveBusinessError(this.uniqueUserNameError);
      if (this.onSelectUser)
        this.onSelectUser = true;
      else
        this.onSelectUser = false;
      this.check = true;
      this.spinnerService.setIsLoading(true);
      this.userService.searchUsers(form.value).subscribe((res) => {
        this.spinnerService.setIsLoading(false);
        this.RemoveBusinessError(this.translate.instant('user.validationError.validSearch'));
        this.userList = res as UserDto[];
        this.userList.forEach(x => this.searchUserList.push({ ...x }));
        if (this.onSelectUser) {
          this.settingIsSelectedFalse();
          this.userList[0].isSelected = true;
          this.userDetails = this.userList[0];
          this.setUserProfileDropdown();
        }
      },
        err => {
          this.spinnerService.setIsLoading(false);
          if (err.error.toString().indexOf(this.translate.instant('user.validationError.validSearch')) > -1) {
            this.throwBusinessError(this.translate.instant('user.validationError.validSearch'));
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
        }
      )
    }
    else {
      this.checkExternalError();
      if (!((form.value.userName != "" && form.value.userName != null) || (form.value.lastName != "" && form.value.lastName != null) || (form.value.employeeNr != "" && form.value.employeeNr != null))) {
        this.throwBusinessError(this.translate.instant('user.validationError.searchCriteria'));
      }
    }
  }

  dataSelection(event: any) {
    const creditProviderValid = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const userProfileValid = this.userDetails.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const productFamilyValid = this.userDetails.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);
    if (this.userDetailsform.valid && creditProviderValid == -1 && userProfileValid == -1 && productFamilyValid == -1) {
      if (event) {
        this.RemoveBusinessError(this.uniqueUserNameError);
        if (event.state == 1)
          this.isReadOnly = false;
        else
          this.isReadOnly = true;
        this.settingIsSelectedFalse();
        this.onSelectUser = true;
        this.selectedUser = { ...event };
        this.userDetails = event;
        this.userDetails.isSelected = true;
        (this.selectedUser as any).userProfile2CreditProvider.forEach((x: any, i: number) => {
          this.userDetails.userProfile2CreditProvider[i].creditProvider.names = 'creditProvider' + (i);
          this.userDetails.userProfile2CreditProvider[i].creditProvider.options = this.creditProviderDropdown;
          this.userDetails.userProfile2CreditProvider[i].creditProvider.value = x.creditProvider.name.caption;
          this.userDetails.userProfile2CreditProvider[i].userProfile.names = 'userProfile' + (i);
          this.userDetails.userProfile2CreditProvider[i].userProfile.options = this.userProfileDropdown;
          this.userDetails.userProfile2CreditProvider[i].userProfile.value = x.userProfile.caption;
          this.userDetails.userProfile2CreditProvider[i].productFamilyModuleCombination.names = 'productFamily' + (i);
          this.userDetails.userProfile2CreditProvider[i].productFamilyModuleCombination.options = this.productFamilyDropdown;
          this.userDetails.userProfile2CreditProvider[i].productFamilyModuleCombination.value = x.productFamilyModuleCombination.productFamilyModuleCombinationCaption;
        })
      }
    }
    else {
      this.checkExternalError();
    }
  }

  dropDownEvent(event: any) {
    const userIndex = this.userList.findIndex(x => x.isSelected);
    if (event.name == 'creditProvider' + (event.index)) {
      const index = this.creditProviderDropdown.findIndex(x => x.name == event.value);
      const pkey = this.user.creditProviderList.findIndex(x => x.name.caption == event.value);
      this.userDetails.userProfile2CreditProvider[event.index].creditProvider.name.caption = event.value;
      this.userList[userIndex].userProfile2CreditProvider[event.index].creditProvider.name.caption = event.value;
      if (index != -1) {
        this.userDetails.userProfile2CreditProvider[event.index].creditProvider.name.codeId = this.creditProviderDropdown[index]?.value;
        this.userList[userIndex].userProfile2CreditProvider[event.index].creditProvider.name.codeId = this.creditProviderDropdown[index]?.value;
      }
      this.userDetails.userProfile2CreditProvider[event.index].creditProvider.name.enumCaption = null;
      this.userDetails.userProfile2CreditProvider[event.index].creditProvider.servicingOrganization = null;
      if (pkey != -1) {
        this.userDetails.userProfile2CreditProvider[event.index].creditProvider.pKey = this.user.creditProviderList[pkey]?.pKey;
        this.userList[userIndex].userProfile2CreditProvider[event.index].creditProvider.pKey = this.user.creditProviderList[pkey]?.pKey;
      }
      this.userDetails.userProfile2CreditProvider[event.index].creditProvider.rowVersion = 2;
      this.userDetails.userProfile2CreditProvider[event.index].creditProvider.state = 0;
      if (event.value == null) {
        this.CreditProviderConfig.externalError = true;
      }
    }
    else if (event.name == 'userProfile' + event.index) {

      const index = this.userProfileDropdown.findIndex(x => x.name == event.value);
      this.userDetails.userProfile2CreditProvider[event.index].userProfile.caption = event.value;
      this.userList[userIndex].userProfile2CreditProvider[event.index].userProfile.caption = event.value;
      if (index != -1) {
        this.userDetails.userProfile2CreditProvider[event.index].userProfile.codeId = this.userProfileDropdown[index]?.value;
        this.userList[userIndex].userProfile2CreditProvider[event.index].userProfile.codeId = this.userProfileDropdown[index]?.value;;
      }
      this.userDetails.userProfile2CreditProvider[event.index].userProfile.enumCaption = null;
      this.userList[userIndex].userProfile2CreditProvider[event.index].userProfile.enumCaption = null;
      if (event.value == null) {
        this.UserProfileConfig.externalError = true;
      }
    }
    else if (event.name == 'productFamily' + event.index) {

      const productFamilyList = this.user.productFamilyModuleCombinationList.filter(x => x.productFamilyModuleCombinationCaption == event.value)[0];
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.productFamilyModuleCombinationCaption = productFamilyList?.productFamilyModuleCombinationCaption;
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.module = productFamilyList?.module;
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.pKey = productFamilyList?.pKey;
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.productFamily = productFamilyList?.productFamily;
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.rowVersion = productFamilyList?.rowVersion;
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.state = productFamilyList?.state;

      this.userList[userIndex].userProfile2CreditProvider[event.index].productFamilyModuleCombination.productFamilyModuleCombinationCaption = productFamilyList?.productFamilyModuleCombinationCaption;
      this.userList[userIndex].userProfile2CreditProvider[event.index].productFamilyModuleCombination.module = productFamilyList?.module;
      this.userList[userIndex].userProfile2CreditProvider[event.index].productFamilyModuleCombination.pKey = productFamilyList?.pKey;
      this.userList[userIndex].userProfile2CreditProvider[event.index].productFamilyModuleCombination.productFamily = productFamilyList?.productFamily;
      this.userList[userIndex].userProfile2CreditProvider[event.index].productFamilyModuleCombination.rowVersion = productFamilyList?.rowVersion;
      this.userList[userIndex].userProfile2CreditProvider[event.index].productFamilyModuleCombination.state = productFamilyList?.state;

      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.names = 'productFamily' + (event.index);
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.options = this.productFamilyDropdown;
      this.userDetails.userProfile2CreditProvider[event.index].productFamilyModuleCombination.value = event.value;
      if (event.value == null) {
        this.ProductFamilyConfig.externalError = true;
      }
    }

    this.userDetails.userProfile2CreditProvider[event.index].pKey = 0;
    this.userDetails.userProfile2CreditProvider[event.index].priority = 0;
    this.userDetails.userProfile2CreditProvider[event.index].rowVersion = 0;
    const index = this.userList.findIndex(x => x.isSelected);
    if (this.userList[index].state != 1) {
      this.userList[index].state = 3;
      this.userDetails.state = 3;
      this.userDetails.userProfile2CreditProvider[event.index].state = 3;
    }
  }

  addUser() {
    const creditProviderValid = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const userProfileValid = this.userDetails.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const productFamilyValid = this.userDetails.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);
    if (this.userDetailsform.valid && creditProviderValid == -1 && userProfileValid == -1 && productFamilyValid == -1) {
      this.RemoveBusinessError(this.uniqueUserNameError);
      this.isReadOnly = false;
      this.settingIsSelectedFalse();
      this.onSelectUser = true;
      const newRow = new UserDto;
      newRow.isSelected = true;
      const newuserList = this.userList;
      newuserList.push({ ...newRow });
      this.userDetails = new UserDto;
      this.userList = [...newuserList];

      this.userDetails.password = "";
      this.userDetails.email = "";
      this.userDetails.telNr = "";
      this.userDetails.personalTelNr = null;
      this.userDetails.faxNr = "";
      this.userDetails.pKey = 0;
      this.userDetails.state = 1;
      this.userDetails.rowVersion = 1;
      this.userDetails.isSelected = true;
      this.userDetailsform.resetForm();
      this.userDetails.access2config = false;
      this.userDetails.isIntegrationUser = false;
      this.userList[this.userList.length - 1] = this.userDetails;
      this.RemoveExternalError();
    }
    else {
      this.checkExternalError();
    }
  }

  addUserProfile() {
    const index = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null || x.userProfile.caption == null || x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);
    if (index == -1 && this.userDetailsform.valid) {
      this.CreditProviderConfig.externalError = false;
      this.UserProfileConfig.externalError = false;
      this.ProductFamilyConfig.externalError = false;
      const newRow = new UserProfile2CreditProviderDto();
      newRow.creditProvider = new CreditProviderDto();
      newRow.creditProvider.names = 'creditProvider' + (this.userDetails.userProfile2CreditProvider.length);
      newRow.creditProvider.options = this.creditProviderDropdown;
      newRow.userProfile = new CodeTableDto;
      newRow.userProfile.names = 'userProfile' + (this.userDetails.userProfile2CreditProvider.length);
      newRow.userProfile.options = this.userProfileDropdown;
      newRow.productFamilyModuleCombination = new ProductFamilyModuleCombinationDto;
      newRow.productFamilyModuleCombination.names = 'productFamily' + (this.userDetails.userProfile2CreditProvider.length);
      newRow.productFamilyModuleCombination.options = this.productFamilyDropdown;
      const newuserList = this.userDetails.userProfile2CreditProvider;
      newuserList.push({ ...newRow });
      this.userDetails.userProfile2CreditProvider = [...newuserList];
      const userListIndex = this.userList.findIndex(x => x.isSelected)
      this.userList[userListIndex].state = 3;
      this.userList[userListIndex].userProfile2CreditProvider = this.userDetails.userProfile2CreditProvider;

    }
    else {
      this.checkExternalError();
    }
  }

  onSave(detail: UserDto[]) {
    const creditindex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const userProfileIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const ProductFamilyIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);
    if (this.userDetailsform.valid && creditindex == -1 && userProfileIndex == -1 && ProductFamilyIndex == -1) {
      this.RemoveBusinessError(this.uniqueUserNameError);
      const saveData = [...detail];
      saveData.forEach(x => {

        if (x.state != 0) {
          this.saveUser.push({ ...x })
        }
      })
      if (this.saveUser.length > 0) {
        this.spinnerService.setIsLoading(true);
      this.userService.saveUsers(this.saveUser).subscribe(result => {
        this.spinnerService.setIsLoading(false);
        const saveResponse = result as UserDto[];

        if (saveResponse.length > 0) {
          this.userList.forEach(x => {
            const userIndex = saveResponse.findIndex(y => { return x.userName == y.userName })
            const listIndex = this.userList.findIndex(y => { return x.userName == y.userName })
            if (userIndex != -1) {
              this.userList[listIndex] = saveResponse[userIndex];
            }
          });
          this.isReadOnly = true;
          const userListIndex = this.userList.findIndex(x => x.userName == this.userDetails.userName)
          this.userList[userListIndex].isSelected = true;
          this.userList.forEach(x => this.searchUserList.push({ ...x }));
          this.userDetails = this.userList[userListIndex];
          this.setUserProfileDropdown();
        }
        this.saveUser = [];
      }, err => {
        this.spinnerService.setIsLoading(false);
        if (err.error.toString().indexOf('Username (') > -1) {
          this.uniqueUserNameError = err.error.split('"')[1];
          this.throwBusinessError(this.uniqueUserNameError);
        }
        else {
          if (err?.error?.errorCode) {
            this.errorCode = err?.error?.errorCode;
          }
          else {
            this.errorCode = 'InternalServiceFault';
          }
          this.exceptionBox = true;
        }
        this.saveUser = [];
      })
    }
    }
    else {
      if (creditindex != -1)
        this.CreditProviderConfig.externalError = true;
      if (userProfileIndex != -1)
        this.UserProfileConfig.externalError = true;
      if (ProductFamilyIndex != -1)
        this.ProductFamilyConfig.externalError = true;
    }
  }

  onRowDelete(event: UserDto, griddatas: UserDto[]) {

    const creditindex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const userProfileIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const ProductFamilyIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);
    const eventcreditindex = event.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const eventuserProfileIndex = event.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const eventProductFamilyIndex = event.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);

    if ((this.userDetailsform.valid && creditindex == -1 && userProfileIndex == -1 && ProductFamilyIndex == -1) || event.name == undefined || event.name == ''
      || event.userName == undefined || event.userName == '' || event.firstName == undefined || event.firstName == '' || event.initials == undefined || event.initials == '' || event.language == undefined
      || event.language?.caption == null || eventcreditindex != -1 || eventuserProfileIndex != -1 || eventProductFamilyIndex != -1) {

      this.RemoveBusinessError(this.uniqueUserNameError);
      this.RemoveBusinessError(this.translate.instant('user.validationError.searchCriteria'));
      this.RemoveBusinessError(this.translate.instant('user.validationError.validSearch'));
      this.RemoveUserProfile2CreditProviderErrors();

      this.settingIsSelectedFalse();
      event.isSelected = true;
      const deletedata = griddatas.findIndex(data => {
        return (data.isSelected);
      })
      if (this.userList[deletedata].state != 1) {
        event = this.searchUserList.filter(x => x.pKey == event.pKey)[0];
        event.state = 4;
        this.saveUser.push({ ...event });
      }
      griddatas.splice(deletedata, 1);
      this.userList = [...griddatas];

      if (this.userList.length == 0) {
        this.RemoveExternalError();
        setTimeout(() => {
          this.onSelectUser = false;
        }, 100);
      }

      if (this.userList.length != 0) {
        if (this.userList[this.userList.length - 1].state == 1)
          this.isReadOnly = false;
        else
          this.isReadOnly = true;
        this.settingIsSelectedFalse();
        this.onSelectUser = true;
        this.userList[this.userList.length - 1].isSelected = true;
        this.userDetails = this.userList[this.userList.length - 1];
        this.userDetails.isSelected = true;
        this.setUserProfileDropdown();
      }
    }
  }

  onUserProfileRowDelete(event: any, griddatas: UserProfile2CreditProviderDto[]) {
    const creditindex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const userProfileIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const ProductFamilyIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);

    if ((creditindex == -1 && userProfileIndex == -1 && ProductFamilyIndex == -1) || (event.creditProvider.name.caption == null || event.userProfile.caption == null || event.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null)) {

      const deletedata = griddatas.findIndex(data => {
        return (data == event);
      })
      const index = this.userList.findIndex(x => x.isSelected);
      // To Remove External Errors
      event.creditProvider.value = " ";
      event.userProfile.value = " ";
      event.productFamilyModuleCombination.value = " ";

      setTimeout(() => {
        this.DeleteUserProfile2CreditProvider(deletedata, griddatas, index, this.userList);
      }, 100);
      this.userList[index].state = 3;
      this.userList[index].userProfile2CreditProvider = [...griddatas];
    }
  }

  setUserProfileDropdown() {
    this.userDetails?.userProfile2CreditProvider?.forEach((x: any, i: number) => {
      x.creditProvider.names = 'creditProvider' + (i)
      x.creditProvider.options = this.creditProviderDropdown
      x.creditProvider.value = x.creditProvider.name.caption;
      x.userProfile.names = 'userProfile' + (i);
      x.userProfile.options = this.userProfileDropdown;
      x.userProfile.value = x.userProfile.caption;
      x.productFamilyModuleCombination.names = 'productFamily' + (i);
      x.productFamilyModuleCombination.options = this.productFamilyDropdown;
      x.productFamilyModuleCombination.value = x.productFamilyModuleCombination.productFamilyModuleCombinationCaption;
    })
  }

  settingIsSelectedFalse() {
    if (this.userList.length > 0) {
      this.userList.forEach(x => x.isSelected = false);
    }
  }

  DeleteUserProfile2CreditProvider(deletedData: any, griddata: any, index: number, userList: UserDto[]) {
    griddata.splice(deletedData, 1);
    userList[index].userProfile2CreditProvider = [...griddata];
  }

  RemoveUserProfile2CreditProviderErrors() {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('user.validationError.creditProvider'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })

    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('user.validationError.userProfile'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })

    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('user.validationError.productFamily'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  checkExternalError() {
    if (this.userDetails.language?.caption == null || this.userDetails.language?.caption == undefined)
      this.DropdownConfig.externalError = true;
    if (this.userDetails.firstName == '' || this.userDetails.firstName == undefined)
      this.FirstNameTextBoxconfig.externalError = true;
    if (this.userDetails.name == '' || this.userDetails.name == undefined)
      this.LastNameTextBoxconfig.externalError = true;
    if (this.userDetails.initials == '' || this.userDetails.initials == undefined)
      this.InitialTextBoxconfig.externalError = true;
    if (this.userDetails.userName == '' || this.userDetails.userName == undefined)
      this.UserNameTextBoxconfig.externalError = true;
    const creditindex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.creditProvider.name.caption == null);
    const userProfileIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.userProfile.caption == null);
    const ProductFamilyIndex = this.userDetails.userProfile2CreditProvider.findIndex(x => x.productFamilyModuleCombination.productFamilyModuleCombinationCaption == null);
    if (creditindex != -1)
      this.CreditProviderConfig.externalError = true;
    if (userProfileIndex != -1)
      this.UserProfileConfig.externalError = true;
    if (ProductFamilyIndex != -1)
      this.ProductFamilyConfig.externalError = true;
  }

  RemoveExternalError() {
    this.DropdownConfig.externalError = false;
    this.FirstNameTextBoxconfig.externalError = false;
    this.InitialTextBoxconfig.externalError = false;
    this.LastNameTextBoxconfig.externalError = false;
    this.UserNameTextBoxconfig.externalError = false;
  }

  onClear() {
    this.searchUsers = new SearchUserRequestDto;
    this.userList = [];
    this.RemoveBusinessError(this.translate.instant('user.validationError.searchCriteria'));
    this.RemoveBusinessError(this.translate.instant('user.validationError.validSearch'));
    this.RemoveBusinessError(this.uniqueUserNameError);
    this.RemoveExternalError();
    this.RemoveUserProfile2CreditProviderErrors();
    this.userDetails.userProfile2CreditProvider = [];
    setTimeout(() => {
      this.onSelectUser = false;
    }, 100);
  }

  onChangeUserName(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (this.userList[index].state == 0)
      this.userList[index].state = 3;
    if (event.target.value) {
      this.userList[index].userName = event.target.value;
      this.userDetails.userName = event.target.value;
    }
    else {
      this.userList[index].userName = event.target.value;
      this.userDetails.userName = event.target?.value;
      this.UserNameTextBoxconfig.externalError = true;
    }

  }

  onChangeName(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (this.userList[index].state == 0)
      this.userList[index].state = 3;
    if (event.target?.value) {
      this.userList[index].name = event.target?.value;
      this.userDetails.name = event.target?.value;
    }
    else {
      this.userList[index].name = event.target?.value;
      this.userDetails.name = event.target?.value;
      this.LastNameTextBoxconfig.externalError = true;
    }
  }

  onChangePassword(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].password = event.target?.value;
    }
    this.userDetails.password = event.target?.value;
  }

  onChangeFirstName(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (this.userList[index].state == 0)
      this.userList[index].state = 3;
    if (event.target.value) {
      this.userList[index].firstName = event.target?.value;
      this.userDetails.firstName = event.target?.value;
    }
    else {
      this.userList[index].firstName = event.target?.value;
      this.userDetails.firstName = event.target?.value;
      this.FirstNameTextBoxconfig.externalError = true;
    }
  }

  onChangeEmployeeNr(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      if (event != null) {
        this.userList[index].employeeNr = parseInt(event);
        this.userDetails.employeeNr = parseInt(event);
        if (parseInt(event) > this.intMaxValue) {
          setTimeout(() => {
            this.userList[index].employeeNr = null as unknown as number;
            this.userDetails.employeeNr = null as unknown as number;
          }, 1)
        }
      }
      else {
        this.userList[index].employeeNr = event;
        this.userDetails.employeeNr = event;
      }
    }
  }

  onChangeLanguage(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (this.userList[index].state == 0)
      this.userList[index].state = 3;
    if (event?.value) {
      this.userList[index].language = event?.value;
      this.userDetails.language = event?.value;
    }
    else {
      this.userList[index].language = event?.value;
      this.userDetails.language = event?.value;
      this.DropdownConfig.externalError = true;
    }
  }

  onChangeEmail(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].email = event.target?.value;
    }
    this.userDetails.email = event.target?.value;
  }

  onChangeFaxNr(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].faxNr = event.target?.value;
    }
    this.userDetails.faxNr = event.target?.value;
  }

  onChangeTelNr(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].telNr = event.target?.value;
    }
    this.userDetails.telNr = event.target?.value;
  }

  onChangePersonalTelNr(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].personalTelNr = event.target?.value;
    }
    this.userDetails.personalTelNr = event.target?.value;
  }

  onChangeAccess2Config(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].access2config = event;
    }
    this.userDetails.access2config = event;
  }

  onChangeInitials(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (this.userList[index].state == 0)
      this.userList[index].state = 3;
    if (event.target?.value) {
      this.userList[index].initials = event.target?.value;
      this.userDetails.initials = event.target?.value;
    }
    else {
      this.userDetails.initials = event.target?.value;
      this.userDetails.initials = event.target?.value;
      this.InitialTextBoxconfig.externalError = true;
    }
  }

  onChangeIsIntegrationUser(event: any) {
    const index = this.userList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.userList[index].state == 0)
        this.userList[index].state = 3;
      this.userList[index].isIntegrationUser = event;
    }
    this.userDetails.isIntegrationUser = event;
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
    const updated = this.userList.findIndex(x => x.state == 1 || x.state == 3);
    if (this.saveUser.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(userList: UserDto[]) {
    this.showDialog = false;
    this.onSave(userList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.RemoveBusinessError(this.translate.instant('user.validationError.searchCriteria'));
    this.RemoveBusinessError(this.translate.instant('user.validationError.validSearch'));
    this.RemoveBusinessError(this.uniqueUserNameError);
    this.RemoveExternalError();
    this.RemoveUserProfile2CreditProviderErrors();
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }
  onClickCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {
    const firstNameError = new ErrorDto;
    firstNameError.validation = "required";
    firstNameError.isModelError = true;
    firstNameError.validationMessage = this.translate.instant('user.validationError.firstName');
    this.FirstNameTextBoxconfig.required = true;
    this.FirstNameTextBoxconfig.Errors = [firstNameError];

    const userNameError = new ErrorDto;
    userNameError.validation = "required";
    userNameError.isModelError = true;
    userNameError.validationMessage = this.translate.instant('user.validationError.userName');
    this.UserNameTextBoxconfig.required = true;
    this.UserNameTextBoxconfig.Errors = [userNameError];

    const languageError = new ErrorDto;
    languageError.validation = "required";
    languageError.isModelError = true;
    languageError.validationMessage = this.translate.instant('user.validationError.language');
    this.DropdownConfig.required = true;
    this.DropdownConfig.Errors = [languageError];

    const lastNameError = new ErrorDto;
    lastNameError.validation = "required";
    lastNameError.isModelError = true;
    lastNameError.validationMessage = this.translate.instant('user.validationError.lastName');
    this.LastNameTextBoxconfig.required = true;
    this.LastNameTextBoxconfig.Errors = [lastNameError];

    const initialError = new ErrorDto;
    initialError.validation = "required";
    initialError.isModelError = true;
    initialError.validationMessage = this.translate.instant('user.validationError.initial');
    this.InitialTextBoxconfig.required = true;
    this.InitialTextBoxconfig.Errors = [initialError];

    const creditProviderError = new ErrorDto;
    creditProviderError.validation = "required";
    creditProviderError.isModelError = true;
    creditProviderError.validationMessage = this.translate.instant('user.validationError.creditProvider');
    this.CreditProviderConfig.required = true;
    this.CreditProviderConfig.Errors = [creditProviderError];

    const userProfileError = new ErrorDto;
    userProfileError.validation = "required";
    userProfileError.isModelError = true;
    userProfileError.validationMessage = this.translate.instant('user.validationError.userProfile');
    this.UserProfileConfig.required = true;
    this.UserProfileConfig.Errors = [userProfileError];

    const ProductFamily = new ErrorDto;
    ProductFamily.validation = "required";
    ProductFamily.isModelError = true;
    ProductFamily.validationMessage = this.translate.instant('user.validationError.productFamily');
    this.ProductFamilyConfig.required = true;
    this.ProductFamilyConfig.Errors = [ProductFamily];
  }
}
