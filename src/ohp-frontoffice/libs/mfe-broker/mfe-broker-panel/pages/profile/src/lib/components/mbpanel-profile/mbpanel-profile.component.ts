import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { ProfileComponent } from '@close-front-office/mfe-broker/shared-ui';
import { ActivatedRoute } from '@angular/router';

import { UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { PortalUserService, UserProfileRequest, UserProfileResponse, UserType } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { IntermediaryRole } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  templateUrl: './mbpanel-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MbpanelProfileComponent implements AfterViewInit {
  intermediaryData: UserProfileResponse = this.userDetailsService.getUserDetails();
  loggedInUser = this.activeRouter.snapshot.parent?.data.intermediary?.reduxData;
  isLender = this.activeRouter.snapshot.parent?.data.intermediary?.reduxData.userType === UserType.Lender;

  @ViewChild(ProfileComponent) profileComponent!: ProfileComponent;

  constructor(
    private spinnerService: SpinnerService,
    private userService: PortalUserService,
    private toastService: ToastService,
    private userDetailsService: UserDetailsService,
    private activeRouter: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.profileComponent.editProfileForm.reset(this.mapToForm(this.intermediaryData));
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
            this.intermediaryData = this.userDetailsService.getUserDetails();
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
      title: this.intermediaryData.personalDetails?.title,
      firstName: this.intermediaryData.personalDetails?.firstName,
      surName: this.intermediaryData.personalDetails?.lastName,
      dob: new Date(this.intermediaryData.personalDetails?.dateOfBirth as string),
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
      tradingAddressId: this.intermediaryData.tradingAddressId,
      accountInformation: {
        email: this.intermediaryData.accountInformation?.email,
        mobile: `${this.intermediaryData.accountInformation?.mobile}`,
        telephoneWork: this.intermediaryData.accountInformation?.telephoneWork
          ? `${this.intermediaryData.accountInformation.telephoneWork}`
          : null,
      },
      receiveMarketingMaterials: this.intermediaryData.receiveMarketingMaterials,
      version: this.intermediaryData.version,
    };
  }

  private allFormsAreValid(): boolean {
    this.profileComponent.editProfileForm.markAllAsTouched();
    this.profileComponent.personalDetails?.personalDetailsForm.markAllAsTouched();
    return !!(this.profileComponent.personalDetails?.personalDetailsForm.valid && this.profileComponent.editProfileForm.valid);
  }
}
