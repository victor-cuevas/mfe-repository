import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusIcon',
})
export class StatusIconPipe implements PipeTransform {
  constructor() {}

  transform(status: string | null | undefined): string | null {
    if (!status) return null;

    const iconClasses: { [key: string]: string } = {
      accepted: 'pi-check',
      completed: 'pi-check',
      rejected: 'pi-times',
      assessment: 'pi-clock',
      waiting: 'pi-clock',
    };
    return iconClasses[status.toLowerCase()];
  }
}
