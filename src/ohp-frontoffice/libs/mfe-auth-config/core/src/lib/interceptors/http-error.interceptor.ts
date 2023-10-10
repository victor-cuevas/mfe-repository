import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SeveritiesEnum, ToastService } from '@close-front-office/mfe-broker/shared-toast';

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}
  //constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('localJwt');
        }
        let errorSummary = '';
        let errorDetail = '';
        if (error.error instanceof ErrorEvent) {
          // This is client side error
          errorSummary = `Client side error:`;
          errorDetail = `${error.error.message}`;
        } else {
          // This is server side error
          errorSummary = `Server error: Code: ${error.status}`;
          errorDetail = `${error.message}`;
        }
        this.toastService.showMessage({ summary: errorSummary, detail: errorDetail, severity: SeveritiesEnum.ERROR });
        return throwError(error);
      })
    );
  }
}
