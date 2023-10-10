import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterceptorInheritanceModule } from '@close-front-office/shared/interceptor-inheritance';

@NgModule({
  imports: [CommonModule, InterceptorInheritanceModule],
  providers: [
    // {
    //   provide: FEATURE_HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true,
    //   deps: [ToastService]
    // }
  ]
})
export class MfeAuthConfigCoreModule {}
