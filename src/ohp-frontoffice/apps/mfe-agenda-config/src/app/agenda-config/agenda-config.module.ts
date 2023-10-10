import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AGENDA_CONFIG_ROUTES } from './agenda-config-routing.module';
import { RouterModule } from '@angular/router';
import { SharedI18nModule } from '@close-front-office/shared/i18n';
import { FEATURE_HTTP_INTERCEPTORS, InterceptorInheritanceModule } from '@close-front-office/shared/interceptor-inheritance';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

class TestInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request);
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InterceptorInheritanceModule,
    RouterModule.forChild(AGENDA_CONFIG_ROUTES),
    SharedI18nModule.forRoot({path:'/assets/i18n/Agenda-Config/', mfeName: 'agenda'})
  ],
  providers: [
    {
      provide: FEATURE_HTTP_INTERCEPTORS,
      // TODO: Workaround until InterceptorInheritanceModule accepts no provider for FEATURE_HTTP_INTERCEPTORS or you useClass on your own one
      useClass: TestInterceptor,
      multi: true
    }
  ]
})
export class AgendaConfigModule {
  constructor(private translateService: TranslateService) {
    this.translateService.use('en');
  }
}