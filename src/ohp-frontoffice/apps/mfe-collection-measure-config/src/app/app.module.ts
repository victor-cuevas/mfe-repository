import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_ROUTES } from './app.route';
import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigContextModel, ConfigContextService } from '@close-front-office/shared/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Auth, Hub } from 'aws-amplify';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import {AuthInterceptor} from './auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,BrowserAnimationsModule,RouterModule.forRoot(APP_ROUTES, { initialNavigation: 'enabledNonBlocking' }),AmplifyAuthenticatorModule,HttpClientModule,ProgressSpinnerModule],
  providers: [{

    provide: APP_INITIALIZER,

    useFactory: initializeApp,

    multi: true,

    deps: [HttpClient, Router, ConfigContextService]

  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  } 
],
  bootstrap: [AppComponent]
})
export class AppModule { }
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
              AdvancedSecurityDataCollectionFlag: true
            }
          }
        });
        return Hub.listen('auth', data => {
          switch (data.payload.event) {
            case 'signIn':
              router.navigate(['collection-measure']);
              break;
            case 'signOut':
              router.navigate(['']);
              break;
          }
        });
      })
    );
}
