import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MultiSelectModule } from 'primeng/multiselect';

import { MfeBrokerMfeBrokerPanelSharedModule } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import {
  AddIntermediaryResolver,
  FirmResolver,
  IntermediaryResolver,
  ReadOnlyModeResolver,
  UpdateFirmsResolver,
} from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { CheckPermissionsGuard } from '@close-front-office/mfe-broker/core';

import { FirmsTableComponent } from './components/firms-table/firms-table.component';
import { IntermediariesTableComponent } from './components/intermediaries-table/intermediaries-table.component';
import { FirmsPageComponent } from './firms-page.component';
import { AddIntermediaryComponent } from './pages/add-intermediary/add-intermediary.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { UpdateFirmComponent } from './pages/update-firm/update-firm.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TradingAddressComponent } from './components/trading-address/trading-address.component';
import { IntermediaryProfileComponent } from './components/intermediary-profile/intermediary-profile.component';
import { IntermediaryAccountComponent } from './components/intermediary-account/intermediary-account.component';
import { IntermediaryAssistantsComponent } from './components/intermediary-assistants/intermediary-assistants.component';
import { IntermediaryLinkedAdvisorsComponent } from './components/intermediary-linked-advisors/intermediary-linked-advisors.component';
import { IntermediaryTradingAddressesComponent } from './components/intermediary-trading-addresses/intermediary-trading-addresses.component';

@NgModule({
  imports: [
    CommonModule,
    MultiSelectModule,
    PanelMenuModule,
    MfeBrokerMfeBrokerPanelSharedModule,
    MfeBrokerSharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            pathMatch: 'full',
            resolve: { permissionCheck: CheckPermissionsGuard },
            component: FirmsPageComponent,
            data: {
              section: 'firms',
              features: ['viewer', 'lender'],
            },
          },
          {
            path: 'new',
            resolve: { permissionCheck: CheckPermissionsGuard },
            component: UpdateFirmComponent,
            data: {
              section: 'firms',
              features: ['lender'],
            },
          },
          {
            path: ':id',
            resolve: { fetchedData: FirmResolver, permissionCheck: CheckPermissionsGuard },
            data: {
              section: 'firms',
              features: ['firm', 'viewer', 'lender'],
            },
            children: [
              { path: '', component: DetailsPageComponent, pathMatch: 'full' },
              { path: 'details', component: UpdateFirmComponent, resolve: { fetchedData: UpdateFirmsResolver } },
              {
                path: 'users',
                children: [
                  {
                    path: '',
                    redirectTo: 'new',
                    pathMatch: 'full',
                  },
                  {
                    path: 'new',
                    component: AddIntermediaryComponent,
                    resolve: { permissionCheck: CheckPermissionsGuard, fetchedData: AddIntermediaryResolver },
                    data: {
                      section: 'profiles',
                      features: ['firm', 'lender'],
                    },
                  },
                  {
                    path: ':userId',
                    component: ProfilePageComponent,
                    resolve: {
                      permissionCheck: CheckPermissionsGuard,
                      fetchedData: IntermediaryResolver,
                      readOnlyMode: ReadOnlyModeResolver,
                    },
                    data: {
                      section: 'profiles',
                      features: ['firm', 'viewer', 'lender'],
                    },
                    children: [
                      {
                        path: '',
                        redirectTo: 'edit',
                        pathMatch: 'full',
                      },
                      {
                        path: 'edit',
                        component: IntermediaryProfileComponent,
                        resolve: { readOnlyMode: ReadOnlyModeResolver },
                        data: {
                          section: 'profiles',
                        },
                      },
                      { path: 'account', component: IntermediaryAccountComponent },
                      {
                        path: 'assistants',
                        component: IntermediaryAssistantsComponent,
                        resolve: { permissionCheck: CheckPermissionsGuard, readOnlyMode: ReadOnlyModeResolver },
                        data: {
                          section: 'assistants',
                          features: ['viewer', 'others', 'me'],
                        },
                      },
                      { path: 'linked-advisors', component: IntermediaryLinkedAdvisorsComponent },
                      { path: 'trading-addresses', component: IntermediaryTradingAddressesComponent },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
  ],
  declarations: [
    AddIntermediaryComponent,
    DetailsPageComponent,
    FirmsPageComponent,
    IntermediariesTableComponent,
    FirmsTableComponent,
    UpdateFirmComponent,
    ProfilePageComponent,
    TradingAddressComponent,
    IntermediaryProfileComponent,
    IntermediaryAccountComponent,
    IntermediaryAssistantsComponent,
    IntermediaryLinkedAdvisorsComponent,
    IntermediaryTradingAddressesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelPagesFirmsModule {}
