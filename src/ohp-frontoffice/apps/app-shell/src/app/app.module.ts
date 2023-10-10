import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigContextModel, ConfigContextService, MfeModel, SharedConfigModule } from '@close-front-office/shared/config';
import { MetaResolver, SharedCoreModule } from '@close-front-office/shared/core';
import { AuthGuard } from './auth.guard';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { Auth, Hub } from 'aws-amplify';
import { LoginGuard } from './login.guard';

import { datadogRum } from '@datadog/browser-rum';
import { SharedLandingModule } from '@close-front-office/shared/landing';
import { dynamicRoutes } from '../assets/dynamic-routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    SharedConfigModule,
    SharedCoreModule,
    AmplifyAuthenticatorModule,
    SharedLandingModule,
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [HttpClient, Router, ConfigContextService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function initializeApp(httpClient: HttpClient, router: Router, configContextService: ConfigContextService): () => Observable<any> {
  return () =>
    httpClient.get<ConfigContextModel>('/assets/config.json').pipe(
      tap((config: ConfigContextModel) => {
        configContextService.setConfigContext(config);
        Auth.configure({
          region: config.AWS.REGION,
          userPoolId: config.AWS.USER_POOL_ID,
          userPoolWebClientId: config.AWS.USER_POOL_APP_CLIENT_ID,
          oauth: {
            // Domain name
            domain: config.AWS.USER_POOL_AUTH_DOMAIN,
            // Authorized scopes
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            // Callback URL
            redirectSignIn: config.AWS.USER_POOL_SIGN_IN_REDIRECT_URL,
            // Sign out URL
            redirectSignOut: config.AWS.USER_POOL_REDIRECT_URL,
            responseType: 'code',
            options: {
              // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
              AdvancedSecurityDataCollectionFlag: true,
            },
          },
        });

        if (config.DATADOG) {
          datadogRum.init({
            applicationId: config.DATADOG.applicationId,
            clientToken: config.DATADOG.clientToken,
            site: config.DATADOG.site,
            service: config.DATADOG.service,
            env: `${config.CLIENT ?? 'ohp'}-${config.STAGE ?? 'dev'}`,
            version: config.DATADOG.version ?? '1.0.0',
            sampleRate: 100,
            trackInteractions: true,
          });
        }

        Hub.listen('auth', (data: any) => {
          switch (data.payload.event) {
            case 'signIn':
              router.navigate([config.DEFAULT_ROUTE], { state: { fromLogin: true } });
              break;
            case 'signOut':
              router.navigate(['']);
              break;
          }
        });

        return router.resetConfig(buildRoutes(config));
      }),
    );
}

function buildRoutes(config: ConfigContextModel): Routes {
  const defaultRoutes: Routes = [
    {
      path: '',
      resolve: { title: MetaResolver },
      runGuardsAndResolvers: 'always',
      pathMatch: 'full',
      canActivate: [LoginGuard],
      children: [],
    },
    { path: '**', redirectTo: '' },
  ];

  const lazyRoutes: Routes = config.REMOTE_MFES.map((mfe: MfeModel) => ({
    path: mfe.path,
    canActivate: [AuthGuard],
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: `${mfe.remoteUrl}/remoteEntry.js`,
        type: 'module',
        exposedModule: mfe.exposedModule,
      })
        .then(m => m[mfe.ngModuleName])
        .catch(err => console.log(err)),
  }));

  const configDynamicRoutes = dynamicRoutes.map(route => {
    route.canActivate = [AuthGuard];
    return route;
  });

  return [defaultRoutes[0], ...lazyRoutes, ...configDynamicRoutes, defaultRoutes[1]];
}
