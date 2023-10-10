import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AccountComponent, LoginDetailsComponent } from '@close-front-office/mfe-broker/shared-ui';
import { loadCaseTableSuccess, loadPortalUserSuccess, UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { PortalUserService, UserProfileRequest, UserProfileResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { AuthManagementService } from '@close-front-office/shared/config';

@Component({
  templateUrl: './mbportal-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MbportalAccountComponent implements AfterViewInit {
  @ViewChild(AccountComponent) accountComponent!: AccountComponent;
  @ViewChild(LoginDetailsComponent) loginDetails!: LoginDetailsComponent;

  userData: UserProfileResponse = this.userDetailsService.getUserDetails();

  constructor(
    private cd: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private userService: PortalUserService,
    private authManagement: AuthManagementService,
    private toastService: ToastService,
    private userDetailsService: UserDetailsService,
    private store: Store,
  ) {}

  ngAfterViewInit(): void {
    this.accountComponent?.accountInfo?.accountInfoForm.reset(this.mapToFormAccountInfo());
    this.accountComponent?.accountForm?.controls.emailNotification.setValue(this.userData.receiveMarketingMaterials);
    this.cd.detectChanges();
  }

  confirmDeactivateAccount() {
    this.spinnerService.setIsLoading(true);
    this.userService.portalUserDeactivateAccount().subscribe(
      () => {
        this.authManagement.logout();
        setTimeout(() => {
          this.store.dispatch(loadPortalUserSuccess({ entity: null }));
          this.store.dispatch(loadCaseTableSuccess({ entity: {} }));
        }, 500);
      },
      () => {
        this.accountComponent.showDeactivateAccount = false;
        this.spinnerService.setIsLoading(false);
      },
    );
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

  private allFormsAreValid(): boolean {
    this.accountComponent?.accountInfo.accountInfoForm.markAllAsTouched();

    return !!this.accountComponent?.accountInfo?.accountInfoForm.valid;
  }

  private mapToDTO(): UserProfileRequest {
    const { email, mobile, tel } = this.accountComponent.accountInfo.accountInfoForm.getRawValue();
    return {
      personalDetails: {
        title: this.userData.personalDetails?.title,
        firstName: this.userData.personalDetails?.firstName,
        lastName: this.userData.personalDetails?.lastName,
        dateOfBirth: this.userData.personalDetails?.dateOfBirth,
      },
      tradingAddressId: this.userData?.tradingAddressId ? this.userData?.tradingAddressId : null,
      accountInformation: {
        email,
        mobile: mobile?.e164Number,
        telephoneWork: tel?.e164Number,
      },
      receiveMarketingMaterials: this.accountComponent.accountForm.controls.emailNotification.value,
      version: this.userData.version,
    };
  }

  private mapToFormAccountInfo() {
    return {
      email: this.userData.accountInformation?.email,
      mobile: this.userData.accountInformation?.mobile,
      tel: this.userData.accountInformation?.telephoneWork,
    };
  }
}
