import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogData, PersonalDetailsComponent, UserRoleComponent } from '@close-front-office/mfe-broker/shared-ui';
import {
  IntermediaryStatus,
  LenderUserResponse,
  LenderUsersService,
  PermissionType,
  UpdateUserRequest,
  UpdateUserRequestUserType,
  UserStatus,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { finalize } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Component({
  selector: 'close-front-office-user-profile',
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements AfterViewInit {
  @ViewChild(PersonalDetailsComponent) personalDetailsComponent!: PersonalDetailsComponent;
  @ViewChild(UserRoleComponent) userRoleComponent!: UserRoleComponent;
  userId = this.route.snapshot.parent?.paramMap.get('id');
  currentData = this.userDetailService.getLenderUserDetails();
  editProfileForm = this.fb.group({
    status: [this.currentData.status === IntermediaryStatus.Active],
  });
  showChangeStatusPopup = false;
  changeStatusDataPopup: DialogData | undefined;
  userStatus: typeof UserStatus = UserStatus;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private cd: ChangeDetectorRef,
    private userDetailService: UserDetailsService,
    private spinner: SpinnerService,
    private userLenderService: LenderUsersService,
    private toastService: ToastService,
  ) {}

  ngAfterViewInit(): void {
    this.userRoleComponent.userRoleForm.controls['userRole'].setValue(this.currentData.role); //from data
    this.personalDetailsComponent.personalDetailsForm.reset(this.mapToFormPersonalDetails());
    this.cd.detectChanges();
  }

  onSwitchStatus(event: any) {
    this.showChangeStatusPopup = true;
    this.changeStatusDataPopup = {
      type: 'success',
      icon: event.checked ? 'pi pi-user-plus' : 'pi pi-user-minus',
      header: this.translate.instant(event.checked ? 'dialog.active' : 'dialog.inactive'),
      content: this.translate.instant(event.checked ? 'dialog.changeStatusActiveMsg' : 'dialog.changeStatusInactiveMsg'),
    };
  }

  cancelChangeStatus() {
    this.editProfileForm.controls['status'].setValue(!this.editProfileForm.controls['status'].value);
    this.showChangeStatusPopup = false;
  }

  confirmChangeStatus() {
    this.showChangeStatusPopup = false;
  }

  updateProfile() {
    this.spinner.setIsLoading(true);
    this.userLenderService
      .lenderUsersPutLenderUser(this.userId as string, this.mapToDTO())
      .pipe(finalize(() => this.spinner.setIsLoading(false)))
      .subscribe(() => {
        this.userLenderService.lenderUsersGetLenderUser(this.userId as string).subscribe((response: LenderUserResponse) => {
          this.userDetailService.setLenderUserDetails(response);
          this.currentData = this.userDetailService.getLenderUserDetails();
        });
        this.toastService.showMessage({ summary: `The profile has been edited successfully` });
      });
  }

  private mapToFormPersonalDetails() {
    return {
      title: this.currentData.person.title,
      firstName: this.currentData.person.firstName,
      surName: this.currentData.person.lastName,
      dob: new Date(this.currentData.person.dateOfBirth as string),
    };
  }

  private mapToDTO(): UpdateUserRequest {
    return {
      person: {
        title: this.personalDetailsComponent.personalDetailsForm.controls['title'].value,
        firstName: this.personalDetailsComponent.personalDetailsForm.controls['firstName'].value,
        lastName: this.personalDetailsComponent.personalDetailsForm.controls['surName'].value,
        dateOfBirth: new Date(
          this.personalDetailsComponent.personalDetailsForm.controls['dob'].value.getTime() -
            this.personalDetailsComponent.personalDetailsForm.controls['dob'].value?.getTimezoneOffset() * 60 * 1000,
        ).toISOString(),
      },
      userType: UpdateUserRequestUserType.Lender,
      status: this.editProfileForm.controls['status'].value ? UserStatus.Active : UserStatus.Inactive,
      userRole: this.userRoleComponent.userRoleForm.controls['userRole'].value,
      permissionType: this.currentData?.permissionType as PermissionType,
      email: this.currentData?.email,
      telephone: {
        mobile: this.currentData?.telephone?.mobile as string,
        telephoneWork: this.currentData?.telephone?.telephoneWork,
      },
      version: this.currentData?.version,
    };
  }
}
