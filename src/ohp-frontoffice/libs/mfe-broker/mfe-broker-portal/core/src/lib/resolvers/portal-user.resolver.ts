import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { getPortalUser } from '../state/portal-user/portal-user.selectors';
import { PortalUserService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { UserDetailsService } from '../services/user-details.service';

@Injectable({
  providedIn: 'root',
})
export class PortalUserResolver {
  userData: any;
  resolve() {
    this.store.select(getPortalUser).subscribe(reduxData => (this.userData = reduxData));
    return this.portalUserService.portalUserGetProfile().pipe(
      map(allResponse => {
        this.userDetailsService.setUserDetails(allResponse);
        return { reduxData: this.userData };
      }),
    );
  }

  constructor(private store: Store, private userDetailsService: UserDetailsService, private portalUserService: PortalUserService) {}
}
