import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userPermission',
})
export class UserPermissionPipe implements PipeTransform {
  permissions: { [key: string]: string } = {
    View: 'View',
    Illustration: 'Create illustration',
    DecisionInPrinciple: 'Decision in principle',
    FullMortgageApplication: 'Full mortgage application',
  };

  transform(value?: string): string {
    return value ? this.permissions[value] : '';
  }
}
