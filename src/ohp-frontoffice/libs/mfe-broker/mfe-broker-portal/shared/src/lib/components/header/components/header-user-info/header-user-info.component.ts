import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { select, Store } from '@ngrx/store';
import { getPortalUser, loadCaseTableSuccess, loadPortalUserSuccess } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AuthorizationContextModel } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AuthManagementService, ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mbp-header-user-info',
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
          this.store.dispatch(loadPortalUserSuccess({ entity: null }));
          this.store.dispatch(loadCaseTableSuccess({ entity: {} }));
        }, 500);
      },
    },
  ];
  public user?: Observable<AuthorizationContextModel | undefined>;
  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store, private config: ConfigContextService, private authManagement: AuthManagementService) {
    this.user = this.store.pipe(select(getPortalUser), takeUntil(this.onDestroy$));
    this.user.subscribe(userInfo => {
      if (!userInfo?.agreeToTermsAndConditions) {
        this.items.splice(0, 1);
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
