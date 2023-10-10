import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getPortalUser } from '../state/portal-user/portal-user.selectors';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckTocCompletedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(getPortalUser).pipe(
      map(response => {
        if (response && response.agreeToTermsAndConditions) {
          return true;
        }
        this.router.navigate(['broker/complete-registration']);
        return false;
      }),
    );
  }
}
