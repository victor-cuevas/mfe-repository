import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SeveritiesEnum, ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';
import { AuthManagementService, ConfigContextService } from '@close-front-office/shared/config';
import { datadogRum } from '@datadog/browser-rum';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';

export class HttpErrorInterceptor implements HttpInterceptor {
  isDev = false;
  errorSummary = '';

  constructor(
    private toastService: ToastService,
    private translateService: TranslateService,
    private configService: ConfigContextService,
    private authManagement: AuthManagementService,
    private router: Router,
    private spinnerService: SpinnerService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorDetail = '';
        const stage = this.configService.getConfigContext().STAGE;
        const dataDog = this.configService.getConfigContext().DATADOG;
        this.isDev = stage === 'dev';
        if (error.error instanceof ErrorEvent) {
          // This is client side error
          this.errorSummary = this.translateService.instant('general.errors.clientSideError');
          errorDetail = `${error.error.message}`;
        } else {
          // This is server side error
          if (this.spinnerService.getIsLoading()) {
            this.spinnerService.setIsLoading(false);
          }
          switch (error.error?.status ?? error.status) {
            case 400:
              this.errorSummary = this.handlerTranslation(error.error.errorCode, error.error.status);
              break;
            case 401:
              this.authManagement.logout();
              break;
            case 403:
              this.errorSummary = this.translateService.instant(`general.errors.${error.error.status}`);
              if (request.url.includes('/me')) this.router.navigate(['broker/not-found'], { skipLocationChange: true });
              break;
            case 404:
              this.errorSummary = this.translateService.instant(`general.errors.${error.error.status}`);
              break;
            case 409:
              this.errorSummary = this.translateService.instant(`general.errors.${error.error.status}`);
              break;
            case 422:
              this.errorSummary = this.handlerTranslation(error.error.errorCode, error.error.status);
              break;
            case 500:
              this.errorSummary = this.translateService.instant(`general.errors.${error.error.status}`);
              break;
            default:
              this.errorSummary = this.translateService.instant('general.errors.defaultErrorMsg');
          }
          errorDetail = error.error.traceId ? `Trace ID: ${error.error.traceId}` : '';
        }

        this.toastService.showMessage({
          summary: this.errorSummary,
          detail: errorDetail,
          severity: SeveritiesEnum.ERROR,
          life: 5000,
        });

        if (dataDog) {
          datadogRum.addError(error);
        }

        return this.isDev ? throwError(error) : EMPTY;
      }),
    );
  }

  private handlerTranslation(errorCode: string, status: number): string {
    const errorMessage = this.translateService.instant(`general.errors.${errorCode}`);
    if (!errorMessage.includes(`general.error`)) {
      return errorMessage;
    } else {
      return this.translateService.instant(`general.errors.default${status}`);
    }
  }
}
