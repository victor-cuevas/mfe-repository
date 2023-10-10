import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mbpanel-configuration-menu',
  templateUrl: './configuration-menu.component.html',
})
export class ConfigurationMenuComponent implements OnInit {
  items: MenuItem[] = [];
  itemsclean: MenuItem[] = [];
  routePaths: typeof RoutePaths = RoutePaths;

  isExpanded = false;

  toggleSidebarMenuKeyboard(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') this.toggleSidebarMenu();
  }

  toggleSidebarMenu() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(private translate: TranslateService) {}
  getLabel(label: string) {
    return `<span class="menuitem-text">${label}</span><div class="menuitem-tooltip">${label}</div>`;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this.getLabel(this.translate.instant('configuration.labels.purchase')),
        icon: 'pi pi-fw pi-file',
        escape: false,
        routerLink: this.routePaths.CONFIGURATION_PROCURATION_FEE_NEWLENDING_ROUTE,
      },
      {
        label: this.getLabel(this.translate.instant('configuration.labels.remortgage')),
        icon: 'pi pi-fw pi-home',
        escape: false,
        routerLink: this.routePaths.CONFIGURATION_PROCURATION_FEE_REMORTGAGE_ROUTE,
      },
      {
        label: this.getLabel(this.translate.instant('configuration.labels.globalSettings')),
        icon: 'pi pi-fw pi-globe',
        escape: false,
        routerLink: this.routePaths.CONFIGURATION_GLOBAL_SETTINGS_ROUTE,
      },
    ];
  }
}
