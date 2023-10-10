import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AffordabilityCheckResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbp-affordability-check',
  templateUrl: './affordability-check.component.html',
})
export class AffordabilityCheckComponent implements OnInit {
  readonly STEP_NAME = this.stepSetupService.affordabilityCheck.automationId;

  @Input() affordabilityData!: AffordabilityCheckResponse;
  @Input() isAffordable!: boolean;
  @Input() isInDipJourney = false;
  duration = 0;
  termYears = 0;
  termMonths = 0;

  affordabilityCheckForm: FormGroup = this.fb.group({
    affordabilityRatio: [0, Validators.compose([Validators.min(0.0001), Validators.max(1.0)])],
    additionalInformation: '',
  });

  constructor(private fb: FormBuilder, private stepSetupService: StepSetupService) {}

  ngOnInit(): void {
    this.duration = this.affordabilityData?.duration || 0;
    this.termYears = Math.trunc(this.duration / 12) || 0;
    this.termMonths = this.duration % 12 || 0;
    this.affordabilityCheckForm.get('affordabilityRatio')?.setValue(this.affordabilityData.affordabilityRatio);
  }
}
