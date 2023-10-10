import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService, RoutePaths, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'dip-previous-employment',
  templateUrl: './previous-employment.component.html',
})
export class PreviousEmploymentComponent {
  readonly STEP_NAME = this.stepSetupService.previousEmployment.automationId;

  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  previousEmploymentForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private stepSetupService: StepSetupService,
  ) {
    this.caseId = this.route.snapshot.parent?.paramMap.get('caseid');
  }
}
