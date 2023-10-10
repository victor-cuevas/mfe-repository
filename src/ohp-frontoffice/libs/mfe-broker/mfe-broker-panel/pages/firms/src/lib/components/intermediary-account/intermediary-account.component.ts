import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountComponent } from '@close-front-office/mfe-broker/shared-ui';
import { IntermediaryDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  IntermediaryResponse,
  IntermediaryRole,
  IntermediaryService,
  PermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { CheckPermissionsServiceInterface, PERMISSIONS, SpinnerService } from '@close-front-office/mfe-broker/core';
import { finalize } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

@Component({
  templateUrl: './intermediary-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntermediaryAccountComponent implements AfterViewInit {
  @ViewChild(AccountComponent) accountComponent!: AccountComponent;

  intermediaryDetails: IntermediaryResponse = this.intermediaryDetailsService.getIntermediaryDetails();
  readOnly =
    this.route.snapshot.data.readOnlyMode ||
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
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    this.accountComponent?.accountInfo?.accountInfoForm.reset(this.mapToFormAccountInfo());
    this.accountComponent?.accountForm?.controls.emailNotification.setValue(this.intermediaryDetails.receiveMarketingMaterials);
    this.cd.detectChanges();
  }

  confirmDeactivateAccount() {}

  updateProfile() {
    if (this.allFormsAreValid()) {
      this.spinnerService.setIsLoading(true);
      this.intermediaryService
        .intermediaryPutIntermediary(this.intermediaryDetails.intermediaryId || '', this.mapToDTO())
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe(() => {
          this.intermediaryService
            .intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId || '')
            .subscribe((response: IntermediaryResponse) => {
              this.intermediaryDetails = response;
              this.intermediaryDetailsService.setIntermediaryDetails(response);
            });
          this.toastService.showMessage({ summary: `The profile has been edited successfully` });
        });
    }
  }

  private allFormsAreValid(): boolean {
    this.accountComponent?.accountInfo.accountInfoForm.markAllAsTouched();

    return !!this.accountComponent?.accountInfo?.accountInfoForm.valid;
  }

  private mapToDTO(): any {
    return {
      ...this.intermediaryDetails,
      permissionType:
        this.intermediaryDetails.intermediaryRole == IntermediaryRole.Advisor
          ? PermissionType.FullMortgageApplication
          : PermissionType.View, // TODO remove when BFF remove it from the model
      email: this.accountComponent?.accountInfo.accountInfoForm.controls.email.value,
      telephone: {
        mobile: `${this.accountComponent?.accountInfo.accountInfoForm.controls.mobile.value.e164Number}`,
        telephoneWork: this.accountComponent?.accountInfo.accountInfoForm.controls.tel.value
          ? `${this.accountComponent?.accountInfo.accountInfoForm.controls.tel.value.e164Number}`
          : null,
      },
    };
  }

  private mapToFormAccountInfo() {
    return {
      email: this.intermediaryDetails.email,
      mobile: this.intermediaryDetails.telephone?.mobile,
      tel: this.intermediaryDetails.telephone?.telephoneWork,
    };
  }
}
