import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fluidFormatIBANPipe',
})
export class FluidFormatIBANPipe implements PipeTransform {
  formatted = '';

  transform(value: string, args?: any): any {
    if (this.isEmptyOrWhiteSpace(value) || value.length <= 4) {
      return value;
    }
    this.formatted = ' ';
    value = value.replace(/\s/g, '');
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        this.formatted += '  ';
      }
      this.formatted += value[i];
    }
    return this.formatted.toString().toUpperCase();
  }
  transformback(value: string, args?: any): any {
    return value.replace(/\s/g, '');
  }

  isEmptyOrWhiteSpace(value: any) {
    return this.isEmpty(value) || this.isEmpty(value.toString().trim());
  }

  isEmpty(value: any) {
    return value === undefined || value === '' || value === null;
  }
}
