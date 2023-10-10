import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multilineTooltip',
})
export class MultilineTooltipPipe implements PipeTransform {
  transform(value: string[]): string {
    if (!value || !Array.isArray(value)) throw new Error('Missing input string in MultilineTooltipPipe');
    if (value.length === 1) return value[0];
    else {
      const prepend = '- ';
      const divider = '\n - ';
      const formattedValue = value.join(divider);
      return `${prepend}${formattedValue}`;
    }
  }
}
