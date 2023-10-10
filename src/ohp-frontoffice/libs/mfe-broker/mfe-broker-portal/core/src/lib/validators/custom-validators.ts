import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PreferredContactMethod, ExistingLenderEnum } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export class PortalValidators {
  static atLeastOneContact(array: FormArray) {
    return (field: AbstractControl): ValidationErrors | null => {
      const atLeastOneContact = array.controls.some(formGroup => {
        const value = formGroup.get('preferredContactMethod')?.value;

        return field && value && value !== PreferredContactMethod.NO_CONTACT;
      });

      array.controls.forEach(control => {
        control.updateValueAndValidity({ emitEvent: false });
      });

      return !atLeastOneContact ? { atLeastOneContact: true } : null;
    };
  }

  static ExistingLenderIsClient(): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      if (field.value === ExistingLenderEnum.APRIL_MORTGAGES) {
        return { aprilMortgagesError: true };
      }
      return null;
    };
  }
}
