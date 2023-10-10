import {
  HTTP_INTERCEPTORS as BASE_HTTP_INTERCEPTORS,
  HttpClient,
  HttpHandler,
  HttpInterceptor,
  ɵHttpInterceptingHandler
} from '@angular/common/http';
import { InjectionToken, Injector, NgModule } from '@angular/core';

export const FEATURE_HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('FEATURE_HTTP_INTERCEPTORS');

@NgModule({
  providers: [
    {
      provide: HttpClient,
      useClass: HttpClient
    },
    {
      provide: HttpHandler,
      useClass: ɵHttpInterceptingHandler
    },
    {
      provide: BASE_HTTP_INTERCEPTORS,
      deps: [Injector, FEATURE_HTTP_INTERCEPTORS],
      useFactory: (injector: any, interceptors: any) => [...interceptors, ...injector.parent.get(BASE_HTTP_INTERCEPTORS)]
    }
  ]
})
export class InterceptorInheritanceModule {}
