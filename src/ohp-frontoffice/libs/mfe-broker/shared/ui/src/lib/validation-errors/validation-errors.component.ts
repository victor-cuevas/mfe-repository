import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'cfo-validation-errors',
  templateUrl: './validation-errors.component.html',
})
export class ValidationErrorsComponent {
  @Input() control!: AbstractControl | null;
  @Input() errorMessages?: {
    [key: string]: string;
  } = {};
  @Input() class?: string | string[] = '';
  constructor() {}
}
