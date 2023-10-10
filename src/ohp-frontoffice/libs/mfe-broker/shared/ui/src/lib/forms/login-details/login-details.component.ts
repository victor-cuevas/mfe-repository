import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { AuthManagementService } from '@close-front-office/shared/config';

const ONE_NUMBER = '.*\\d.*';
const ONE_LOWERCASE = '.*[a-z].*';
const ONE_UPPERCASE = '.*[A-Z].*';
const ONE_SPECIAL = '.*[!@#$%^&*.,{}()~:;|/\\`\'"~=+_-].*';
const PASSWORD_PATTERN = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.,{}()~:;|/\\`\'"~=+_-]).{8,32}$';

export class PasswordValidators {
  static pattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => (control.value?.match(PASSWORD_PATTERN) ? null : { pattern: true });
  }

  static newMatchesConfirm(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (group.get('newPassword')?.value !== group.get('confirmedNewPassword')?.value) {
        group.get('confirmedNewPassword')?.setErrors({ newMatchesConfirm: true });
        return { newMatchesConfirm: true };
      } else {
        group.get('confirmedNewPassword')?.setErrors(null);
        return null;
      }
    };
  }
}

@Component({
  selector: 'cfo-login-details',
  templateUrl: './login-details.component.html',
})
export class LoginDetailsComponent {
  @Input() isOpen = false;

  wasChangePasswordClicked = false;
  changePasswordResult$ = new BehaviorSubject<{ status: 'accepted' | 'rejected'; error: string | null } | null>(null);

  loginDetailsForm: FormGroup = this.fb.group(
    {
      currentPassword: [null, Validators.required],
      newPassword: [null, Validators.compose([Validators.required, PasswordValidators.pattern()])],
      confirmedNewPassword: [null, Validators.required],
    },
    {
      validators: [PasswordValidators.newMatchesConfirm()],
    },
  );

  get minChars(): boolean {
    const pass = this.loginDetailsForm.value.newPassword;
    return 8 <= pass?.length && pass?.length <= 32;
  }
  get oneNumber() {
    return this.loginDetailsForm.value.newPassword?.match(ONE_NUMBER);
  }
  get oneLowercase() {
    return this.loginDetailsForm.value.newPassword?.match(ONE_LOWERCASE);
  }
  get oneUppercase() {
    return this.loginDetailsForm.value.newPassword?.match(ONE_UPPERCASE);
  }
  get oneSpecial() {
    return this.loginDetailsForm.value.newPassword?.match(ONE_SPECIAL);
  }

  constructor(private fb: FormBuilder, private authManagement: AuthManagementService) {}

  onUpdate(): void {
    if (this.loginDetailsForm.status === 'INVALID') return;
    const formValues = this.loginDetailsForm.getRawValue();

    this.authManagement
      .changePassword(formValues.currentPassword, formValues.newPassword)
      .then(() => {
        this.changePasswordResult$.next({ status: 'accepted', error: null });
      })
      .catch(err => {
        this.changePasswordResult$.next({ status: 'rejected', error: err.message });
      });
  }
}
