import { Component, Input } from '@angular/core';
import { LoanStatus, RejectionReasonResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'close-front-office-fma-lender-policy-check-status',
  templateUrl: './fma-lender-policy-check-status.component.html',
})
export class FmaLenderPolicyCheckStatusComponent {
  statusEnum = LoanStatus;
  @Input() status!: string;
  @Input() rejectionReasons: RejectionReasonResponse[] = [];

  constructor(private translateService: TranslateService) {}

  getDescription(type: string) {
    const descriptions: { [key: string]: string } = {
      [this.statusEnum.Accepted]: this.translateService.instant('createFma.labels.acceptedDescription'),
      [this.statusEnum.Rejected]: this.translateService.instant('createFma.labels.declinedDescription'),
      [this.statusEnum.Referred]: this.translateService.instant('createFma.labels.referredDescription'),
      [this.statusEnum.Assessment]: this.translateService.instant('createFma.labels.waitingDescription'),
      [this.statusEnum.Documentation]: this.rejectionReasons?.length
        ? this.translateService.instant('createFma.labels.referredDescription')
        : this.translateService.instant('createFma.labels.acceptedDescription'),
    };

    return descriptions[type];
  }

  getStyle(type: string) {
    const headings: { [key: string]: string } = {
      [this.statusEnum.InProgress]: 'in-progress',
      [this.statusEnum.Accepted]: 'accepted',
      [this.statusEnum.Rejected]: 'rejected',
      [this.statusEnum.Referred]: 'referred',
      [this.statusEnum.Assessment]: 'waiting',
      [this.statusEnum.Documentation]: this.rejectionReasons?.length ? 'rejected' : 'accepted',
    };

    return headings[type]?.toLowerCase();
  }

  getStatusToDisplay(type: string) {
    const status: { [key: string]: string } = {
      [this.statusEnum.InProgress]: this.translateService.instant('createFma.labels.waiting'),
      [this.statusEnum.Accepted]: this.translateService.instant('createFma.labels.accepted'),
      [this.statusEnum.Rejected]: this.translateService.instant('createFma.labels.declined'),
      [this.statusEnum.Referred]: this.translateService.instant('createFma.labels.referred'),
      [this.statusEnum.Assessment]: this.translateService.instant('createFma.labels.waiting'),
      [this.statusEnum.Documentation]: this.rejectionReasons?.length
        ? this.translateService.instant('createFma.labels.referred')
        : this.translateService.instant('createFma.labels.accepted'),
    };

    return status[type];
  }
}
