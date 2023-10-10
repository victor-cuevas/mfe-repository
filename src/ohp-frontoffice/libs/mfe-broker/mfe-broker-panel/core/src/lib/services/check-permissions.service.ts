import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationContextModel } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { getPanelUser } from '../state/panel-user.selectors';
import { CheckPermissionsServiceInterface, PermissionContextService, CheckPermissionsInterface } from '@close-front-office/mfe-broker/core';

/**
 * Service that allows to check if a user has the appropriate permissions
 */
@Injectable({
  providedIn: 'root',
})
export class CheckPermissionsService implements OnDestroy, CheckPermissionsServiceInterface {
  private intermediaryId!: string;
  private firmId?: string | null;
  private permissions!: any;
  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store, private permissionContextService: PermissionContextService) {
    this.store.pipe(select(getPanelUser), takeUntil(this.onDestroy$)).subscribe((reduxData: AuthorizationContextModel) => {
      this.intermediaryId = reduxData?.intermediaryId as string;
      this.firmId = reduxData?.firmId;
      this.permissions = reduxData?.permission;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  public checkPermissions({ section, features }: CheckPermissionsInterface): boolean {
    return this.hasAtLeastOnePermission(section, features);
  }

  /**
   * Compares the passed in section and features with the permissions
   * of the logged-in user in that specific section and the permission features array of the section key
   *
   * Returns a boolean if the user has permission for at least one passed in feature.
   *
   * @param section
   * @param features
   */
  private hasAtLeastOnePermission(section: string, features: string[]): boolean {
    const sectionPermissions = this.permissions?.[section];
    const currentFirmId: string = this.permissionContextService.getCurrentFirmContext();
    const currentIntermediaryId: string = this.permissionContextService.getCurrentIntermediaryContext();

    return features.some(permission => {
      return sectionPermissions?.find((value: string) => {
        if (section === 'firms' && permission === 'firm') return this.firmId === currentFirmId;
        if (permission === 'me') return permission === value && this.intermediaryId === currentIntermediaryId;
        if (permission === 'others') return permission === value && this.intermediaryId !== currentIntermediaryId;
        return permission === value;
      });
    });
  }
}
