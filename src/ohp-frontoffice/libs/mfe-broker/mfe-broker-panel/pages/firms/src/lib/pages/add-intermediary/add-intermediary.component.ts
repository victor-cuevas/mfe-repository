import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';

import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import {
  AccountInfoComponent,
  PersonalDetailsComponent,
  TradingAddressComponent,
  UserRoleComponent,
} from '@close-front-office/mfe-broker/shared-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  AddressType2,
  FirmAddressModelEx,
  FirmDetailsModel,
  IntermediaryFcaDetailsModel,
  IntermediaryRole,
  IntermediaryService,
  InviteIntermediaryRequest,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { CheckPermissionsServiceInterface, PERMISSIONS, SpinnerService } from '@close-front-office/mfe-broker/core';
import { finalize } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'mbpanel-add-intermediary',
  templateUrl: './add-intermediary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIntermediaryComponent implements AfterViewInit {
  firmId = this.route.snapshot.paramMap.get('id');
  breadcrumb: MenuItem[] = [{ label: this.translate.instant('general.buttons.back'), routerLink: '../..', icon: 'pi pi-chevron-left' }];
  routePaths: typeof RoutePaths = RoutePaths;

  @ViewChild(UserRoleComponent)
  userRole?: UserRoleComponent;

  @ViewChild(AccountInfoComponent)
  accountInfo?: AccountInfoComponent;

  @ViewChild(PersonalDetailsComponent)
  personalDetails?: PersonalDetailsComponent;

  @ViewChild(TradingAddressComponent)
  tradingAddress?: TradingAddressComponent;

  firm?: FirmDetailsModel;
  hasFCADetail = false;
  lockDefaultStructure = false;
  isFieldDisabled = false;
  hasPermission = this.checkPermissionService.checkPermissions({
    section: 'profiles',
    features: ['firm', 'lender'],
  });

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private route: ActivatedRoute,
    private toast: ToastService,
    private translate: TranslateService,
    private intermediaryService: IntermediaryService,
    private router: Router,
    private spinnerService: SpinnerService,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.firm = this.route.snapshot.data.fetchedData?.firm;
    if (this.route.snapshot.data.fetchedData?.address) {
      const filterAddresses = this.filterAddresses(this.route.snapshot.data.fetchedData?.address);
      filterAddresses?.forEach(el => {
        this.tradingAddress?.tradingAddresses.push(el);
      });
      this.tradingAddress?.addressForm.controls.tradingAddress.reset(filterAddresses[0].value);
    }
    this.userRole?.userRoleForm.controls.userRole.valueChanges.subscribe(role => {
      this.isFieldDisabled = role === IntermediaryRole.Advisor || role === IntermediaryRole.SupervisorAndAdvisor;
    });
    this.userRole && this.userRole.userRoleForm.get('firmName')?.reset({ value: this.firm?.firmName, disabled: true });
    this.enableAdvisorUniqueId();
  }

  /**
   * Function that gets called when the submit button is clicked.
   * Resolves form validation and API POST call
   */
  submit() {
    const formsAreValid = this.validateForms();
    if (formsAreValid) {
      this.postIntermediary();
    } else {
      this.toast.showMessage({ summary: this.translate.instant('general.validations.fillAllRequiredFields'), severity: 'error' });
    }
  }

  /**
   * Function that validates user-role, account-info, personal-details and
   * trading address and returns true if forms are valid and false if not
   *
   * Also triggers all input fields as touched so warnings for untouched fiels can appear
   *
   * @returns {boolean}
   */
  validateForms(): boolean {
    this.userRole?.userRoleForm.markAllAsTouched();
    this.accountInfo?.accountInfoForm.markAllAsTouched();
    this.personalDetails?.personalDetailsForm.markAllAsTouched();
    this.tradingAddress?.addressForm.markAllAsTouched();

    return !!(this.userRole?.userRoleForm.valid && this.accountInfo?.accountInfoForm.valid && this.tradingAddress?.addressForm.valid);
  }

  /**
   * Function that gets all entered form data from user-role, account-info, personal-details and
   * trading address and maps to data transfer object
   *
   * @returns
   */
  mapToDto(): InviteIntermediaryRequest {
    const userRoleValue = this.userRole?.userRoleForm.getRawValue();
    const accountInfoValue = this.accountInfo?.accountInfoForm.getRawValue();
    const tradingAddressValue = this.tradingAddress?.addressForm.getRawValue();
    const personDetailsValue = this.personalDetails?.personalDetailsForm.getRawValue();

    return {
      firmId: this.firmId,
      ...(userRoleValue.advisorUniqueId && { advisorUniqueId: userRoleValue.advisorUniqueId.toString() }),
      intermediaryRole: userRoleValue.userRole,
      person: {
        title: personDetailsValue.title,
        firstName: personDetailsValue.firstName,
        lastName: personDetailsValue.surName,
        dateOfBirth: personDetailsValue?.dob
          ? new Date(personDetailsValue?.dob?.getTime() - personDetailsValue?.dob?.getTimezoneOffset() * 60 * 1000).toISOString()
          : null,
      },
      tradingAddressId: tradingAddressValue.tradingAddress.id,
      email: accountInfoValue.email,
      telephone: {
        mobile: accountInfoValue.mobile?.e164Number,
        telephoneWork: accountInfoValue.tel?.e164Number,
      },
      copyCaseNotificationsToAdminAssistants: false,
    };
  }

  postIntermediary() {
    const body = this.mapToDto();
    this.spinnerService.setIsLoading(true);
    this.intermediaryService
      .intermediaryPostIntermediary(body)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(
        res => {
          res &&
            this.router
              .navigate([this.firmId ? this.routePaths.LIST_INTERMEDIARIES.replace(':id', this.firmId) : ''])
              .then(() =>
                this.toast.showMessage({
                  summary: this.translate.instant('general.validations.newIntermediaryCreatedSuccessfully'),
                  severity: 'success',
                }),
              );
        },
        error => {
          console.log(error);
        },
      );
  }

  populateData(advisorUniqueID: string) {
    if (advisorUniqueID) {
      this.spinnerService.setIsLoading(true);
      this.hasFCADetail = true;
      this.lockDefaultStructure = true;
      this.intermediaryService
        .intermediaryGetIntermediaryFcaDetails(advisorUniqueID, 'response')
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe((resp: HttpResponse<IntermediaryFcaDetailsModel>) => {
          if (resp.status === 200) {
            const name: string[] = resp.body?.fullName.split(' ') as Array<string>;
            this.personalDetails?.personalDetailsForm.controls.firstName.setValue(name[0]);
            this.personalDetails?.personalDetailsForm.controls.surName.setValue(name[name.length - 1]);
            this.userRole?.userRoleForm.controls.advisorUniqueId.markAsDirty();
            this.userRole?.userRoleForm.controls.advisorUniqueId.setErrors(null);
          }
          if (resp.status === 204) {
            this.userRole?.userRoleForm.get('advisorUniqueId')?.setErrors({ isValidAdvisorUniqueID: true });
            this.cd.detectChanges();
          }
        });
    }
  }

  unlockDefaultStructure() {
    this.hasFCADetail = false;
    this.isFieldDisabled = false;
  }

  private filterAddresses(addressArr: FirmAddressModelEx[]) {
    return addressArr
      .filter(address => address.addressType === AddressType2.TradingAddress)
      .map(el => {
        return { label: el.tradingName, value: el };
      });
  }

  private enableAdvisorUniqueId() {
    if (this.hasPermission) this.userRole?.userRoleForm.controls.advisorUniqueId.enable();
  }
}
