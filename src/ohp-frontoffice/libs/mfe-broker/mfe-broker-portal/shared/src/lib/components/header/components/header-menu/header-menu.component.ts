import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mbp-header-menu',
  templateUrl: './header-menu.component.html',
})
export class HeaderMenuComponent {
  items: MenuItem[] = [
    { label: 'Cases', icon: 'pi pi-fw pi-book', routerLink: `/broker/${this.route.snapshot.paramMap.get('firmId')}/cases` },
    // { label: 'Products', icon: 'pi pi-fw pi-briefcase', routerLink: `/broker/${this.route.snapshot.paramMap.get('firmId')}/products` } // TODO add for phase 2
  ];

  constructor(private route: ActivatedRoute) {}
}
