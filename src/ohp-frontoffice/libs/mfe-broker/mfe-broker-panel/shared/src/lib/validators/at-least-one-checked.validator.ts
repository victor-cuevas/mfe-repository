import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export function atLeastOneChecked(fieldName?: string): ValidatorFn {
  return (control: AbstractControl) => {
    const controlArray = control as FormArray;
    if (controlArray.controls.some(el => (fieldName ? el.value[fieldName] : el.value))) {
      return null;
    } else {
      return {
        atLeastOneChecked: { valid: false },
      };
    }
  };
}

export function isAllChecked(fieldName?: string): ValidatorFn {
  return (control: AbstractControl) => {
    const controlArray = control as FormArray;
    if (controlArray.controls.every(el => (fieldName ? el.value[fieldName] : el.value))) {
      return null;
    } else {
      return {
        atLeastOneChecked: { valid: false },
      };
    }
  };
}
