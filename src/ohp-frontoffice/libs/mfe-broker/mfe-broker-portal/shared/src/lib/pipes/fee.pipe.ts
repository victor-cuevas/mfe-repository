import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fee',
})
export class FeePipe implements PipeTransform {
  transform(value?: string | null): string {
    return value ? value?.charAt(0).toUpperCase() + value?.slice(1) : '';
  }
}
