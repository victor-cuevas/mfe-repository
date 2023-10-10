import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GenericStepGuard } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

import { FmaJourneyResolver } from './resolvers/fma-journey.resolver';
import { FmaJourneyAuthResolver } from './resolvers/fma-journey-auth.resolver';
import { CreateFmaComponent } from './create-fma.component';
import { FmaCurrentIncomeStepComponent } from './components/fma-current-income-step/fma-current-income-step.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { FmaAdviceAndFeesComponent } from './components/fma-advice-and-fees/fma-advice-and-fees.component';
import { FmaContactDetailsResolver } from './resolvers/fma-contact-details.resolver';
import { FmaSecurityPropertyResolver } from './resolvers/fma-security-property.resolver';
import { FmaSecurityPropertyComponent } from './components/fma-security-property/fma-security-property.component';
import { FmaRetirementIncomeComponent } from './components/fma-retirement-income/fma-retirement-income.component';
import { FmaAdviceAndFeesResolver } from './resolvers/fma-advice-and-fees.resolver';
import { SolicitorDetailsComponent } from './components/solicitor-details/solicitor-details.component';
import { FmaSolicitorDetailsResolver } from './resolvers/fma-solicitor-details.resolver';
import { FmaValuationDetailsComponent } from './components/fma-valuation-details/fma-valuation-details.component';
import { FmaValuationDetailsResolver } from './resolvers/fma-valuation-details.resolver';
import { FmaBankAccountResolver } from './resolvers/fma-bank-account.resolver';
import { FmaProductSelectionComponent } from './components/fma-product-selection/fma-product-selection.component';
import { FmaProductSelectionResolver } from './resolvers/fma-product-selection.resolver';
import { FmaCurrentIncomeResolver } from './resolvers/fma-current-income.resolver';
import { FmaRetirementIncomeResolver } from './resolvers/fma-retirement-income.resolver';
import { FmaLenderPolicyCheckComponent } from './components/fma-lender-policy-check/fma-lender-policy-check.component';
import { FmaLenderPolicyCheckStatusComponent } from './components/fma-lender-policy-check/fma-lender-policy-check-status/fma-lender-policy-check-status.component';
import { FmaUploadStipulationsComponent } from './components/fma-upload-stipulations/fma-upload-stipulations.component';
import { FmaUploadStipulationsResolver } from './resolvers/fma-upload-stipulations.resolver';
import { FmaFeePaymentComponent } from './components/fma-fee-payment/fma-fee-payment.component';
import { FmaAffordabilityCheckComponent } from './components/fma-affordability-check/fma-affordability-check.component';
import { FmaAffordabilityCheckResolver } from './resolvers/fma-affordability-check.resolver';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { FmaFeePaymentResolver } from './resolvers/fma-fee-payment.resolver';
import { FmaConfirmComponent } from './components/fma-confirm/fma-confirm.component';
import { FmaLenderPolicyCheckResolver } from './resolvers/fma-lender-policy-check.resolver';

@NgModule({
  declarations: [
    CreateFmaComponent,
    FmaCurrentIncomeStepComponent,
    ContactDetailsComponent,
    FmaSecurityPropertyComponent,
    FmaAdviceAndFeesComponent,
    SolicitorDetailsComponent,
    FmaValuationDetailsComponent,
    FmaProductSelectionComponent,
    FmaRetirementIncomeComponent,
    SolicitorDetailsComponent,
    FmaValuationDetailsComponent,
    FmaLenderPolicyCheckComponent,
    FmaLenderPolicyCheckStatusComponent,
    FmaUploadStipulationsComponent,
    FmaFeePaymentComponent,
    FmaAffordabilityCheckComponent,
    BankAccountComponent,
    FmaConfirmComponent,
  ],
  imports: [
    CommonModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateFmaComponent,
        resolve: { fmaJourney: FmaJourneyResolver },
        children: [
          // https://github.com/angular/angular/issues/42953 workaround
          {
            path: '',
            resolve: { auth: FmaJourneyAuthResolver },
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: 'contact-details',
                component: ContactDetailsComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { contactDetailsData: FmaContactDetailsResolver },
              },
              {
                path: 'current-income',
                component: FmaCurrentIncomeStepComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { currentIncomeData: FmaCurrentIncomeResolver },
              },
              {
                path: 'retirement-income',
                component: FmaRetirementIncomeComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { retirementIncomeData: FmaRetirementIncomeResolver },
              },
              {
                path: 'security-property',
                component: FmaSecurityPropertyComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { securityPropertyData: FmaSecurityPropertyResolver },
              },
              {
                path: 'product-selection',
                component: FmaProductSelectionComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { productSelectionData: FmaProductSelectionResolver },
              },
              {
                path: 'advice-and-fees',
                component: FmaAdviceAndFeesComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { adviceFeesData: FmaAdviceAndFeesResolver },
              },
              {
                path: 'affordability-check',
                component: FmaAffordabilityCheckComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { affordabilityCheckData: FmaAffordabilityCheckResolver },
              },
              {
                path: 'solicitor-details',
                component: SolicitorDetailsComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { solicitorDetailsData: FmaSolicitorDetailsResolver },
              },
              {
                path: 'valuation-details',
                component: FmaValuationDetailsComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { valuationDetailsData: FmaValuationDetailsResolver },
              },
              {
                path: 'bank-account',
                component: BankAccountComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { bankAccountData: FmaBankAccountResolver },
              },
              {
                path: 'lender-policy-check',
                canDeactivate: [GenericStepGuard],
                component: FmaLenderPolicyCheckComponent,
                resolve: { lenderPolicyCheckData: FmaLenderPolicyCheckResolver },
              },
              {
                path: 'upload-stipulations',
                component: FmaUploadStipulationsComponent,
                resolve: { uploadStipulationsData: FmaUploadStipulationsResolver },
              },
              {
                path: 'fee-payment',
                component: FmaFeePaymentComponent,
                resolve: { feePaymentData: FmaFeePaymentResolver },
              },
              {
                path: 'confirm-fma',
                component: FmaConfirmComponent,
              },
            ],
          },
        ],
      },
    ]),
  ],
  providers: [
    FmaAdviceAndFeesResolver,
    FmaAffordabilityCheckResolver,
    FmaBankAccountResolver,
    FmaContactDetailsResolver,
    FmaCurrentIncomeResolver,
    FmaFeePaymentResolver,
    FmaJourneyAuthResolver,
    FmaJourneyResolver,
    FmaLenderPolicyCheckResolver,
    FmaProductSelectionResolver,
    FmaRetirementIncomeResolver,
    FmaSecurityPropertyResolver,
    FmaSolicitorDetailsResolver,
    FmaUploadStipulationsResolver,
    FmaValuationDetailsResolver,
  ],
})
export class MfeBrokerMfeBrokerPortalPagesCreateFmaModule {}
