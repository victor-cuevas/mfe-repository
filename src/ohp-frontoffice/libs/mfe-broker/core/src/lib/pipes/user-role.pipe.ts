import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole',
})
export class UserRolePipe implements PipeTransform {
  constructor() {}

  transform(value?: string): string {
    if (!value) return '';
    const roles: { [key: string]: string } = {
      Advisor: 'Advisor',
      Assistant: 'Assistant',
      AssistantAndSupervisor: 'Assistant & supervisor',
      LenderAdvisorAdmin: 'Lender administrator',
      LenderAdvisorSupport: 'Lender support',
      LenderAdvisorViewer: 'Lender viewer',
      Supervisor: 'Supervisor',
      SupervisorAndAdvisor: 'Supervisor & advisor',
      SupervisorAndAssistant: 'Supervisor & assistant',
      Viewer: 'Viewer',
    };

    return roles[value];
  }
}
