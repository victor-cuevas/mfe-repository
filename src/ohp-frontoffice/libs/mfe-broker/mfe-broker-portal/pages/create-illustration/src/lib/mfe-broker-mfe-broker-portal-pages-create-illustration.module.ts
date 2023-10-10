// Angular imports
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

import { CreateIllustrationComponent } from './create-illustration.component';
import { LoanDetailsStepComponent } from './components/loan-details-step/loan-details-step.component';
import { IllustrationAdviceAndFeesComponent } from './components/illustration-advice-and-fees/illustration-advice-and-fees.component';
import { ReviewStepComponent } from './components/review-step/review-step.component';
import { IllustrationProductSelectionComponent } from './components/illustration-product-selection/illustration-product-selection.component';
import { CiProductSelectionResolver } from './resolvers/ci-product-selection.resolver';
import { CiLoanDetailsResolver } from './resolvers/ci-loan-details.resolver';
import { CiAdviceFeesResolver } from './resolvers/ci-advice-fees.resolver';
import { IllustrationJourneyResolver } from './resolvers/illustration-journey.resolver';
import { GenericStepGuard, JourneyAuthResolver } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { StoreModule } from '@ngrx/store';
import { LOAN_DETAILS_FEATURE_KEY, loanDetailsReducer } from './state/loan-details/loan-details.reducer';

@NgModule({
  imports: [
    CommonModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    RouterModule.forChild([
      {
        path: ':applicationDraftId/loan/:loanId',
        component: CreateIllustrationComponent,
        resolve: { illustrationJourney: IllustrationJourneyResolver },

        children: [
          {
            path: '',
            resolve: { auth: JourneyAuthResolver },
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: 'loan-details',
                component: LoanDetailsStepComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { loanDetailsData: CiLoanDetailsResolver },
              },
              {
                path: 'product-selection',
                component: IllustrationProductSelectionComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { productSelectionData: CiProductSelectionResolver },
              },
              {
                path: 'advice-and-fees',
                component: IllustrationAdviceAndFeesComponent,
                resolve: { adviceFeesData: CiAdviceFeesResolver },
                canDeactivate: [GenericStepGuard],
              },
              { path: 'confirm', component: ReviewStepComponent, resolve: { adviceFeesData: CiAdviceFeesResolver } },
            ],
          },
        ],
      },
    ]),
    StoreModule.forFeature(LOAN_DETAILS_FEATURE_KEY, loanDetailsReducer),
  ],
  declarations: [
    CreateIllustrationComponent,
    LoanDetailsStepComponent,
    IllustrationAdviceAndFeesComponent,
    ReviewStepComponent,
    IllustrationProductSelectionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CiLoanDetailsResolver, CiAdviceFeesResolver, CiProductSelectionResolver, IllustrationJourneyResolver],
})
export class MfeBrokerMfeBrokerPortalPagesCreateIllustrationModule {
  constructor() {}
}
