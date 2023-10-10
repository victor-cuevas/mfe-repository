import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'close-front-office-lender-page',
  templateUrl: './lender-page.component.html',
})
export class LenderPageComponent {
  breadcrumb: MenuItem[] = [{ label: 'Dashboard', routerLink: '../dashboard', icon: 'pi pi-chevron-left' }];

  constructor() {}
}
