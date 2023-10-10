import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import {
  AccountInfoComponent,
  LoginDetailsComponent,
  PersonalDetailsComponent,
  TradingAddressComponent,
} from '@close-front-office/mfe-broker/shared-ui';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { loadPortalUserSuccess, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AddressType3,
  AuthorizationContextModel,
  FirmAddressModel,
  PortalUserService,
  UserProfileRequest,
  UserProfileResponse,
  UserType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mbp-complete-registration-form',
  templateUrl: './complete-registration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegistrationFormComponent implements OnInit, AfterViewInit {
  @Input() intermediaryData!: UserProfileResponse;
  loggedInUser = this.activatedRouter.snapshot.data.fetchedData?.reduxData;
  isLender = this.loggedInUser.userType == UserType.Lender;
  userType = UserType;
  completeRegistrationForm = this.fb.group({
    userRole: ['', Validators.required],
    firmName: { value: '', disabled: true },
    advisorUniqueId: null,
    agreeToNotifications: false,
    agreeToTermsAndConditions: [false, this.isLender ? null : Validators.required],
  });
  routePaths: typeof RoutePaths = RoutePaths;

  @ViewChild(LoginDetailsComponent) loginDetails!: LoginDetailsComponent;
  @ViewChild(PersonalDetailsComponent) personalDetails!: PersonalDetailsComponent;
  @ViewChild(AccountInfoComponent) accountInfo!: AccountInfoComponent;
  @ViewChild(TradingAddressComponent) tradingAddress!: TradingAddressComponent;

  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    private portalUserService: PortalUserService,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.completeRegistrationForm.reset(this.mapToForm(this.intermediaryData));

    this.completeRegistrationForm.controls.advisorUniqueId.valueChanges.subscribe(val => {
      if (val === 'Advisor' || val === 'SupervisorAndAdvisor') {
        this.completeRegistrationForm.get('advisorUniqueId')?.setValidators(Validators.required);
      } else {
        this.completeRegistrationForm.get('advisorUniqueId')?.setValidators(null);
        this.completeRegistrationForm.get('advisorUniqueId')?.setValue(null);
      }
    });
  }

  ngAfterViewInit() {
    const filterAddresses = this.filterAddresses(this.intermediaryData?.tradingAddresses as FirmAddressModel[]);
    filterAddresses?.forEach(el => {
      if (el.label !== null) {
        this.tradingAddress?.tradingAddresses.push(el);
      }
    });
    const selectedTradingAddress = this.intermediaryData?.tradingAddresses?.find(
      (item: FirmAddressModel) => item.id === this.intermediaryData.tradingAddressId,
    );
    this.tradingAddress?.addressForm.controls.tradingAddress.reset(selectedTradingAddress);
    this.personalDetails.personalDetailsForm.reset(this.mapToFormPersonalDetails(this.intermediaryData));
    this.accountInfo.accountInfoForm.reset(this.mapToFormAccountInfo(this.intermediaryData));
  }

  updateProfile() {
    if (this.allFormsAreValid()) {
      this.spinnerService.setIsLoading(true);
      this.portalUserService
        .portalUserUpdateProfile(this.mapToDTO())
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe(() => {
          this.portalUserService
            .portalUserGetMe()
            .pipe()
            .subscribe((response: AuthorizationContextModel) => {
              this.store.dispatch(loadPortalUserSuccess({ entity: response }));
              if (response.userType === UserType.Intermediary) {
                this.router.navigate([`broker/${this.loggedInUser.firmId}/cases`]).then(() => this.spinnerService.setIsLoading(false));
              } else {
                this.router.navigate(['/panel']).then(() => this.spinnerService.setIsLoading(false));
              }
            });
        });
    }
  }

  private mapToForm(intermediary: UserProfileResponse) {
    return {
      firmName: this.loggedInUser.firmName,
      userRole: this.loggedInUser?.role,
      advisorUniqueId: intermediary?.advisorUniqueId,
    };
  }

  private mapToFormPersonalDetails(intermediary: UserProfileResponse) {
    return {
      title: intermediary.personalDetails?.title,
      firstName: intermediary.personalDetails?.firstName,
      surName: intermediary.personalDetails?.lastName,
      ...(intermediary.personalDetails?.dateOfBirth && { dob: new Date(intermediary.personalDetails.dateOfBirth) }),
    };
  }

  private mapToFormAccountInfo(intermediary: UserProfileResponse) {
    return {
      email: intermediary.accountInformation?.email,
      mobile: intermediary.accountInformation?.mobile,
      tel: intermediary.accountInformation?.telephoneWork,
    };
  }

  private filterAddresses(addressArr: FirmAddressModel[] | null | undefined) {
    if (!addressArr || addressArr.length === 0) return [];
    return addressArr
      ?.filter(el => el.addressType === AddressType3.TradingAddress && el.isActive)
      .map(el => {
        return { label: el.tradingName, value: el };
      });
  }

  private allFormsAreValid(): boolean {
    this.completeRegistrationForm.markAllAsTouched();
    this.accountInfo?.accountInfoForm.markAllAsTouched();
    this.personalDetails?.personalDetailsForm.markAllAsTouched();

    return (
      this.completeRegistrationForm.valid && this.accountInfo?.accountInfoForm.valid && this.personalDetails?.personalDetailsForm.valid
    );
  }

  private mapToDTO(): UserProfileRequest {
    return {
      personalDetails: {
        title: this.personalDetails?.personalDetailsForm.controls.title.value,
        firstName: this.personalDetails?.personalDetailsForm.controls.firstName.value,
        lastName: this.personalDetails?.personalDetailsForm.controls.surName.value,
        dateOfBirth: this.personalDetails?.personalDetailsForm.controls.dob.value,
      },
      ...(this.loggedInUser.userType === UserType.Intermediary && {
        tradingAddressId: this.tradingAddress?.addressForm.controls.tradingAddress.value?.id,
      }),
      accountInformation: {
        email: this.accountInfo.accountInfoForm.controls.email.value,
        mobile: this.accountInfo.accountInfoForm.controls.mobile.value?.e164Number
          ? `${this.accountInfo.accountInfoForm.controls.mobile.value.e164Number}`
          : this.accountInfo.accountInfoForm.controls.mobile.value,
        telephoneWork: this.accountInfo.accountInfoForm.controls.tel.value?.e164Number
          ? `${this.accountInfo.accountInfoForm.controls.tel.value.e164Number}`
          : this.accountInfo.accountInfoForm.controls.tel.value,
      },
      receiveMarketingMaterials: !!this.completeRegistrationForm.controls.agreeToNotifications.value,
      agreeToTermsAndConditions: this.isLender || this.completeRegistrationForm.controls.agreeToTermsAndConditions.value,
      version: this.intermediaryData.version,
    };
  }
}
