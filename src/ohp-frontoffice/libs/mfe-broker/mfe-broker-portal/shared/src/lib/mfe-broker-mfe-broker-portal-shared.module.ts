import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutComponent } from './components/layout/layout.component';
import { ProductSelectionTableComponent } from './components/product-selection-table/product-selection-table.component';
import { ProductSelectionComponent } from './components/product-selection/product-selection.component';
import { AdviceFeesComponent } from './components/advice-fees/advice-fees.component';
import { SecurityPropertyComponent } from './components/security-property/security-property.component';
import { RootLayoutComponent } from './components/root-layout/root-layout.component';
import { SplitProductModalComponent } from './components/split-product-modal/split-product-modal.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { PipesModule } from '@close-front-office/mfe-broker/core';
import { SharedHeaderModule } from './components/header/shared-header.module';
import { LoanPartComponent } from './components/loan-part/loan-part.component';
import { CurrentIncomeComponent } from './components/current-income/current-income.component';
import { RetirementIncomeComponent } from './components/retirement-income/retirement-income.component';
import { MainEmploymentComponent } from './components/main-employment/main-employment.component';
import { IncomeDetailsComponent } from './components/income-details/income-details.component';
import { AffordabilityCheckComponent } from './components/affordability-check/affordability-check.component';
import { MortgageTermPipe } from './pipes/mortgage-term.pipe';
import { CheckRetirementDirective } from './directives/check-retirement.directive';
import { MoreEmployerDetailsComponent } from './components/more-employer-details/more-employer-details.component';
import { EarlyRepaymentChargePipe } from './pipes/early-repayment-charge.pipe';
import { ProjectedValueDirective } from './directives/projected-value.directive';
import { DipDecisionPipe } from './pipes/dip-decision.pipe';
import { StatusIconPipe } from './pipes/status-icon.pipe';
import { EmploymentStatusPipe } from './pipes/employment-status.pipe';
import { SubmissionRoutePipe } from './pipes/submission-route.pipe';
import { FeesSummaryComponent } from './components/fees-summary/fees-summary.component';
import { FeePipe } from './pipes/fee.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { UploadStatusPipe } from './pipes/upload-status.pipe';
import { MultilineTooltipPipe } from './pipes/multiline-tooltip.pipe';
import { IllustrationStatusPipe } from './pipes/illustration-status.pipe';
import { ValueCheckDirective } from './directives/value-check.directive';
import { LoanStatusPipe } from './pipes/loan-status.pipe';
import { SolicitorDetailsTableComponent } from './components/solicitor-details-table/solicitor-details-table.component';

const modules = [FormsModule, ReactiveFormsModule, TranslateModule, MfeBrokerSharedUiModule, SharedHeaderModule, PipesModule];

@NgModule({
  imports: [CommonModule, ...modules],
  exports: [
    ...modules,
    LayoutComponent,
    ProductSelectionComponent,
    AdviceFeesComponent,
    SecurityPropertyComponent,
    EarlyRepaymentChargePipe,
    CurrentIncomeComponent,
    ValueCheckDirective,
    RetirementIncomeComponent,
    AffordabilityCheckComponent,
    MortgageTermPipe,
    EmploymentStatusPipe,
    CheckRetirementDirective,
    IllustrationStatusPipe,
    ProjectedValueDirective,
    SummaryCardComponent,
    DipDecisionPipe,
    UploadStatusPipe,
    MultilineTooltipPipe,
    FeePipe,
    LoanStatusPipe,
    LabelPipe,
    StatusIconPipe,
    SubmissionRoutePipe,
    FeesSummaryComponent,
  ],
  declarations: [
    ProductSelectionComponent,
    AdviceFeesComponent,
    SecurityPropertyComponent,
    ProductSelectionTableComponent,
    SplitProductModalComponent,
    SummaryCardComponent,
    LayoutComponent,
    RootLayoutComponent,
    LoanPartComponent,
    EmploymentStatusPipe,
    CurrentIncomeComponent,
    SubmissionRoutePipe,
    RetirementIncomeComponent,
    MainEmploymentComponent,
    IncomeDetailsComponent,
    AffordabilityCheckComponent,
    ValueCheckDirective,
    MortgageTermPipe,
    LoanStatusPipe,
    EarlyRepaymentChargePipe,
    UploadStatusPipe,
    MultilineTooltipPipe,
    CheckRetirementDirective,
    IllustrationStatusPipe,
    ProjectedValueDirective,
    MoreEmployerDetailsComponent,
    DipDecisionPipe,
    FeePipe,
    StatusIconPipe,
    LabelPipe,
    FeesSummaryComponent,
    SolicitorDetailsTableComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalSharedModule {}
