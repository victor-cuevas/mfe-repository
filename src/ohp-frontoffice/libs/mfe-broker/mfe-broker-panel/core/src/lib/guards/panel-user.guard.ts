import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortalUserService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { loadPanelUserFailure, loadPanelUserSuccess } from '../state/panel-user.actions';
import { getPanelUser } from '../state/panel-user.selectors';

@Injectable({
  providedIn: 'root',
})
export class PanelUserGuard implements CanActivate, CanDeactivate<boolean>, CanActivateChild {
  private reduxData: any;

  constructor(private store: Store, private service: PortalUserService, private router: Router) {}

  canDeactivate(
    component: boolean,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): boolean {
    this.store.dispatch(loadPanelUserSuccess({ entity: null }));
    return true;
  }

  canActivate(): boolean {
    this.store.select(getPanelUser).subscribe(reduxData => {
      this.reduxData = reduxData;
    });
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.reduxData?.intermediaryId) return true;

    return this.service.portalUserGetMe().pipe(
      map(
        response => {
          this.store.dispatch(loadPanelUserSuccess({ entity: response }));
          return true;
        },
        (error: any) => {
          this.store.dispatch(loadPanelUserFailure({ error }));
          return false;
        },
      ),
    );
  }
}
