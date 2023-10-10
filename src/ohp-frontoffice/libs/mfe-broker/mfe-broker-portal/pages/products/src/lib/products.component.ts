import { Component } from '@angular/core';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mbp-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  breadcrumb: MenuItem[] = [{ label: 'Products' }, { label: 'Overview' }];

  constructor() {}
}
