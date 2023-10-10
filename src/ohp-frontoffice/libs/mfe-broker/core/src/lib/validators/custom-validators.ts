import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static valueIs(value: any): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      if (Array.isArray(value) && !value.includes(field.value)) {
        return { valueIs: true };
      } else if (!Array.isArray(value) && field.value !== value) {
        return { valueIs: true };
      }
      return null;
    };
  }
  static valueIsNot(value: any): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      if (Array.isArray(value) && value.includes(field.value)) {
        return { valueIsNot: true };
      } else if (!Array.isArray(value) && field.value === value) {
        return { valueIsNot: true };
      }
      return null;
    };
  }

  static checkAge(minYear: number, maxYear: number): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      const birthday = new Date(field.value);
      const dateMinYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - minYear));
      const dateMaxYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - maxYear));
      if (birthday > dateMinYearsAgo || birthday < dateMaxYearsAgo) {
        return { checkAge: true };
      }
      return null;
    };
  }

  static maxApplicantAge(max: number): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      if (field.value > 480) return { max40years: true };
      if (field.value > max) return { maxApplicantAge: true };
      return null;
    };
  }
  static selectedValueIsActive(options: any[]): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      const selectedOption = options.find(option => option.value === field.value);

      if (selectedOption?.disabled) return { selectedIsDisabled: true };
      return null;
    };
  }
}
