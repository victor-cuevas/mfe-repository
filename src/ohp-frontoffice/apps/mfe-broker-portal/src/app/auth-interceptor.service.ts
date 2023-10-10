import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticatorService: AuthenticatorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isMockRequest = req.url.includes('assets/') || req.url.includes('/logout');
    let request = req;

    if (!isMockRequest) {
      const token: string = this.authenticatorService?.user?.getSignInUserSession()?.getIdToken()?.getJwtToken() || '';
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
