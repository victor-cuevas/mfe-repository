import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { PortalUserService, UserProfileRequest, UserProfileResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { ProfileComponent } from '@close-front-office/mfe-broker/shared-ui';
import { IntermediaryRole, UserType } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  templateUrl: './mbportal-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MbportalProfileComponent implements AfterViewInit {
  userData: UserProfileResponse = this.userDetailsService.getUserDetails();
  loggedInUser = this.activeRouter.snapshot.parent?.data.intermediary?.reduxData;
  isLender = this.activeRouter.snapshot.parent?.data.intermediary?.reduxData.userType === UserType.Lender;

  @ViewChild(ProfileComponent) profileComponent!: ProfileComponent;

  constructor(
    private spinnerService: SpinnerService,
    private userService: PortalUserService,
    private toastService: ToastService,
    private activeRouter: ActivatedRoute,
    private userDetailsService: UserDetailsService,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.profileComponent.editProfileForm.reset(this.mapToForm(this.userData));
    if (
      this.profileComponent.editProfileForm.controls.userRole.value === IntermediaryRole.SupervisorAndAdvisor ||
      this.profileComponent.editProfileForm.controls.userRole.value === IntermediaryRole.Advisor
    ) {
      this.profileComponent.editProfileForm.controls.advisorUniqueId.setValidators(Validators.required);
    } else {
      this.profileComponent.editProfileForm.get('advisorUniqueId')?.setValidators(null);
      this.profileComponent.editProfileForm.get('advisorUniqueId')?.setValue(null);
    }

    this.profileComponent.editProfileForm.get('advisorUniqueId')?.updateValueAndValidity();
    this.profileComponent.personalDetails.personalDetailsForm.reset(this.mapToFormPersonalDetails());
    this.cd.detectChanges();
  }

  updateProfile() {
    if (this.allFormsAreValid()) {
      this.spinnerService.setIsLoading(true);
      this.userService
        .portalUserUpdateProfile(this.mapToDTO())
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe(() => {
          this.userService.portalUserGetProfile().subscribe((response: UserProfileResponse) => {
            this.userDetailsService.setUserDetails(response);
            this.userData = this.userDetailsService.getUserDetails();
          });
          this.toastService.showMessage({ summary: `The profile has been edited successfully` });
        });
    }
  }

  private mapToForm(intermediary: any) {
    return {
      firmName: this.loggedInUser.firmName,
      userRole: this.loggedInUser?.role,
      advisorUniqueId: intermediary?.advisorUniqueId,
    };
  }

  private mapToFormPersonalDetails() {
    return {
      title: this.userData.personalDetails?.title,
      firstName: this.userData.personalDetails?.firstName,
      surName: this.userData.personalDetails?.lastName,
      dob: new Date(this.userData.personalDetails?.dateOfBirth as string),
    };
  }

  private mapToDTO(): UserProfileRequest {
    return {
      personalDetails: {
        title: this.profileComponent.personalDetails?.personalDetailsForm.controls.title.value,
        firstName: this.profileComponent.personalDetails?.personalDetailsForm.controls.firstName.value,
        lastName: this.profileComponent.personalDetails?.personalDetailsForm.controls.surName.value,
        dateOfBirth: new Date(
          this.profileComponent.personalDetails?.personalDetailsForm.controls.dob.value.getTime() -
            this.profileComponent.personalDetails?.personalDetailsForm.controls.dob.value?.getTimezoneOffset() * 60 * 1000,
        ).toISOString(),
      },
      tradingAddressId: this.userData.tradingAddressId,
      accountInformation: {
        email: this.userData.accountInformation?.email,
        mobile: this.userData.accountInformation?.mobile,
        telephoneWork: this.userData.accountInformation?.telephoneWork,
      },
      receiveMarketingMaterials: this.userData.receiveMarketingMaterials,
      version: this.userData.version,
    };
  }

  private allFormsAreValid(): boolean {
    this.profileComponent.editProfileForm.markAllAsTouched();
    this.profileComponent.personalDetails?.personalDetailsForm.markAllAsTouched();
    return !!(this.profileComponent.personalDetails?.personalDetailsForm.valid && this.profileComponent.editProfileForm.valid);
  }
}
