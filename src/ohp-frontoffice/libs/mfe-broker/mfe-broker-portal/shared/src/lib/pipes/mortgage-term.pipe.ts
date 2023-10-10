import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mortgageTermPipe' })
export class MortgageTermPipe implements PipeTransform {
  transform(value?: number | null): string {
    if (!value) return '';
    const years = Math.floor(value / 12);
    const months = value % 12;

    return `${years} ${years > 1 ? 'years' : 'year'} ${months ? `- ${months} ${months > 1 ? 'months' : 'month'}` : ''}`;
  }
}
