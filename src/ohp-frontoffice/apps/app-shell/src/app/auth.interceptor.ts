import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Auth } from 'aws-amplify';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isMockRequest = req.url.includes('assets/') || req.url.includes('/logout');
    let request = req;

    if (!isMockRequest) {
      return from(Auth.currentSession()).pipe(
        switchMap(tokenObject => {
          const token = tokenObject.getIdToken().getJwtToken();
          request = req.clone({
            setHeaders: {
              authorization: `Bearer ${token}`,
            },
          });
          return next.handle(request);
        }),
      );
    }

    return next.handle(request);
  }
}
