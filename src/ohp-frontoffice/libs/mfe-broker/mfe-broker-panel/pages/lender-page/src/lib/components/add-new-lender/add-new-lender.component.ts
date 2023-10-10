import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  LenderUsersService,
  PermissionType,
  RegisterNewUserRequest,
  RegisterNewUserRequestUserType,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { AccountInfoComponent, PersonalDetailsComponent, UserRoleComponent } from '@close-front-office/mfe-broker/shared-ui';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { MenuItem } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'close-front-office-add-new-lender',
  templateUrl: './add-new-lender.component.html',
})
export class AddNewLenderComponent {
  breadcrumb: MenuItem[] = [{ label: 'Back', routerLink: '../', icon: 'pi pi-chevron-left' }];
  @ViewChild(UserRoleComponent) userRole!: UserRoleComponent;
  @ViewChild(PersonalDetailsComponent) personalDetails!: PersonalDetailsComponent;
  @ViewChild(AccountInfoComponent) accountInfo!: AccountInfoComponent;

  addNewLenderForm = this.fb.group({
    automaticAccountActivation: false,
  });

  constructor(
    private fb: FormBuilder,
    private lenderUserService: LenderUsersService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  createNewLender() {
    this.spinnerService.setIsLoading(true);
    this.lenderUserService
      .lenderUsersPostLenderUser(this.mapToDTO())
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.toastService.showMessage({ summary: 'The new lender was created successfully' });
      });
  }

  private mapToDTO(): RegisterNewUserRequest {
    return {
      userId: '',
      person: {
        title: this.personalDetails.personalDetailsForm.controls['title'].value,
        firstName: this.personalDetails.personalDetailsForm.controls['firstName'].value,
        lastName: this.personalDetails.personalDetailsForm.controls['surName'].value,
        dateOfBirth: new Date(
          this.personalDetails.personalDetailsForm.controls['dob'].value?.getTime() -
            this.personalDetails.personalDetailsForm.controls['dob'].value?.getTimezoneOffset() * 60 * 1000,
        ).toISOString(),
      },
      userType: RegisterNewUserRequestUserType.Lender,
      userRole: this.userRole.userRoleForm.controls['userRole'].value,
      permissionType: PermissionType.FullMortgageApplication, //TODO to remove in the model
      email: this.accountInfo.accountInfoForm.controls['email'].value,
      telephone: {
        mobile: this.accountInfo.accountInfoForm.controls['mobile'].value.e164Number,
        telephoneWork: this.accountInfo.accountInfoForm.controls['tel'].value
          ? this.accountInfo.accountInfoForm.controls['tel']?.value.e164Number
          : null,
      },
    };
  }

  allFormAreValid(): boolean {
    if (
      this.addNewLenderForm?.valid &&
      this.accountInfo?.accountInfoForm?.valid &&
      this.personalDetails?.personalDetailsForm?.valid &&
      this.userRole?.userRoleForm?.valid
    ) {
      return true;
    }
    return false;
  }
}
