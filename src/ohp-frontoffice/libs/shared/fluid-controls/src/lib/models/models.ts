import { ElementRef } from '@angular/core';

export class ErrorDto {
  validation!: string;
  validationMessage!: string;
  isModelError!: boolean;
  isShowValidation!: boolean;
  specificIndex!: string;
}

export class KeyValuePairDto {

  constructor(_label: any, _value: any) {
    this.label = _label;
    this.value = _value;
  }

  label: any;
  value: any;
}

export class StackedBarChartDto {
  type!: string;
  label!: string;
  backgroundColor!: string;
  data!: Array<number>;
}

export class ValidationErrorDto {
  constructor(public ErrorMessage: string | undefined, public IsBusinessError: boolean, public Validator?: string, public Element?: ElementRef) {
  }
}


