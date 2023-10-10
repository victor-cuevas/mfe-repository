import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeLoanPart } from '../models/fe-loan-part';
import { CaseSummaryService } from './case-summary.service';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

const AVERAGE_DAYS_IN_YEAR = 365.242199;
const AVERAGE_DAYS_IN_MONTH = 30.43685;

@Injectable({
  providedIn: 'root',
})
export class MortgageTermService {
  readonly CONFIGURATION = CONFIGURATION_MOCK;
  private _highestMortgageTerm = new BehaviorSubject<number>(0);
  private _maxMortgageTerm = new BehaviorSubject<number>(0);

  set highestMortgageTerm(value) {
    this._highestMortgageTerm.next(value);
  }

  get highestMortgageTerm() {
    return this._highestMortgageTerm.getValue();
  }

  set maxMortgageTerm(value: number) {
    this._maxMortgageTerm.next(value);
  }

  get maxMortgageTerm() {
    return this._maxMortgageTerm.getValue();
  }

  readonly highestMortgageTerm$ = this._highestMortgageTerm.asObservable();

  constructor(private caseSummaryService: CaseSummaryService) {}

  private calculateMaxMortgageTerm(dateOfBirth: string): number {
    function addYears(date: Date, years: number): Date {
      date.setFullYear(date.getFullYear() + years);
      return date;
    }
    function subtractDays(date: Date, days: number): Date {
      date.setDate(date.getDate() - days);
      return date;
    }
    function daysDiff(d1: Date, d2: Date) {
      return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    }

    const DOB = new Date(dateOfBirth);
    const maxAgeDate = addYears(DOB, this.CONFIGURATION.AGE.END_OF_TERM_AGE);
    const maxAgeDateExtensions = subtractDays(
      maxAgeDate,
      this.CONFIGURATION.CASE_DURATION_ASSUMED + this.CONFIGURATION.CASE_DURATION_EXTENSION,
    );
    const today = new Date();
    const maxMortgageTermTotalDays = daysDiff(today, maxAgeDateExtensions);
    const maxMortgageTermYears = Math.floor(maxMortgageTermTotalDays / AVERAGE_DAYS_IN_YEAR);
    const maxMortgageTermMonths = Math.floor((maxMortgageTermTotalDays % AVERAGE_DAYS_IN_YEAR) / AVERAGE_DAYS_IN_MONTH);

    return maxMortgageTermYears * 12 + maxMortgageTermMonths;
  }

  public setMaxMortgageTerm(datOfBirth: string | null | undefined): void {
    if (!datOfBirth) return;

    const maxMortgageTerm = this.calculateMaxMortgageTerm(datOfBirth);

    if ((this.maxMortgageTerm === 0 && maxMortgageTerm > 0) || (maxMortgageTerm > 0 && maxMortgageTerm < this.maxMortgageTerm)) {
      this.maxMortgageTerm = maxMortgageTerm;
    }
  }

  public updateHighestMortgageTerm(loanParts: FeLoanPart[]) {
    if (loanParts.length) {
      const highestMortgageTerm: number = loanParts
        .filter(loanPart => loanPart.mortgageTerm && loanPart.mortgageTerm > 0)
        .map(loanPart => loanPart.mortgageTerm as number)
        .reduce((a: number, b: number) => Math.max(a, b), 0);

      this._highestMortgageTerm.next(highestMortgageTerm);
    }
  }

  public updateMortgageTermTotal(formGroup: FormGroup): void {
    const feMortgageTerm = formGroup?.get('feMortgageTerm');

    formGroup
      ?.get('mortgageTerm')
      ?.setValue(this.getMortgageTermTotalMonths(feMortgageTerm?.get('years')?.value, feMortgageTerm?.get('months')?.value));

    formGroup.get('mortgageTerm')?.markAsTouched();
  }

  public getMortgageTermTotalMonths(years?: number | null, months?: number | null) {
    years = years ? years : 0;
    months = months ? months : 0;
    return years * 12 + months;
  }

  public getMortgageTermMonthsAndYears(totalMonths?: number | null): { years: number | null; months: number | null } {
    let years;
    let months;

    if (totalMonths) {
      years = Math.floor(totalMonths / 12);
      months = totalMonths % 12;
    } else {
      years = null;
      months = null;
    }

    return { years, months };
  }

  public setMortgageTermValidators(value: number, formGroup: FormGroup, isYears?: boolean) {
    const oppositeCtrl = isYears ? 'months' : 'years';

    value
      ? formGroup.get('feMortgageTerm')?.get(oppositeCtrl)?.clearValidators()
      : formGroup.get('feMortgageTerm')?.get(oppositeCtrl)?.setValidators([Validators.required]);

    formGroup.get('feMortgageTerm')?.get(oppositeCtrl)?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }

  public checkProductAvailability(loanPartControl: AbstractControl, appId: number, loanId: number) {
    if (
      appId &&
      loanId &&
      loanPartControl.get('loanPartAmount')?.valid &&
      loanPartControl.get('mortgageTerm')?.valid &&
      loanPartControl.get('loanPartId')?.value &&
      loanPartControl.get('product')?.value?.code
    ) {
      const mortgageTerm = loanPartControl.get('feMortgageTerm');
      const mortgageTermYears = mortgageTerm?.get('years')?.value;
      const mortgageTermMonths = mortgageTerm?.get('months')?.value;
      const loanPartId = loanPartControl.get('loanPartId')?.value;
      const productCode = loanPartControl.get('product')?.value?.code;

      this.caseSummaryService.checkProductAvailability(appId, loanId, loanPartId, mortgageTermYears, mortgageTermMonths, productCode);
    }
  }
}
