//Angular imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//PrimeNg imports
//Local imports
import {
  DataService,
  getPortalUser,
  getProductSelection,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AuthorizationContextModel, IllustrationSummary, Journey } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'mbp-review-step',
  templateUrl: './review-step.component.html',
})
export class ReviewStepComponent implements OnInit {
  readonly STEP_NAME = this.stepSetupService.confirm.automationId;

  routePaths: typeof RoutePaths = RoutePaths;
  loanId = this.route.snapshot.data.illustrationJourney.illustrationData.loanId;
  applicationDraftId = this.route.snapshot.data.illustrationJourney.illustrationData.applicationDraftId;
  illustrationSummaries = this.route.parent?.snapshot.data.summary.illustrationData?.illustrationSummaries;
  assigneeId = this.route.parent?.snapshot.data.summary.caseData?.assigneeId;
  loggedUser: AuthorizationContextModel | undefined;
  productSelectionData = this.store.select(getProductSelection);
  activeIllustrationJourney: IllustrationSummary | undefined;
  hasPermissionIllustration = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    public stepSetupService: StepSetupService,
    public dataService: DataService,
  ) {
    this.store.select(getPortalUser).subscribe(loggedUser => (this.loggedUser = loggedUser));
    this.dataService?.setFormStatus('VALID', this.STEP_NAME);
  }

  ngOnInit(): void {
    this.activeIllustrationJourney = this.illustrationSummaries?.find(
      (illustration: IllustrationSummary) => illustration.loanId === this.loanId,
    );

    this.dataService
      .saveProgress(Journey.Illustration, this.applicationDraftId, this.loanId, { [this.STEP_NAME]: 'VALID' }, of(undefined))
      .pipe(take(1))
      .subscribe();

    if (this.loggedUser?.intermediaryId === this.assigneeId) {
      this.hasPermissionIllustration = true;
    }
  }
}
