import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AddressService, ApiModule } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CaseMockService } from './services/case-mock.service';
import { DataService } from './services/data.service';
import { OrganisationService } from './services/organisation.service';
import { ProductMockService } from './services/product-mock.service';
import { MfeBrokerSharedToastModule } from '@close-front-office/mfe-broker/shared-toast';
import { ADDRESSES, MfeBrokerCoreModule, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { CheckPermissionsService } from './services/check-permissions.service';
import { CheckTocNotCompletedGuard } from './guards/check-toc-not-completed.guard';
import { CheckTocCompletedGuard } from './guards/check-toc-completed.guard';
import { PortalUserGuard } from './guards/portal-user.guard';
import { PortalLoaderGuard } from './guards/portal-loader.guard';
import { DialogService } from 'primeng/dynamicdialog';
import { PortalUserResolver } from './resolvers/portal-user.resolver';
import { FirmIdGuard } from './guards/firm-id.guard';
import { CaseSummaryResolver } from './resolvers/case-summary.resolver';
import { StepSetupService } from './services/step-setup.service';
import { CheckRetirementService } from './services/check-retirement.service';
import { MortgageTermService } from './services/mortgage-term.service';
import { GenericStepGuard } from './guards/generic-step.guard';
import { JourneyAuthResolver } from './resolvers/journey-auth.resolver';
import { CaseSummaryService } from './services/case-summary.service';
import { FmaContactService } from './services/fma-contact.service';
import { FeeService } from './services/fee.service';
import { UserDetailsService } from './services/user-details.service';
import { CodeTablesService } from './services/code-tables.service';
import { ProductSelectionService } from './services/product-selection.service';
import { StipulationService } from './services/stipulation.service';
import { AddressFeService } from './services/address-fe.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ApiModule, MfeBrokerSharedToastModule, MfeBrokerCoreModule],
  providers: [
    CaseMockService,
    CaseSummaryResolver,
    CheckTocCompletedGuard,
    CheckTocNotCompletedGuard,
    DataService,
    DatePipe,
    DialogService,
    FirmIdGuard,
    FmaContactService,
    JourneyAuthResolver,
    MessageService,
    MortgageTermService,
    OrganisationService,
    UserDetailsService,
    ProductSelectionService,
    CodeTablesService,
    PortalUserGuard,
    PortalLoaderGuard,
    PortalUserResolver,
    ProductMockService,
    StepSetupService,
    CheckPermissionsService,
    StipulationService,
    GenericStepGuard,
    FeeService,
    CheckRetirementService,
    CaseSummaryService,
    AddressFeService,
    { provide: PERMISSIONS, useClass: CheckPermissionsService },
    { provide: ADDRESSES, useClass: AddressService },
  ],
})
export class MfeBrokerMfeBrokerPortalCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: MfeBrokerMfeBrokerPortalCoreModule) {
    if (parentModule) {
      throw new Error('MfeBrokerMfeBrokerPortalCoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
