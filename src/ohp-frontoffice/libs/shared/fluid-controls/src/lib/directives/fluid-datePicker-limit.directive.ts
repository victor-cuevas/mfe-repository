import { Directive, Input } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  
  selector: '[cfcFluidDatePickerLimitValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FluidDatePickerLimitValidator,
      multi: true,
    },
  ],
})
export class FluidDatePickerLimitValidator implements Validator {
  @Input() maxDateLimit!: Date;
  @Input() minDateLimit!: Date;
  @Input() formControlValue!: Date;

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value < this.minDateLimit) {
      return { minDateError: true };
    } else {
      if (control.value > this.maxDateLimit) {
        return { maxDateError: true };
      }
    }
    return null;
  }
}
