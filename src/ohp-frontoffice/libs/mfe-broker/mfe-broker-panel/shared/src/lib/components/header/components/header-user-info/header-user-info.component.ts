import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { loadPanelUserSuccess, getPanelUser } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { AuthorizationContextModel } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { takeUntil } from 'rxjs/operators';
import { AuthManagementService, ConfigContextService } from '@close-front-office/shared/config';
import { loadCaseTableSuccess } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'mbpanel-header-user-info',
  templateUrl: './header-user-info.component.html',
})
export class HeaderUserInfoComponent implements OnDestroy {
  items: MenuItem[] = [
    { label: 'My Profile', icon: 'pi pi-user', routerLink: 'profile/edit' },
    {
      label: 'Log Out',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authManagement.logout();
        setTimeout(() => {
          this.store.dispatch(loadPanelUserSuccess({ entity: null }));
          this.store.dispatch(loadCaseTableSuccess({ entity: {} }));
        }, 500);
      },
    },
  ];
  public user?: Observable<AuthorizationContextModel>;
  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store, private config: ConfigContextService, private authManagement: AuthManagementService) {
    this.user = this.store.pipe(select(getPanelUser), takeUntil(this.onDestroy$));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
