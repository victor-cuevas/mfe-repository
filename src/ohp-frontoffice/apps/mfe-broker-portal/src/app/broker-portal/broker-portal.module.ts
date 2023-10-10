import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Store, StoreModule } from '@ngrx/store';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';

import {
  CASE_TABLE_FEATURE_KEY,
  caseTableReducer,
  CURRENT_INCOME_FEATURE_KEY,
  currentIncomeReducer,
  EXISTING_MORTGAGES_FEATURE_KEY,
  existingMortgagesReducer,
  init,
  initCurrentIncome,
  initPersonalDetails,
  initProductSelection,
  MfeBrokerMfeBrokerPortalCoreModule,
  PERSONAL_DETAILS_FEATURE_KEY,
  personalDetailsReducer,
  PORTALUSER_FEATURE_KEY,
  PRODUCT_SELECTION_FEATURE_KEY,
  productSelectionReducer,
  reducer,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { BASE_PATH } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { SharedI18nModule } from '@close-front-office/shared/i18n';

import { BROKER_PORTAL_ROUTES } from './broker-portal.routes';
import { environment } from '../../environments/environment';
import { ConfigContextService } from '@close-front-office/shared/config';

@NgModule({
  declarations: [],
  imports: [
    MfeBrokerMfeBrokerPortalCoreModule,
    SharedI18nModule.forRoot({ path: '/assets/i18n/broker-portal/', mfeName: 'broker' }),
    RouterModule.forChild(BROKER_PORTAL_ROUTES),
    StoreModule.forRoot({
      router: routerReducer,
    }),
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forFeature(PORTALUSER_FEATURE_KEY, reducer),
    StoreModule.forFeature(PRODUCT_SELECTION_FEATURE_KEY, productSelectionReducer),
    StoreModule.forFeature(PERSONAL_DETAILS_FEATURE_KEY, personalDetailsReducer),
    StoreModule.forFeature(CURRENT_INCOME_FEATURE_KEY, currentIncomeReducer),
    StoreModule.forFeature(EXISTING_MORTGAGES_FEATURE_KEY, existingMortgagesReducer),
    StoreModule.forFeature(CASE_TABLE_FEATURE_KEY, caseTableReducer),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
  ],
  providers: [{ provide: BASE_PATH, useFactory: setMfeApiUrl, deps: [ConfigContextService] }],
})
export class BrokerPortalModule {
  constructor(private http: HttpClient, private toastService: ToastService, private store: Store) {
    this.store.dispatch(init());
    this.store.dispatch(initProductSelection());
    this.store.dispatch(initPersonalDetails());
    this.store.dispatch(initCurrentIncome());
  }
}

function setMfeApiUrl(configContextService: ConfigContextService): string {
  return configContextService.getMfeApiUrl('broker');
}
