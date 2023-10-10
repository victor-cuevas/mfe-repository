import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TradingAddressesComponent } from '@close-front-office/mfe-broker/shared-ui';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import {
  AddressType3,
  FirmAddressModel,
  PortalUserService,
  UserProfileRequest,
  UserProfileResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './mbportal-trading-addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MbportalTradingAddressesComponent implements AfterViewInit {
  @ViewChild(TradingAddressesComponent) tradingAddressesComponent!: TradingAddressesComponent;

  intermediaryData = this.userDetailsService.getUserDetails();
  firmDetail = this.route.parent?.snapshot.data.intermediary?.firmDetail;

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private portalUserService: PortalUserService,
    private userDetailsService: UserDetailsService,
  ) {}

  ngAfterViewInit(): void {
    const filterAddresses = this.filterAddresses(this.intermediaryData.tradingAddresses as FirmAddressModel[]);
    filterAddresses.forEach(el => {
      if (el.label !== null) {
        this.tradingAddressesComponent.tradingAddress?.tradingAddresses.push(el);
      }
    });
    const selectedTradingAddress = filterAddresses.find(address => address.value.id === this.intermediaryData.tradingAddressId);
    this.tradingAddressesComponent.tradingAddress?.addressForm.controls.tradingAddress.reset(selectedTradingAddress?.value);
    this.cd.detectChanges();
  }

  updateProfile() {
    this.spinnerService.setIsLoading(true);
    this.portalUserService
      .portalUserUpdateProfile(this.mapToDTO())
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(() => {
        this.portalUserService.portalUserGetProfile().subscribe((response: UserProfileResponse) => {
          this.userDetailsService.setUserDetails(response);
          this.intermediaryData = this.userDetailsService.getUserDetails();
        });
        this.toastService.showMessage({
          summary: `The profile of has been edited successfully`,
        });
      });
  }

  private filterAddresses(addressArr: FirmAddressModel[]) {
    return addressArr
      .filter(el => el.addressType === AddressType3.TradingAddress && el.isActive)
      .map(el => {
        return { label: el.tradingName, value: el };
      });
  }

  private mapToDTO(): UserProfileRequest {
    return {
      personalDetails: {
        title: this.intermediaryData.personalDetails?.title,
        firstName: this.intermediaryData.personalDetails?.firstName,
        lastName: this.intermediaryData.personalDetails?.lastName,
        dateOfBirth: this.intermediaryData.personalDetails?.dateOfBirth,
      },
      tradingAddressId: this.tradingAddressesComponent.tradingAddress?.addressForm.controls.tradingAddress.value?.id,
      accountInformation: {
        email: this.intermediaryData?.accountInformation?.email,
        mobile: this.intermediaryData?.accountInformation?.mobile,
        telephoneWork: this.intermediaryData?.accountInformation?.telephoneWork,
      },
      receiveMarketingMaterials: this.intermediaryData.receiveMarketingMaterials,
      version: this.intermediaryData.version,
    };
  }
}
