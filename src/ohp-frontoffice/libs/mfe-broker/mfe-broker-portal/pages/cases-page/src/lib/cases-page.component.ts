import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CaseTableComponent } from './components/case-table/case-table.component';
import { getPortalUser, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AuthorizationContextModel, PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PermissionContextService } from '@close-front-office/mfe-broker/core';
import { FormControl } from '@angular/forms';
import { ConfigContextService } from '@close-front-office/shared/config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mbp-cases-page',
  templateUrl: './cases-page.component.html',
})
export class CasesPageComponent implements OnDestroy {
  routePaths: typeof RoutePaths = RoutePaths;
  breadcrumb: MenuItem[] = [{ label: 'Cases' }, { label: 'Overview' }];
  permissions: any = {};
  portalPermissionType = PortalPermissionType;
  assigneeId?: string;

  //For error handling
  error = new FormControl('');
  isDev = false;

  @ViewChild('caseTable') caseTable!: CaseTableComponent;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    public permissionContextService: PermissionContextService,
    private store: Store,
    private configService: ConfigContextService,
    private http: HttpClient,
  ) {
    this.store.pipe(select(getPortalUser), takeUntil(this.onDestroy$)).subscribe((reduxData: AuthorizationContextModel | undefined) => {
      this.permissionContextService.setAssigneeContext((reduxData as AuthorizationContextModel)?.intermediaryId || '');
      this.assigneeId = reduxData?.roleMappings?.[0]?.brokerId as string;
    });
    // check the env for error handling
    const stage = this.configService.getConfigContext().STAGE;
    this.isDev = stage === 'dev';
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  // Method for throwing the error
  throwError(error: string) {
    const localVarPath = `/api/Exception/throw-exception`;
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'broker');
    const apiUrl = mfeConfig?.apiUrl;
    this.http.get<unknown>(`${apiUrl}${localVarPath}`, { params: { errorCode: error } }).subscribe();
  }
}
