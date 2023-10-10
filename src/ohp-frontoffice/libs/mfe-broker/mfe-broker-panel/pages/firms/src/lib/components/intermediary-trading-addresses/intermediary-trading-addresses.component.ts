import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntermediaryDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  FirmAddressModel,
  IntermediaryResponse,
  IntermediaryRole,
  IntermediaryService,
  PermissionType,
  UpdateIntermediaryRequest,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { TradingAddressesComponent } from '@close-front-office/mfe-broker/shared-ui';
import { CheckPermissionsServiceInterface, PERMISSIONS, SpinnerService } from '@close-front-office/mfe-broker/core';
import { finalize } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { AddressType3 } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  templateUrl: './intermediary-trading-addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntermediaryTradingAddressesComponent implements AfterViewInit {
  @ViewChild(TradingAddressesComponent) tradingAddressesComponent!: TradingAddressesComponent;

  addressDetails: FirmAddressModel[] = this.activatedRoute.parent?.snapshot.data.fetchedData?.addressDetails || {};
  firmName = this.activatedRoute.parent?.snapshot.data.fetchedData?.firmDetails?.firmName || '';
  intermediaryDetails: IntermediaryResponse = this.intermediaryDetailsService.getIntermediaryDetails();
  readOnly =
    this.activatedRoute.parent?.snapshot.data.readOnlyMode ||
    !this.checkPermissionService.checkPermissions({
      section: 'profiles',
      features: ['firm', 'lender'],
    });

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private intermediaryService: IntermediaryService,
    private intermediaryDetailsService: IntermediaryDetailsService,
    private toastService: ToastService,
  ) {}

  ngAfterViewInit(): void {
    const filterAddresses = this.filterAddresses(this.addressDetails);
    filterAddresses.forEach(el => {
      if (el.label !== null) {
        this.tradingAddressesComponent.tradingAddress?.tradingAddresses.push(el);
      }
    });
    const selectedTradingAddress = filterAddresses.find(address => address.value.id === this.intermediaryDetails.tradingAddressId);
    this.tradingAddressesComponent.tradingAddress?.addressForm.controls.tradingAddress.reset(selectedTradingAddress?.value);
    this.cd.detectChanges();
  }

  updateProfile() {
    this.spinnerService.setIsLoading(true);
    this.intermediaryService
      .intermediaryPutIntermediary(this.intermediaryDetails.intermediaryId as string, this.mapToDTO())
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(() => {
        this.intermediaryService
          .intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId as string)
          .subscribe((response: IntermediaryResponse) => {
            this.intermediaryDetails = response;
            this.intermediaryDetailsService.setIntermediaryDetails(response);
          });
        this.toastService.showMessage({ summary: `The profile has been edited successfully` });
      });
  }

  private filterAddresses(addressArr: FirmAddressModel[]) {
    return addressArr
      .filter(el => el.addressType === AddressType3.TradingAddress && el.isActive)
      .map(el => {
        return { label: el.tradingName, value: el };
      });
  }

  private mapToDTO(): UpdateIntermediaryRequest {
    return {
      ...this.intermediaryDetails,
      tradingAddressId: this.tradingAddressesComponent.tradingAddress?.addressForm.controls.tradingAddress.value?.id,
      permissionType:
        this.intermediaryDetails.intermediaryRole == IntermediaryRole.Advisor
          ? PermissionType.FullMortgageApplication
          : PermissionType.View,
    } as UpdateIntermediaryRequest;
  }
}
