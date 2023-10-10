import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  selector: 'cfo-my-profile-menu',
  templateUrl: './my-profile-menu.component.html',
})
export class MyProfileMenuComponent implements OnInit {
  items: MenuItem[] = [];
  routePaths: typeof RoutePaths = RoutePaths;
  roleMappings: IntermediarySummary[] = this.route.snapshot?.data?.intermediary?.reduxData?.roleMappings || [];
  canViewAssistants: boolean = this.checkPermissionService.checkPermissions({
    section: 'assistants',
    features: ['me'],
  });
  canViewTradingAddress: boolean = this.checkPermissionService.checkPermissions({
    section: 'switcher',
    features: ['firm'],
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
        label: this.getLabel(this.translate.instant('profile.labels.myProfile')),
        icon: 'pi pi-fw pi-user',
        escape: false,
        routerLink: this.routePaths.PROFILE_PROFILE,
      },
      {
        label: this.getLabel(this.translate.instant('profile.labels.myAccount')),
        icon: 'pi pi-fw pi-cog',
        escape: false,
        routerLink: this.routePaths.PROFILE_ACCOUNT,
      },
    ];
    if (this.canViewAssistants) {
      this.items.push({
        label: this.getLabel(this.translate.instant('profile.labels.myAssistants')),
        icon: 'pi pi-fw pi-users',
        escape: false,
        routerLink: this.routePaths.PROFILE_ASSISTANTS,
      });
    }
    if (this.roleMappings.length) {
      this.items.push({
        label: this.getLabel(this.translate.instant('profile.labels.myLinkedAdvisors')),
        icon: 'pi pi-fw pi-paperclip',
        escape: false,
        routerLink: this.routePaths.PROFILE_LINKED_ADVISORS,
      });
    }
    if (this.canViewTradingAddress) {
      this.items.push({
        label: this.getLabel(this.translate.instant('profile.labels.myTradingAddress')),
        icon: 'pi pi-fw pi-home',
        escape: false,
        routerLink: this.routePaths.PROFILE_TRADING_ADDRESS,
      });
    }
  }
}
