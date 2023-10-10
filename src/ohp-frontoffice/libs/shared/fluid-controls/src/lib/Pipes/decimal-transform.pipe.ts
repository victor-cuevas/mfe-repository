import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { IOptions } from '../directives/fluid-currency-mask.directive';

@Pipe({
  name: 'decimalTransform'
})


export class DecimalTransformPipe implements PipeTransform {
  private _options!: IOptions;

  constructor(private decimalPipe: DecimalPipe) {

    this.options = (<Partial<IOptions>>{
      prefix: '',
      thousands: '.',
      decimal: ',',
      allowNegative: false,
      nullable: false,
      IspropertyNullable: false,
      canRoundOff: true,
    }) as IOptions;

    this.setDefaultOptions()
  }
  DEFAULT_VALUE = '0';
   EMPTY_STRING = '';
   DOT = '.';
  MINUS = '-';

  private setDefaultOptions(): void {
    if (!this.options) {
      this.options = <any>{};
    }
    if (this.options.maxLength === undefined || this.options.maxLength === 0) {
      this.options.maxLength = 15;
    }
    if (!this.options.prefix) {
      this.options.prefix = '';
    }
    if (!this.options.decimal) {
      this.options.decimal = ',';
    }
    if (!this.options.precision && this.options.precision !== 0) {
      this.options.precision = 2;
    }
    if (!this.options.thousands) {
      this.options.thousands = this.DOT;
    }
    if (this.options.allowNegative === undefined) {
      this.options.allowNegative = false;
    }
    if (this.options.nullable === undefined) {
      this.options.nullable = false;
    }
  }

  set options(value: IOptions) {
    if (
      value &&
      value.decimal &&
      value.thousands &&
      value.decimal === value.thousands
    ) {
      throw new Error(
        `The options decimal => '${this.options.decimal}' and  thousands => '${this.options.thousands}' should not be same.`
      );
    }
    this._options = value;
  }
  get options(): IOptions {
    return this._options;
  }
  transform(value: number|string, ...args: unknown[]): unknown {
    if (
      value &&
      value.toString().trim().length === 1 &&
      value.toString().trim() == this.MINUS
    ) {
      return value.toString();
    }
    if (this.options.decimal === this.options.thousands) {
      throw new Error(
        `The options decimal => '${this.options.decimal}' and  thousands => '${this.options.thousands}' should not be same.`
      );
    }
    const digitsFormat = `1.${this.options.precision}-${this.options.precision}`;
    let transformedValue: string | undefined = this.IsEmptyOrWhiteSpace(value)
      ? this.options.nullable
        ? undefined
        : this.DEFAULT_VALUE
      : value
        .toString()
        .replace(this.options.decimal, this.DOT)
        .replace(/\s/g, this.EMPTY_STRING);
    if (
      !(
        (transformedValue === undefined || transformedValue === null) &&
        this.options.nullable
      )
    ) {
      transformedValue =
        this.IsEmptyOrWhiteSpace(transformedValue) || transformedValue ===this.DOT
        ? this. DEFAULT_VALUE
          : this.decimalPipe
            .transform(transformedValue, digitsFormat, 'fr')?.trim()
            .replace(',', this.options.decimal)
            .replace(/\s/g, this.options.thousands);
    }
    if (
      !(transformedValue === undefined || transformedValue === null) &&
      !this.options.allowNegative &&
      transformedValue !== this.DEFAULT_VALUE &&
      transformedValue.indexOf(this.MINUS) !== -1
    ) {
      transformedValue = transformedValue.replace(this.MINUS, this.EMPTY_STRING);
    }

    return (transformedValue == undefined) ? '' : transformedValue;
  }
  IsEmpty(value: any) {
    return value === undefined || value === '' || value === null;
  }
  IsEmptyOrWhiteSpace(value: any) {
    return this.IsEmpty(value) || this.IsEmpty(value.toString().trim());
  }
}
