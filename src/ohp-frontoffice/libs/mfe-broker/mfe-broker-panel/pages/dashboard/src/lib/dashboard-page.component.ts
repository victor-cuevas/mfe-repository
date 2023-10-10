import { Component } from '@angular/core';
import { getPanelUser, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { Store } from '@ngrx/store';
import { ConfigContextService } from '@close-front-office/shared/config';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mbpanel-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  loginName = '';
  nrNotifications = 2;
  dashboardItems = [
    {
      id: 'firms',
      icon: 'pi pi-sitemap',
      type: 'dashBoard.labels.firms',
      linkicon: 'pi pi-arrow-right',
      linkpath: RoutePaths.LIST_FIRMS,
    },
    {
      id: 'submissionRoutes',
      icon: 'pi pi-directions',
      type: 'dashBoard.labels.submissionRoutes',
      linkicon: 'pi pi-arrow-right',
      linkpath: RoutePaths.LIST_SUBMISSION_ROUTES,
    },
    {
      id: 'configuration',
      icon: 'pi pi-cog',
      type: 'dashBoard.labels.configuration',
      linkicon: 'pi pi-arrow-right',
      linkpath: RoutePaths.CONFIGURATION_ROUTE,
    },
    {
      id: 'switcher',
      icon: 'pi pi-users',
      type: 'dashBoard.labels.lender',
      linkicon: 'pi pi-arrow-right',
      linkpath: RoutePaths.LENDER_ROUTE,
    },
  ];
  routePaths: typeof RoutePaths = RoutePaths;
  // error handling
  isDev = false;
  error = new FormControl('');

  constructor(private store: Store, private configService: ConfigContextService, private http: HttpClient) {
    this.store.select(getPanelUser).subscribe(resp => {
      this.loginName = `${resp?.firstName} ${resp?.lastName}`;
    });
    // check the env for error handling
    const stage = this.configService.getConfigContext().STAGE;
    this.isDev = stage === 'dev';
  }

  throwError(error: string) {
    const localVarPath = `/api/Exception/throw-exception`;
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'panel');
    const apiUrl = mfeConfig?.apiUrl;
    this.http.get<unknown>(`${apiUrl}${localVarPath}`, { params: { errorCode: error } }).subscribe();
  }
}
