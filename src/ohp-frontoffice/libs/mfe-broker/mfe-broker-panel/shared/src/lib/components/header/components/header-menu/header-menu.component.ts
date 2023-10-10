import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'mbpanel-header-menu',
  templateUrl: './header-menu.component.html',
})
export class HeaderMenuComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(@Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface, public router: Router) {}

  ngOnInit() {
    if (!this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['lender'] })) return;
    if (this.checkPermissionService.checkPermissions({ section: 'firms', features: ['viewer', 'lender'] })) {
      this.items.push({ label: 'firms', icon: 'pi pi-fw pi-sitemap', routerLink: '/panel/firms' });
    }
    if (this.checkPermissionService.checkPermissions({ section: 'submissionRoutes', features: ['viewer', 'lender'] })) {
      this.items.push({ label: 'submission routes', icon: 'pi pi-fw pi-directions', routerLink: '/panel/submission-routes' });
    }
    if (this.checkPermissionService.checkPermissions({ section: 'configuration', features: ['viewer', 'lender'] })) {
      this.items.push({ label: 'configuration', icon: 'pi pi-fw pi-cog', routerLink: '/panel/configuration' });
    }
    this.items.push({ label: 'lender', icon: 'pi pi-fw pi-users', routerLink: '/panel/lender' });
  }
}
