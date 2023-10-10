import { Component } from '@angular/core';
import { DataService, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'close-front-office-fma-confirm',
  templateUrl: './fma-confirm.component.html',
})
export class FmaConfirmComponent {
  STEP_NAME = this.stepSetupService.confirmFma.automationId;

  constructor(public stepSetupService: StepSetupService, private dataService: DataService) {
    this.dataService.setFormStatus('VALID', this.STEP_NAME);
  }
}
