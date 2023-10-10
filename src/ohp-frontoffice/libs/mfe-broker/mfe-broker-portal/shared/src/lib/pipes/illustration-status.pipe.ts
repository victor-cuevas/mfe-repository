import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'illustrationStatus' })
export class IllustrationStatusPipe implements PipeTransform {
  transform(status: string): string {
    const classNames: { [key: string]: string } = {
      InProgress: 'pi pi-clock warning-text',
      Completed: 'pi pi-check-circle success-text',
    };

    return classNames[status];
  }
}
