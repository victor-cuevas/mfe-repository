import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { getPanelUser } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Component({
  selector: 'mbpanel-header-logo',
  templateUrl: './header-logo.component.html',
})
export class HeaderLogoComponent implements OnInit {
  routerLink = '/panel';

  constructor(@Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface, private store: Store) {}

  ngOnInit() {
    if (this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['firm'] })) {
      this.store.select(getPanelUser).subscribe(reduxData => {
        if (reduxData?.firmId) {
          this.routerLink = `/panel/firms/${reduxData.firmId}`;
        }
      });
    }
  }
}
