import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoutePaths, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'dip-repayment-strategy',
  templateUrl: './repayment-strategy.component.html',
})
export class RepaymentStrategyComponent {
  readonly STEP_NAME = this.stepSetupService.repaymentStrategy.automationId;

  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  repaymentStrategyForm = this.fb.group({});

  constructor(private fb: FormBuilder, private stepSetupService: StepSetupService) {}
}
