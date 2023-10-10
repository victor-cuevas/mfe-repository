import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AffordabilityCheckResponse, DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'dip-confirm-dip',
  templateUrl: './confirm-dip.component.html',
})
export class ConfirmDipComponent implements OnInit {
  readonly STEP_NAME = this.stepSetupService.confirmDip.automationId;

  private appId = this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId;
  private loanId = this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId;

  public currentData: AffordabilityCheckResponse = this.route.snapshot.data?.dipData || {};

  get isAffordable() {
    return (this.currentData.affordabilityRatio && this.currentData.affordabilityRatio < 1) || false;
  }

  constructor(
    public route: ActivatedRoute,
    public stepSetupService: StepSetupService,
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: SpinnerService,
    private dipService: DIPService,
    public dataService: DataService,
  ) {}

  dipForm = this.fb.group({
    dataConsent: [null, Validators.requiredTrue],
  });

  ngOnInit() {
    this.dipForm.valueChanges.subscribe(() => this.dataService.setFormStatus(this.dipForm.status, this.STEP_NAME));
  }

  submitDip() {
    this.spinnerService.setIsLoading(true);
    this.dipService
      .dIPSubmitLoanStage(
        this.route.snapshot.parent?.data.dipJourney?.dipData?.applicationDraftId,
        this.route.snapshot.parent?.data.dipJourney?.dipData?.loanId,
      )
      .pipe(take(1))
      .subscribe(
        () => {
          this.router.navigate(['../../'], { relativeTo: this.route }).then(() => this.spinnerService.setIsLoading(false));
        },
        () => {
          this.spinnerService.setIsLoading(false);
        },
      );
  }

  checkActiveJourney() {}
}
