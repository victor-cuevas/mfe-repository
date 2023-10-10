import { Directive, Input } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[cfcFluidMinMaxValueValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinMaxValueValidatorDirective,
      multi: true,
    },
  ],
})
export class MinMaxValueValidatorDirective implements Validator {
  @Input() maxValue!: number;
  @Input() minValue!: number;
  @Input() formControlValue!: number;
  @Input() isAmountLimit!: boolean;
  @Input() isNumberLimit!: boolean;
  @Input() isDefaultValidation!: boolean;

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (this.isDefaultValidation) {
      let newstr !: string;
      if(control.value)
      {
      
        if(  typeof control?.value == 'string')
          newstr = control?.value?.replace(',', "");
      }
      

      if (control.value && (control.value == 0 || control.value == '0' || parseInt(newstr) <= 0) ) {
        return { invalidDefaultError: true };
      }
    }

    if (this.isAmountLimit) {
      this.formControlValue =
        typeof this.formControlValue == 'string'
          ? parseInt(this.formControlValue)
          : this.formControlValue;
      if ((this.minValue != null && control.value != null && this.formControlValue != null) && ((control.value && this.formControlValue) < this.minValue)) {
        return { minValueError: true };
      } else {
        if ((this.maxValue != null && control.value != null && this.formControlValue != null) && ((control.value && this.formControlValue) > this.maxValue)) {
          return { maxValueError: true };
        }
      }
    }

    if (this.isNumberLimit) {
      if (control.value && parseInt(control.value) < this.minValue) {
        return { minValueError: true };
      } else {
        if (control.value && parseInt(control.value) > this.maxValue) {
          return { maxValueError: true };
        }
      }
    }

    return null;
  }
}
