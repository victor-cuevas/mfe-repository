import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MfeBrokerSharedToastModule } from '@close-front-office/mfe-broker/shared-toast';
import { ADDRESSES, MfeBrokerCoreModule, PERMISSIONS } from '@close-front-office/mfe-broker/core';

import { AddressService, ApiModule } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { FirmResolver } from './resolvers/firm.resolver';
import { IntermediaryResolver } from './resolvers/intermediary.resolver';
import { UpdateFirmsResolver } from './resolvers/update-firms.resolver';
import { UpdateSubmissionRouteResolver } from './resolvers/update-submission-route.resolver';
import { AddIntermediaryResolver } from './resolvers/add-intermediary.resolver';
import { PanelUserGuard } from './guards/panel-user.guard';
import { PanelLoaderGuard } from './guards/panel-loader.guard';
import { CheckTocCompletedGuard } from './guards/check-toc-completed.guard';
import { CheckPermissionsService } from './services/check-permissions.service';
import { IntermediaryDetailsService } from './services/intermediary-details.service';
import { UserDetailsService } from './services/user-details.service';
import { PanelUserResolver } from './resolvers/panel-user.resolver';
import { LenderDetailsResolver } from './resolvers/lender-details.resolver';
import { ReadOnlyModeResolver } from './resolvers/read-only-mode.resolver';
import { LenderUserDetailsResolver } from './resolvers/lender-user-details.resolver';
import { CodeTablesService } from './services/code-tables.service';
import { AddressFeService } from './services/address-fe.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ApiModule, MfeBrokerSharedToastModule, MfeBrokerCoreModule],
  providers: [
    DialogService,
    MessageService,
    IntermediaryDetailsService,
    UserDetailsService,
    UpdateFirmsResolver,
    UpdateSubmissionRouteResolver,
    AddIntermediaryResolver,
    PanelUserGuard,
    PanelLoaderGuard,
    CodeTablesService,
    FirmResolver,
    IntermediaryResolver,
    CheckTocCompletedGuard,
    PanelUserResolver,
    LenderDetailsResolver,
    ReadOnlyModeResolver,
    LenderUserDetailsResolver,
    AddressFeService,
    { provide: PERMISSIONS, useClass: CheckPermissionsService },
    { provide: ADDRESSES, useClass: AddressService },
  ],
})
export class MfeBrokerMfeBrokerPanelCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: MfeBrokerMfeBrokerPanelCoreModule) {
    if (parentModule) {
      throw new Error('MfeBrokerMfeBrokerPanelCoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
