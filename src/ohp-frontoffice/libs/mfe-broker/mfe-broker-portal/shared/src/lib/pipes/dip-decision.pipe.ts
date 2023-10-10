import { Pipe, PipeTransform } from '@angular/core';
import { LoanStage } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Pipe({
  name: 'dipDecision',
})
export class DipDecisionPipe implements PipeTransform {
  constructor() {}

  transform(stage: string | undefined | null, status: string | undefined | null): string | null {
    if (!stage || !status) return null;

    const decisions: { [key: string]: string | null } = {
      accepted: 'Accept',
      active: 'Pending',
      assessment: 'Pending',
      cancelled: 'Cancelled',
      completed: 'Accept',
      inProgress: 'Pending',
      promoting: 'Accepted',
      referred: 'Referred',
      rejected: 'Rejected',
      submitted: 'Pending',
      undefined: 'Pending',
    };

    if (stage === LoanStage.Fma) {
      return decisions['accepted'];
    }
    if (stage === LoanStage.Dip && status) {
      return decisions[status?.toLowerCase()];
    }
    return null;
  }
}
