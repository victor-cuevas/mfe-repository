import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getPortalUser } from '../state/portal-user/portal-user.selectors';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckTocNotCompletedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(getPortalUser).pipe(
      map(response => {
        if (response && response.agreeToTermsAndConditions) {
          this.router.navigate(['']);
          return false;
        }
        return true;
      }),
    );
  }
}
