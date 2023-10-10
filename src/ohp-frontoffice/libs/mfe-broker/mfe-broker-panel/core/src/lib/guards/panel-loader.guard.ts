import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';

import { ConfigContextService } from '@close-front-office/shared/config';
import {
  BrokerCodeTable,
  BrokerCodeTableResponse,
  ConfigurationService,
  PanelCodeTables,
  defaultCodeTables,
  CodeTables,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { CodeTablesService } from '../services/code-tables.service';

@Injectable({
  providedIn: 'root',
})
export class PanelLoaderGuard implements CanActivate, CanDeactivate<boolean> {
  private renderer: Renderer2;

  constructor(
    private config: ConfigContextService,
    private configurationService: ConfigurationService,
    private codeTablesService: CodeTablesService,
    private rendererFactory: RendererFactory2,
    private router: Router,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  canDeactivate(_: boolean, __: ActivatedRouteSnapshot, ___: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    if (nextState?.url !== '/' && !nextState?.url.includes('panel')) {
      const el = document.getElementById('broker_portal_styles');
      if (el) {
        setTimeout(() => el.remove(), 1000);
      }
    }
    return true;
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loadCodeTables();
    this.loadStyles();
    this.loadFavIcon();
    this.loadLoader();

    return true;
  }

  private loadCodeTables() {
    this.configurationService
      .configurationCodeTablesByNames(PanelCodeTables)
      .pipe(
        take(1),
        map((data: BrokerCodeTableResponse) => {
          const codeTables = { ...defaultCodeTables };

          data.codeTables?.forEach((codeTable: BrokerCodeTable) => {
            if (codeTable.name && codeTable.codeTableEntry) {
              codeTables[codeTable.name as PanelCodeTables] = codeTable.codeTableEntry;
            }
          });
          return codeTables;
        }),
      )
      .subscribe((data: CodeTables) => (this.codeTablesService.codeTables = data));
  }

  private loadFavIcon() {
    const mfeConfig = this.config.getConfigContext().REMOTE_MFES.find(item => item.path === 'panel');
    if (mfeConfig) {
      const el = document.getElementById('ClosefoFavIcon');
      if (el) {
        el.remove();
      }
      const headEl = document.getElementsByTagName('head')[0];

      const styleLinkEl = document.createElement('link');
      styleLinkEl.rel = 'icon';
      styleLinkEl.id = 'ClosefoFavIcon';
      styleLinkEl.href = `${mfeConfig.remoteUrl}/assets/favicon-orange.svg`;
      styleLinkEl.type = 'image/svg+xml';
      headEl.appendChild(styleLinkEl);
    }
  }

  private loadStyles() {
    const mfeConfig = this.config.getConfigContext().REMOTE_MFES.find(item => item.path === 'panel');
    if (mfeConfig) {
      this.renderer.removeClass(document.body, 'april');
      const el = document.getElementById('broker_panel_styles');

      if (!el) {
        const headEl = document.getElementsByTagName('head')[0];
        const styleLinkEl = document.createElement('link');
        styleLinkEl.rel = 'stylesheet';
        styleLinkEl.id = 'broker_panel_styles';
        styleLinkEl.href = `${mfeConfig.remoteUrl}/broker_panel_styles.css`;
        headEl.appendChild(styleLinkEl);
      }
      setTimeout(() => {
        const a = document.getElementById('preloader');
        const body = document.getElementsByTagName('body')[0];
        if (!a) {
          const divElement = document.createElement('div');
          divElement.className = 'loader';
          divElement.id = 'preloader';
          body.appendChild(divElement);
        }
      });
    }
  }

  private loadLoader() {
    this.router.events
      .pipe(
        filter(routerEvent => routerEvent instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        setTimeout(() => {
          const el = document.getElementById('preloader');
          if (el) {
            el.remove();
          }
        });
      });
  }
}
