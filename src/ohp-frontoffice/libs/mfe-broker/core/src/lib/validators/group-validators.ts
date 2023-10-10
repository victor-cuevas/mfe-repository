import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { PropertyType, TenureType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export enum AddressTypeEnum {
  UK = 'UK',
  BFPO = 'BFPO',
  OVERSEAS = 'OVERSEAS',
}

export class GroupValidators {
  static MS_IN_A_YEAR = 31536000000;

  static atLeastOneField(names: string[]): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      return this.checkAtLeastOneField(names, group);
    };
  }

  static checkMortgageTermAge(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (group.get('isAgeTooHigh')?.value && (group.get('months')?.value || group.get('years')?.value)) {
        return {
          checkMortgageTermAge: true,
        };
      }
      return null;
    };
  }

  static addressValidation(
    getShowAutosuggest: () => boolean,
    getAddressType: () => string,
    getHasNoValidation: () => boolean,
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const autosuggestControl = group.get('selectedAddressControl');
      const addressOneControl = group.get('lineOne');
      const postcodeControl = group.get('postcode');
      const countryControl = group.get('country');
      const cityControl = group.get('city');
      const isAutosuggestActive = getShowAutosuggest();
      const hasNoValidation = getHasNoValidation();
      const addressType = getAddressType();
      const postCodePattern = addressType === AddressTypeEnum.OVERSEAS ? /.*/ : /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2}$/;

      if (!isAutosuggestActive) {
        autosuggestControl?.setValidators(null);
        addressOneControl?.setValidators(Validators.required);
        countryControl?.setValidators(Validators.required);
        postcodeControl?.setValidators([Validators.required, Validators.pattern(postCodePattern)]);
        addressType === AddressTypeEnum.OVERSEAS ? cityControl?.setValidators(Validators.required) : cityControl?.setValidators(null);
        autosuggestControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });

        if (postcodeControl && postcodeControl.errors && postcodeControl.errors.pattern) {
          postcodeControl?.markAsTouched();
        }
      } else {
        autosuggestControl?.setValidators(Validators.required);
        addressOneControl?.setValidators(null);
        countryControl?.setValidators(null);
        postcodeControl?.setValidators(null);
        cityControl?.setValidators(null);

        if (autosuggestControl && autosuggestControl.value) {
          if (autosuggestControl.value.text) {
            return null;
          }
        }
      }
      if (hasNoValidation) {
        autosuggestControl?.setValidators(null);
        autosuggestControl?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
      }
      return null;
    };
  }

  static loanAmountMaxValue(purchase: string, loanAmount: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const purchaseControl = group.get(purchase) as AbstractControl;
      const loanAmountControl = group.get(loanAmount) as AbstractControl;
      const otherErrors = this.getOtherErrors(loanAmountControl, 'maxLoanAmount');
      if (loanAmountControl?.errors && !loanAmountControl?.errors?.required && loanAmountControl?.pristine) {
        loanAmountControl?.markAsTouched();
      }
      if (loanAmountControl?.value && purchaseControl?.value && loanAmountControl?.value > purchaseControl?.value) {
        loanAmountControl?.setErrors({
          ...(otherErrors ?? {}),
          maxLoanAmount: true,
        });
        return {
          maxLoanAmount: true,
        };
      }
      loanAmountControl?.setErrors(otherErrors);
      return null;
    };
  }

  static checkYearsAmount(years: number, dateControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const array = group as FormArray;
      const lastItem = array.at(array.length - 1) as FormGroup;
      if (lastItem) {
        const lastDate = lastItem.get(dateControlName)?.value;
        const lastDateTime = new Date(lastDate).getTime();
        const neededDate = new Date(new Date().getTime() - GroupValidators.MS_IN_A_YEAR * years).getTime();
        if (lastDateTime > neededDate) {
          return { insuficientYears: true };
        }
      }

      return null;
    };
  }

  static checkOrderedDates(dateControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const array = group as FormArray;
      const lastItem = array.at(array.length - 1) as FormGroup;
      if (lastItem) {
        const secondToLastItem = array.at(array.length - 2) as FormGroup;
        if (secondToLastItem) {
          const lastDate = lastItem.get(dateControlName)?.value;
          const secondToLastDate = secondToLastItem.get(dateControlName)?.value;
          if (lastDate && secondToLastDate) {
            const lastTime = new Date(lastDate).getTime();
            const secondToLastTime = new Date(secondToLastDate).getTime();
            if (lastTime > secondToLastTime) {
              lastItem.get(dateControlName)?.setErrors({ unorderedDates: true });
              lastItem.get(dateControlName)?.markAsTouched();
              return { unorderedDates: true };
            } else {
              lastItem.get(dateControlName)?.setErrors(null);
            }
          }
        }
      }
      return null;
    };
  }

  static tenureValidator() {
    return (form: FormGroup) => {
      const otherError = this.getOtherErrors(form.get('tenure') as AbstractControl, 'tenure');
      const error =
        form.get('tenure')?.value === TenureType.FREEHOLD && form.get('propertyType')?.value === PropertyType.FLAT_APARTMENT
          ? { tenure: true }
          : form.get('tenure')?.setErrors(otherError);
      error ? form.get('tenure')?.setErrors(error) : null;
    };
  }

  static checkOneFieldGreaterThan(fieldOneName: string, fieldTwoName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fieldOne = group.get(fieldOneName) as AbstractControl;
      const fieldTwo = group.get(fieldTwoName) as AbstractControl;
      const otherErrors = this.getOtherErrors(fieldOne, 'valueIsGreaterThan');
      if (fieldTwo.value < fieldOne.value) {
        fieldOne.setErrors({ valueIsGreaterThan: true });
        return { valueIsGreaterThan: true };
      } else {
        fieldOne.setErrors(otherErrors);
        return null;
      }
    };
  }

  private static getOtherErrors(field: AbstractControl, errorToIgnore: string) {
    let otherErrors: ValidationErrors | null = null;

    if (field?.errors) {
      Object.keys(field?.errors).filter(value => {
        if (value !== errorToIgnore && field?.errors) {
          if (!otherErrors) {
            otherErrors = {};
          }
          otherErrors[value] = field?.errors[value];
        }
      });
    }
    return otherErrors;
  }

  private static checkAtLeastOneField(names: string[], group: AbstractControl) {
    const controls = names.map(name => group.get(name));
    if (controls.length) {
      const valueFound = controls.findIndex(control => control && control.value);
      if (valueFound === -1) {
        return {
          atLeastOneField: true,
        };
      }
    }
    return null;
  }
}
