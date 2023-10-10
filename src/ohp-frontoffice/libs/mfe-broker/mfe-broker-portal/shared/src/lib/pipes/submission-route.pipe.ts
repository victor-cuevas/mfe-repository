import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'submissionRoute' })
export class SubmissionRoutePipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) return '';
    const labels: { [key: string]: string } = {
      DirectlyAuthorized: 'Directly authorised',
      DirectlyAuthorised: 'Directly authorised',
      Network: 'Network',
      MortgageClub: 'Mortgage club',
    };

    return labels[value];
  }
}
