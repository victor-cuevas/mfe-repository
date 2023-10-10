import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { IntermediaryDetailsService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediaryResponse, IntermediaryRole, IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cfo-profile-menu',
  templateUrl: './profile-menu.component.html',
})
export class ProfileMenuComponent implements OnInit {
  items: MenuItem[] = [];
  routePaths: typeof RoutePaths = RoutePaths;
  intermediaryDetails: IntermediaryResponse = this.intermediaryDetailsService.getIntermediaryDetails();
  roleMappings: IntermediarySummary[] = this.intermediaryDetails?.roleMappings || [];
  canViewAssistants: boolean =
    this.checkPermissionService.checkPermissions({
      section: 'assistants',
      features: ['me', 'others', 'viewer'],
    }) &&
    [IntermediaryRole.Advisor, IntermediaryRole.SupervisorAndAdvisor].includes(
      this.intermediaryDetails?.intermediaryRole as IntermediaryRole,
    );

  isExpanded = false;
  isInLenderPage: boolean = this.route.snapshot.url[0].path === 'lender-users';
  toggleSidebarMenu() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private translate: TranslateService,
    private intermediaryDetailsService: IntermediaryDetailsService,
    private route: ActivatedRoute,
  ) {}

  getLabel(label: string) {
    return `<span class="menuitem-text">${label}</span><div class="menuitem-tooltip">${label}</div>`;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this.getLabel(this.translate.instant('firms.titles.profile')),
        icon: 'pi pi-fw pi-user',
        escape: false,
        routerLink: this.routePaths.PROFILE_PROFILE,
      },
      {
        label: this.getLabel(this.translate.instant('firms.titles.account')),
        icon: 'pi pi-fw pi-cog',
        escape: false,
        routerLink: this.routePaths.PROFILE_ACCOUNT,
      },
    ];

    if (this.canViewAssistants && !this.isInLenderPage) {
      this.items.push({
        label: this.getLabel(this.translate.instant('firms.titles.assistants')),
        icon: 'pi pi-fw pi-users',
        escape: false,
        routerLink: this.routePaths.PROFILE_ASSISTANTS,
      });
    }

    if (this.roleMappings.length && !this.isInLenderPage) {
      this.items.push({
        label: this.getLabel(this.translate.instant('firms.titles.linkedAdvisors')),
        icon: 'pi pi-fw pi-paperclip',
        escape: false,
        routerLink: this.routePaths.PROFILE_LINKED_ADVISORS,
      });
    }

    if (!this.isInLenderPage) {
      this.items.push({
        label: this.getLabel(this.translate.instant('firms.titles.tradingAddress')),
        icon: 'pi pi-fw pi-home',
        escape: false,
        routerLink: this.routePaths.PROFILE_TRADING_ADDRESS,
      });
    }
  }
}
