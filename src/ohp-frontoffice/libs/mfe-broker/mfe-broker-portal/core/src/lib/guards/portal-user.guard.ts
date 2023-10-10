import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { PermissionContextService } from '@close-front-office/mfe-broker/core';
import { PortalUserService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loadPortalUserFailure, loadPortalUserSuccess } from '../state/portal-user';

@Injectable({
  providedIn: 'root',
})
export class PortalUserGuard implements CanActivate, CanDeactivate<boolean> {
  constructor(
    private service: PortalUserService,
    private store: Store,
    private router: Router,
    private permissionContextService: PermissionContextService,
  ) {}

  canDeactivate(
    component: boolean,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): boolean {
    if (nextState?.url !== '/') {
      setTimeout(() => this.store.dispatch(loadPortalUserSuccess({ entity: null })), 1000);
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.service.portalUserGetMe().pipe(
      map(
        response => {
          if (response) {
            const splitUrl = state.url.split('/');

            this.store.dispatch(loadPortalUserSuccess({ entity: response }));

            if (splitUrl[2] === 'complete-registration') {
              return true;
            }

            this.permissionContextService.setAssigneeContext(response.intermediaryId || '');

            if (
              response?.permission?.switcher?.includes('lender') &&
              (this.router.getCurrentNavigation()?.extras?.state?.fromLogin || (!response.firmId && splitUrl.length !== 4))
            ) {
              this.router.navigate(['panel']);
              return;
            }
            if (splitUrl.length === 2) {
              this.router.navigate(['broker/', response.firmId]);
              return true;
            } else if (splitUrl.length > 2) {
              return true;
            }
          }
          this.router.navigate(['broker/not-found'], { skipLocationChange: true });
          return false;
        },
        (error: any) => {
          this.store.dispatch(loadPortalUserFailure({ error }));
          return false;
        },
      ),
    );
  }
}
