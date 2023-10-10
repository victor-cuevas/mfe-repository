import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { FEATURE_HTTP_INTERCEPTORS, InterceptorInheritanceModule } from '@close-front-office/shared/interceptor-inheritance';

import { PipesModule } from './pipes/pipes.module';
import { SpinnerService } from './services/spinner.service';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { SortService } from './services/sort.service';
import { CheckPermissionsGuard } from './guards/check-permissions.guard';
import { TranslateService } from '@ngx-translate/core';
import { AuthManagementService, ConfigContextService } from '@close-front-office/shared/config';
import { Router } from '@angular/router';

export interface CheckPermissionsInterface {
  section: string;
  features: string[];
  neededPermission?: string;
  cfoPermissionsFirmId?: string;
  firmId?: string;
}

export interface CheckPermissionsServiceInterface {
  checkPermissions(data: CheckPermissionsInterface): boolean;
}

export const PERMISSIONS = new InjectionToken<CheckPermissionsServiceInterface>('check-permissions.service');
export const ADDRESSES = new InjectionToken<any>('address.service');

@NgModule({
  imports: [CommonModule, PipesModule, FormsModule, ReactiveFormsModule, InterceptorInheritanceModule],
  providers: [
    SortService,
    CheckPermissionsGuard,
    SpinnerService,
    {
      provide: FEATURE_HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
      deps: [ToastService, TranslateService, ConfigContextService, AuthManagementService, Router, SpinnerService],
    },
  ],
})
export class MfeBrokerCoreModule {}
