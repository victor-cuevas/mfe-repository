import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

import { CreateDipComponent } from './create-dip.component';
import { DipSecurityPropertyComponent } from './components/dip-security-property/dip-security-property.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { AddressHistoryComponent } from './components/address-history/address-history.component';
import { FinancialCommitmentsComponent } from './components/financial-commitments/financial-commitments.component';
import { HouseholdExpenditureComponent } from './components/household-expenditure/household-expenditure.component';
import { DipRetirementIncomeComponent } from './components/dip-retirement-income/dip-retirement-income.component';
import { CreditHistoryComponent } from './components/credit-history/credit-history.component';
import { RepaymentStrategyComponent } from './components/repayment-strategy/repayment-strategy.component';

import { DipDocumentComponent } from './components/dip-document/dip-document.component';
import { ExistingMortgagesComponent } from './components/existing-mortgages/existing-mortgages.component';
import { AdditionalBorrowingComponent } from './components/additional-borrowing/additional-borrowing.component';
import { PropertyLoansDetailsComponent } from './components/property-and-loan/property-and-loan.component';
import { DepositDetailsComponent } from './components/deposit-details/deposit-details.component';
import { PreviousEmploymentComponent } from './components/previous-employment/previous-employment.component';
import { FutureChangesComponent } from './components/future-changes/future-changes.component';
import { DipAdviceAndFeesComponent } from './components/dip-advice-and-fees/dip-advice-and-fees.component';
import {
  DipAdditionalBorrowingResolver,
  DipAddressHistoryResolver,
  DipAdviceFeesResolver,
  DipConfirmDipResolver,
  DipCurrentIncomeResolverResolver,
  DipDepositDetailsResolver,
  DipExistingMortgageResolver,
  DipFinancialCommitmentsResolver,
  DipFutureChangesResolver,
  DipHouseholdExpenditureResolver,
  DipJourneyResolver,
  DipPersonalDetailsResolver,
  DipProductSelectionResolver,
  DipPropertyLoanResolver,
  DipRetirementIncomeResolver,
  DipSecurityPropertyResolver,
} from './resolvers';
import { BuyToLetPropertyDetailsComponent } from './components/buy-to-let-property-details/buy-to-let-property-details.component';
import { BuyToLetPortfolioComponent } from './components/buy-to-let-portfolio/buy-to-let-portfolio.component';
import { BuyToLetSPVComponent } from './components/buy-to-let-spv/buy-to-let-spv.component';
import { CurrentIncomeStepComponent } from './components/current-income/current-income-step.component';

import { DipProductSelectionComponent } from './components/dip-product-selection/dip-product-selection.component';
import { GenericStepGuard, JourneyAuthResolver } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { ConfirmDipComponent } from './components/confirm-dip/confirm-dip.component';

@NgModule({
  imports: [
    CommonModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateDipComponent,
        resolve: { dipJourney: DipJourneyResolver },
        children: [
          // https://github.com/angular/angular/issues/42953 workaround
          {
            path: '',
            resolve: { auth: JourneyAuthResolver },
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: 'property-and-loan',
                component: PropertyLoansDetailsComponent,
                resolve: { propertyLoanData: DipPropertyLoanResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'security-property',
                component: DipSecurityPropertyComponent,
                resolve: { securityPropertyData: DipSecurityPropertyResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'existing-mortgages',
                component: ExistingMortgagesComponent,
                resolve: { existingMortgageData: DipExistingMortgageResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'additional-borrowing',
                component: AdditionalBorrowingComponent,
                resolve: {
                  additionalBorrowingData: DipAdditionalBorrowingResolver,
                },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'deposit-details',
                component: DepositDetailsComponent,
                resolve: { depositData: DipDepositDetailsResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'advice-and-fees',
                component: DipAdviceAndFeesComponent,
                resolve: { adviceFeesData: DipAdviceFeesResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'product-selection',
                component: DipProductSelectionComponent,
                canDeactivate: [GenericStepGuard],
                resolve: { productSelectionData: DipProductSelectionResolver },
              },
              {
                path: 'personal-details',
                component: PersonalDetailsComponent,
                resolve: { personalDetails: DipPersonalDetailsResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'address-history',
                component: AddressHistoryComponent,
                resolve: { addressHistoryData: DipAddressHistoryResolver },
                canDeactivate: [GenericStepGuard],
              },
              { path: 'repayment-strategy', component: RepaymentStrategyComponent },
              {
                path: 'financial-commitments',
                component: FinancialCommitmentsComponent,
                resolve: { financialCommitmentsData: DipFinancialCommitmentsResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'household-expenditure',
                component: HouseholdExpenditureComponent,
                resolve: { householdExpenditure: DipHouseholdExpenditureResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'current-income',
                component: CurrentIncomeStepComponent,
                resolve: { currentIncomeData: DipCurrentIncomeResolverResolver },
                canDeactivate: [GenericStepGuard],
              },
              { path: 'previous-employment', component: PreviousEmploymentComponent },
              {
                path: 'future-changes',
                component: FutureChangesComponent,
                resolve: { futureChanges: DipFutureChangesResolver },
                canDeactivate: [GenericStepGuard],
              },
              {
                path: 'retirement-income',
                component: DipRetirementIncomeComponent,
                resolve: { retirementIncomeData: DipRetirementIncomeResolver },
                canDeactivate: [GenericStepGuard],
              },
              { path: 'credit-history', component: CreditHistoryComponent },
              { path: 'submit', component: ConfirmDipComponent, resolve: { dipData: DipConfirmDipResolver } },
              { path: 'dip-document', component: DipDocumentComponent },
              { path: 'buy-let-property', component: BuyToLetPropertyDetailsComponent },
              { path: 'buy-let-portfolio', component: BuyToLetPortfolioComponent },
              { path: 'buy-let-spv', component: BuyToLetSPVComponent },
            ],
          },
        ],
      },
    ]),
    TooltipModule,
  ],
  declarations: [
    CreateDipComponent,
    PropertyLoansDetailsComponent,
    DepositDetailsComponent,
    DipSecurityPropertyComponent,
    PersonalDetailsComponent,
    AddressHistoryComponent,
    FinancialCommitmentsComponent,
    HouseholdExpenditureComponent,
    CurrentIncomeStepComponent,
    DipRetirementIncomeComponent,
    CreditHistoryComponent,
    RepaymentStrategyComponent,
    ConfirmDipComponent,
    DipDocumentComponent,
    ExistingMortgagesComponent,
    AdditionalBorrowingComponent,
    PreviousEmploymentComponent,
    FutureChangesComponent,
    DipAdviceAndFeesComponent,
    BuyToLetPropertyDetailsComponent,
    BuyToLetPortfolioComponent,
    BuyToLetSPVComponent,
    DipProductSelectionComponent,
  ],
  providers: [
    DipAdviceFeesResolver,
    DipAddressHistoryResolver,
    DipDepositDetailsResolver,
    DipCurrentIncomeResolverResolver,
    DipFinancialCommitmentsResolver,
    DipHouseholdExpenditureResolver,
    DipFutureChangesResolver,
    DipProductSelectionResolver,
    DipJourneyResolver,
    DipPersonalDetailsResolver,
    DipPropertyLoanResolver,
    DipRetirementIncomeResolver,
    DipSecurityPropertyResolver,
    DipConfirmDipResolver,
    DipExistingMortgageResolver,
    DipAdditionalBorrowingResolver,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalPagesCreateDipModule {}
