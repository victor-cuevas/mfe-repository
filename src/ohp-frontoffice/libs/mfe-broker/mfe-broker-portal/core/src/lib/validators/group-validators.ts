import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EmploymentStatus, ConstructionType, EmploymentContractType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

export class GroupValidators {
  static currentIncomeValidationGroupTwo(employmentStatus: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (group.get(employmentStatus)?.value === EmploymentStatus.Employed) {
        if (group.get('contractType')?.value === EmploymentContractType.ZERO_HOUR_CONTRACT) {
          group.get('last3MonthsIncome')?.setValidators(Validators.required);
          group.get('last6MonthsIncome')?.setValidators(Validators.required);
          group.get('last12MonthsIncome')?.setValidators(Validators.required);
          group.get('hourlyRate')?.setValidators(Validators.required);
          group.get('hoursPerWeek')?.setValidators(Validators.required);
          group.get('last3MonthsIncome')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('last6MonthsIncome')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('last12MonthsIncome')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('hourlyRate')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('hoursPerWeek')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        }
      }

      return null;
    };
  }

  static currentIncomeValidationGroupThree(employmentStatus: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (
        group.get(employmentStatus)?.value === EmploymentStatus.SelfEmployedPartnership ||
        group.get(employmentStatus)?.value === EmploymentStatus.SelfEmployed ||
        group.get(employmentStatus)?.value === EmploymentStatus.Director25Plus
      ) {
        group.get('annualDrawingsCurYear')?.setValidators(Validators.required);
        group.get('projectedNetProfitCurYear')?.setValidators(Validators.required);
        group.get('projectedGrossProfitCurYear')?.setValidators(Validators.required);
        group.get('annualDrawings1Year')?.setValidators(Validators.required);
        group.get('projectedNetProfit1Year')?.setValidators(Validators.required);
        group.get('projectedGrossProfit1Year')?.setValidators(Validators.required);
        group.get('annualDrawings2Year')?.setValidators(Validators.required);
        group.get('projectedNetProfit2Year')?.setValidators(Validators.required);
        group.get('projectedGrossProfit2Year')?.setValidators(Validators.required);

        if (group.get(employmentStatus)?.value === EmploymentStatus.Director25Plus) {
          group.get('projectedDividendCurYear')?.setValidators(Validators.required);
          group.get('projectedDividend1Year')?.setValidators(Validators.required);
          group.get('projectedDividend2Year')?.setValidators(Validators.required);
          group.get('projectedDividendCurYear')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('projectedDividend1Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('projectedDividend2Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        }

        group.get('annualDrawingsCurYear')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('projectedNetProfitCurYear')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('projectedGrossProfitCurYear')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('annualDrawings1Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('projectedNetProfit1Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('projectedGrossProfit1Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('annualDrawings2Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('projectedNetProfit2Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        group.get('projectedGrossProfit2Year')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        if (CONFIGURATION_MOCK.REQUEST_ENDING_DATE) {
          group.get('yearEndingCurYearMonth')?.setValidators(Validators.required);
          group.get('yearEndingCurYearYear')?.setValidators(Validators.required);
          group.get('yearEndingCurYearMonth')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
          group.get('yearEndingCurYearYear')?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        }
      }
      return null;
    };
  }

  static checkStandardConstructionAndYearBuilt(standardConstruction: string, yearBuilt: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const standardConstructionControl = group.get(standardConstruction) as AbstractControl;
      const yearBuildValueControl = group.get(yearBuilt);
      const otherErrors = this.getOtherErrors(standardConstructionControl, 'notAcceptable');
      if (standardConstructionControl?.value === ConstructionType.STEEL_FRAMED && yearBuildValueControl?.value < 2000) {
        standardConstructionControl.setErrors({ notAcceptable: true });
        standardConstructionControl.markAsTouched();
        return { notAcceptable: true };
      } else {
        standardConstructionControl?.setErrors(otherErrors);
      }
      return null;
    };
  }

  static timeInterval(year: string, month: string, min: number, max: number, addValidationOnGroup?: boolean): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const yearControl = group.get(year) as AbstractControl;
      const monthControl = group.get(month) as AbstractControl;
      const otherErrorsYear = this.getOtherErrors(yearControl, 'outOfRange');
      const otherErrorMonth = this.getOtherErrors(monthControl, 'outOfRange');
      if (yearControl.value === max && monthControl.value > min) {
        if (!addValidationOnGroup) {
          monthControl.setErrors({ outOfRange: true });
          yearControl.setErrors({ outOfRange: true });
        }
        return { outOfRange: true };
      } else {
        monthControl.setErrors(otherErrorMonth);
        yearControl.setErrors(otherErrorsYear);
      }
      return null;
    };
  }

  private static getOtherErrors(field: AbstractControl, errorToIgnore: string) {
    let otherErrors: any = null;

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
}
