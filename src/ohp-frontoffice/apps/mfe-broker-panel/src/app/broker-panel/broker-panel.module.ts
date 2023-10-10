import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  init,
  MfeBrokerMfeBrokerPanelCoreModule,
  PANELUSER_FEATURE_KEY,
  reducer,
} from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { BASE_PATH } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { SharedI18nModule } from '@close-front-office/shared/i18n';
import { Store, StoreModule } from '@ngrx/store';

import { BROKER_PANEL_ROUTES } from './broker-panel.routes';
import { environment } from '../../environments/environment';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigContextService } from '@close-front-office/shared/config';

@NgModule({
  imports: [
    MfeBrokerMfeBrokerPanelCoreModule,
    SharedI18nModule.forRoot({ path: '/assets/i18n/broker-panel/', mfeName: 'panel' }),
    RouterModule.forChild(BROKER_PANEL_ROUTES),
    StoreModule.forRoot({
      router: routerReducer,
    }),
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forFeature(PANELUSER_FEATURE_KEY, reducer),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
  ],
  providers: [{ provide: BASE_PATH, useFactory: setMfeApiUrl, deps: [ConfigContextService] }],
})
export class BrokerPanelModule {
  constructor(private http: HttpClient, private store: Store) {
    this.store.dispatch(init());
  }
}

function setMfeApiUrl(configContextService: ConfigContextService): string {
  return configContextService.getMfeApiUrl('panel');
}
