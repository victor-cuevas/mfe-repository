import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { RoutePaths } from '../constants/route-paths.enum';
import { loadPanelUserSuccess } from '../state/panel-user.actions';
import { getPanelUser } from '../state/panel-user.selectors';

@Injectable({
  providedIn: 'root',
})
export class CheckTocCompletedGuard implements CanActivate, Resolve<boolean> {
  routePaths: typeof RoutePaths = RoutePaths;

  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(getPanelUser).pipe(
      map(response => {
        if (response && response.agreeToTermsAndConditions) {
          return true;
        }
        this.router.navigate(['broker/complete-registration']);
        this.store.dispatch(loadPanelUserSuccess({ entity: null }));
        return false;
      }),
    );
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(getPanelUser).pipe(
      map(response => {
        if (response && response.agreeToTermsAndConditions) {
          return true;
        }
        this.router.navigate(['broker/complete-registration']);
        this.store.dispatch(loadPanelUserSuccess({ entity: null }));
        return false;
      }),
    );
  }
}
