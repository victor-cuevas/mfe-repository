import { Pipe, PipeTransform } from '@angular/core';
import { UploadStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

type UploadOutcome = 'pending' | 'success' | 'rejected' | 'required' | 'cancelled';

@Pipe({
  name: 'uploadStatus',
})
export class UploadStatusPipe implements PipeTransform {
  statuses: Record<UploadStatus, { label: string; className: `upload-${UploadOutcome}` }> = {
    ANALYZED: { label: 'Manual review pending', className: 'upload-pending' },
    APPROVED: { label: 'Verified', className: 'upload-success' },
    CANCELLED: { label: 'Cancelled', className: 'upload-cancelled' },
    CLASSIFICATION_AMBIGUOUS: { label: 'Pending', className: 'upload-pending' },
    CONSISTENCY_REJECTED: { label: 'Manual review pending', className: 'upload-pending' },
    DEFERRED: { label: 'On hold', className: 'upload-cancelled' },
    ERROR: { label: 'Manual review pending', className: 'upload-pending' },
    MISCLASSIFIED: { label: 'Manual review pending', className: 'upload-pending' },
    POLICY_APPROVED: { label: 'Manual review pending', className: 'upload-pending' },
    POLICY_REJECTED: { label: 'Manual review pending', className: 'upload-pending' },
    PROVISIONALLY_APPROVED: { label: 'Provisionally approved', className: 'upload-pending' },
    RECEIVED: { label: 'Received', className: 'upload-success' },
    TO_BE_ANALYZED: { label: 'Manual review pending', className: 'upload-pending' },
    TO_BE_CORRECTED: { label: 'Manual review pending', className: 'upload-pending' },
    TO_BE_RECEIVED: { label: 'Upload required', className: 'upload-required' },
    TO_BE_REPLACED: { label: 'Replacement document required', className: 'upload-rejected' },
    UNKNOWN: { label: 'Manual review pending', className: 'upload-pending' },
    VALID: { label: 'Manual review pending', className: 'upload-pending' },
  };

  transform(value?: UploadStatus | null, className = false): string {
    if (!value || !(value in UploadStatus)) return '';

    return className ? this.statuses[value].className : this.statuses[value].label;
  }
}
