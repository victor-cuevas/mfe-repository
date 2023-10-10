import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { PermissionContextService } from '@close-front-office/mfe-broker/core'; // TODO
import { getPanelUser } from '../state/panel-user.selectors';
import { PortalUserService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { UserDetailsService } from '../services/user-details.service';

@Injectable({
  providedIn: 'root',
})
export class PanelUserResolver {
  userData: any;
  constructor(
    private panelUserService: PortalUserService,
    private store: Store,
    private userDetailsService: UserDetailsService,
    private permissionContextService: PermissionContextService,
  ) {}

  resolve(): Observable<any> | void {
    this.store.select(getPanelUser).subscribe(reduxData => {
      this.permissionContextService.setCurrentIntermediaryContext(reduxData?.intermediaryId || '');
      this.userData = reduxData;
    });
    return this.panelUserService.portalUserGetProfile().pipe(
      map(allResponse => {
        this.userDetailsService.setUserDetails(allResponse);
        return { reduxData: this.userData };
      }),
    );
  }
}
