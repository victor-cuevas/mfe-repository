import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  selector: 'cfo-my-lender-menu',
  templateUrl: './my-lender-menu.component.html',
})
export class MyLenderMenuComponent implements OnInit {
  items: MenuItem[] = [];
  routePaths: typeof RoutePaths = RoutePaths;
  roleMappings: IntermediarySummary[] = this.route.snapshot?.data?.intermediary?.reduxData?.roleMappings || [];
  canViewAssistants: boolean = this.checkPermissionService.checkPermissions({
    section: 'assistants',
    features: ['me'],
  });

  isExpanded = false;

  toggleSidebarMenu() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private translate: TranslateService,
    private route: ActivatedRoute,
  ) {}

  getLabel(label: string) {
    return `<span class="menuitem-text">${label}</span><div class="menuitem-tooltip">${label}</div>`;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this.getLabel(this.translate.instant('lender.titles.lenderDetails')),
        icon: 'pi pi-fw pi-briefcase',
        escape: false,
        routerLink: this.routePaths.LENDER_DETAILS,
      },
      // {
      //   label: this.getLabel(this.translate.instant('lender.titles.branches')),
      //   icon: 'pi pi-fw pi-cog',
      //   escape: false,
      //   routerLink: this.routePaths.LENDER_BRANCHES
      // },
      {
        label: this.getLabel(this.translate.instant('lender.titles.users')),
        icon: 'pi pi-fw pi-users',
        escape: false,
        routerLink: this.routePaths.LENDER_USERS,
      },
    ];
  }
}
