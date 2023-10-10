import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'submissionRoute',
})
export class SubmissionRoutePipe implements PipeTransform {
  constructor() {}

  transform(value?: string): string {
    if (!value) return '';
    const submissionRoutes: { [key: string]: string } = {
      Network: 'Network',
      MortgageClub: 'Mortgage club',
      DirectlyAuthorized: 'Directly authorized',
    };

    return submissionRoutes[value];
  }
}
