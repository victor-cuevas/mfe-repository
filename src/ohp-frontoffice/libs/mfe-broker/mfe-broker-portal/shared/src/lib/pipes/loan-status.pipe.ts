import { Pipe, PipeTransform } from '@angular/core';
import { LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Pipe({
  name: 'loanStatus',
})
export class LoanStatusPipe implements PipeTransform {
  transform(inputValue?: string | null): string {
    if (!inputValue || inputValue === LoanStatus.Undefined) return '';
    return `(${inputValue.slice(0, 1).toUpperCase() + inputValue.replace('_', ' ').slice(1, inputValue.length).toLowerCase()})`;
  }
}
