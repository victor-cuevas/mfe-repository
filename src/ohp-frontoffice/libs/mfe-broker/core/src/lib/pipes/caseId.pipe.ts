import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftPad',
})
export class LeftPad implements PipeTransform {
  transform(item: number): string {
    return (String('0').repeat(8) + item).substr(8 * -1, 8);
  }
}
