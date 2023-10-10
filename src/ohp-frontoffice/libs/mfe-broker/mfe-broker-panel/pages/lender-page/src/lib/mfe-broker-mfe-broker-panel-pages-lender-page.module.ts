import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LenderPageComponent } from './lender-page.component';
import { RouterModule } from '@angular/router';
import { LenderDetailsComponent } from './components/lender-details/lender-details.component';
import { BranchesComponent } from './components/branches/branches.component';
import { UsersComponent } from './components/users/users.component';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import { MfeBrokerMfeBrokerPanelSharedModule } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { MfeBrokerSharedToastModule } from '@close-front-office/mfe-broker/shared-toast';
import { AddNewLenderComponent } from './components/add-new-lender/add-new-lender.component';
import { LenderDetailsResolver, LenderUserDetailsResolver } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { LenderUserDetailsComponent } from './pages/lender-user-details/lender-user-details.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserAccountComponent } from './components/user-account/user-account.component';

@NgModule({
  imports: [
    CommonModule,
    MfeBrokerSharedUiModule,
    MfeBrokerMfeBrokerPanelSharedModule,
    MfeBrokerSharedToastModule,
    RouterModule.forChild([
      {
        path: '',
        component: LenderPageComponent,
        children: [
          { path: '', redirectTo: 'lender-details', pathMatch: 'full' },
          { path: 'lender-details', component: LenderDetailsComponent, resolve: { lenderDetailsData: LenderDetailsResolver } },
          { path: 'branches', component: BranchesComponent },
          { path: 'lender-users', component: UsersComponent },
        ],
      },
      { path: 'lender-users/new', component: AddNewLenderComponent, data: { pageId: 'panel.lenderLenderusersNew' } },
      {
        path: 'lender-users/:id',
        component: LenderUserDetailsComponent,
        resolve: { userDetails: LenderUserDetailsResolver },
        data: { pageId: 'panel.lenderLenderusersId' },
        children: [
          {
            path: '',
            redirectTo: 'edit',
            pathMatch: 'full',
          },
          {
            path: 'edit',
            data: { pageId: 'panel.lenderLenderusersIdEdit' },
            component: UserProfileComponent,
          },
          { path: 'account', component: UserAccountComponent, data: { pageId: 'panel.lenderLenderusersIdAccount' } },
        ],
      },
    ]),
    MfeBrokerMfeBrokerPanelSharedModule,
  ],
  declarations: [
    LenderPageComponent,
    LenderDetailsComponent,
    BranchesComponent,
    UsersComponent,
    AddNewLenderComponent,
    LenderUserDetailsComponent,
    UserProfileComponent,
    UserAccountComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelPagesLenderPageModule {}
