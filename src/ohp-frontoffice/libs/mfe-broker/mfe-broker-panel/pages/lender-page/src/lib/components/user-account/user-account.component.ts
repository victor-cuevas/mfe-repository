import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AccountInfoComponent } from '@close-front-office/mfe-broker/shared-ui';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import {
  LenderUserResponse,
  LenderUsersService,
  PermissionType,
  UpdateUserRequest,
  UpdateUserRequestUserType,
  UserRole,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { finalize } from 'rxjs/operators';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Component({
  selector: 'close-front-office-user-account',
  templateUrl: './user-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountComponent implements AfterViewInit {
  @ViewChild(AccountInfoComponent) accountInfoComponent!: AccountInfoComponent;
  userId = this.route.snapshot.parent?.paramMap.get('id');
  currentData = this.userDetailService.getLenderUserDetails();
  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private spinner: SpinnerService,
    private lenderUserService: LenderUsersService,
    private userDetailService: UserDetailsService,
    private toastService: ToastService,
  ) {}

  ngAfterViewInit(): void {
    this.accountInfoComponent.accountInfoForm.reset(this.mapToFormAccount());
    this.cd.detectChanges();
  }

  updateProfile() {
    this.spinner.setIsLoading(true);
    this.lenderUserService
      .lenderUsersPutLenderUser(this.userId as string, this.mapToDTO())
      .pipe(finalize(() => this.spinner.setIsLoading(false)))
      .subscribe(() => {
        this.lenderUserService.lenderUsersGetLenderUser(this.userId as string).subscribe((response: LenderUserResponse) => {
          this.userDetailService.setLenderUserDetails(response);
          this.currentData = this.userDetailService.getLenderUserDetails();
        });
        this.toastService.showMessage({ summary: `The profile has been edited successfully` });
      });
  }

  private mapToFormAccount() {
    return {
      email: this.currentData.email,
      mobile: this.currentData.telephone?.mobile,
      tel: this.currentData.telephone?.telephoneWork,
    };
  }
  private mapToDTO(): UpdateUserRequest {
    return {
      person: {
        title: this.currentData.person.title,
        firstName: this.currentData.person.firstName,
        lastName: this.currentData.person.lastName,
        dateOfBirth: this.currentData.person.dateOfBirth,
      },
      userType: UpdateUserRequestUserType.Lender,
      status: this.currentData.status,
      userRole: UserRole.LenderAdvisorAdmin, //change when the BFF is ready
      permissionType: this.currentData?.permissionType as PermissionType,
      email: this.accountInfoComponent.accountInfoForm?.controls['email'].value,
      telephone: {
        mobile: this.accountInfoComponent.accountInfoForm?.controls['mobile'].value.e164Number,
        telephoneWork: this.accountInfoComponent.accountInfoForm?.controls['tel'].value.e164Number,
      },
      version: this.currentData.version,
    };
  }
}
