import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialPipe implements PipeTransform {
  constructor() {}

  transform(value: any): string {
    if (value?.firstName && value?.lastName) {
      return value.firstName.charAt(0).toUpperCase() + value.lastName.charAt(0).toUpperCase();
    } else if (value?.firstName && !value?.lastName) {
      return value.firstName.charAt(0).toUpperCase();
    } else if (!value?.firstName && value?.lastName) {
      return value.lastName.charAt(0).toUpperCase();
    } else {
      return '';
    }
  }
}
