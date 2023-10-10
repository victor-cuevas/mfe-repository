import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mbpanel-configuration-page',
  templateUrl: './configuration-page.component.html',
})
export class ConfigurationPageComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  breadcrumb: MenuItem[] = [{ label: 'Dashboard', routerLink: '../dashboard', icon: 'pi pi-chevron-left' }];
  constructor(public router: Router) {}
}
