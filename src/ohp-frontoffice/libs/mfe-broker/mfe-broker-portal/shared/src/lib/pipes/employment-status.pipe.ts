import { Pipe, PipeTransform } from '@angular/core';
import { EmploymentStatusOptions } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { EmploymentStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Pipe({
  name: 'employmentStatus',
})
export class EmploymentStatusPipe implements PipeTransform {
  transform(value: EmploymentStatus | null | undefined): string | null {
    if (!value) return null;
    const mappedEmploymentStatus = EmploymentStatusOptions.filter(item => item.value === value).map(item => item.label);

    return mappedEmploymentStatus.length ? mappedEmploymentStatus[0] : null;
  }
}
