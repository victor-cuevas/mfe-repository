import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mbp-applicants-dialog',
  templateUrl: './applicants-dialog.component.html',
})
export class ApplicantsDialogComponent {
  constructor(public config: DynamicDialogConfig, private ref: DynamicDialogRef) {}

  closeOverlay() {
    this.ref.close();
  }
}
