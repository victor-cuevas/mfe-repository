import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'earlyRepaymentCharge',
})
export class EarlyRepaymentChargePipe implements PipeTransform {
  constructor() {}

  transform(value: string): string {
    const split = value.split(':');
    split.map(el => el.trim());

    return `${split[0]} months - ${split[1]}%`;
  }
}
