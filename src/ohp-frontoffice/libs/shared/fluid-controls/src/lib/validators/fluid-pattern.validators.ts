import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

export function patternValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const patternValue = nameRe.test(control.value);
    return patternValue ? null : { patterninvalid: true };
  };
}

@Directive({
  selector: '[cfcFluidPatternValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FluidPatternValidatorDirective,
      multi: true,
    },
  ],
})
export class FluidPatternValidatorDirective {
  @Input() cfcFluidPatternValidator: any;
  validate(control: AbstractControl): { [key: string]: any } | null  {
    if (this.cfcFluidPatternValidator.Required) {
      return control.value
        ? patternValidator(this.cfcFluidPatternValidator.Regex)(control)
        : null;
    } else {
        return null;;
    }
  }
  
}
