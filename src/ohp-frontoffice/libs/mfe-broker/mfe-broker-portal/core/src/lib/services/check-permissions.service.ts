import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getPortalUser } from '../state/portal-user';
import { CheckPermissionsInterface, CheckPermissionsServiceInterface, PermissionContextService } from '@close-front-office/mfe-broker/core';
import { AuthorizationContextModel, IntermediarySummary, PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

type RoleNumericMapping = {
  [value in PortalPermissionType]: number;
};

export const RoleMappingsPermissions = {
  [PortalPermissionType.View]: 1,
  [PortalPermissionType.Illustration]: 2,
  [PortalPermissionType.DecisionInPrinciple]: 3,
  [PortalPermissionType.FullMortgageApplication]: 4,
} as RoleNumericMapping;

/**
 * Service that allows to check if a user has the appropriate permissions
 */
@Injectable({
  providedIn: 'root',
})
export class CheckPermissionsService implements OnDestroy, CheckPermissionsServiceInterface {
  private intermediaryId!: string;
  private permissions!: any;
  private roleMappings: IntermediarySummary[] = [];
  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store, private permissionContextService: PermissionContextService) {
    this.store.pipe(select(getPortalUser), takeUntil(this.onDestroy$)).subscribe((reduxData: AuthorizationContextModel | undefined) => {
      this.intermediaryId = reduxData?.intermediaryId as string;
      this.permissions = reduxData?.permission;
      this.roleMappings = reduxData?.roleMappings as IntermediarySummary[];
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  public checkPermissions({ section, features, neededPermission }: CheckPermissionsInterface): boolean {
    const assigneeId: string = this.permissionContextService.getAssigneeContext();

    return this.hasAtLeastOnePermission(section, features, assigneeId) || this.isAllowedForAssignee(assigneeId, neededPermission);
  }

  /**
   * Looks for the assigneeId in the roleMappings
   * of the logged-in user and checks if the permissions are enough for the
   * action he is trying to perform
   *
   * Returns a boolean if the user has permission for the assignee in the current scope.
   *
   * @param assigneeId
   * @param neededPermission
   */
  public isAllowedForAssignee(assigneeId: string = '', neededPermission: string = ''): boolean {
    let advisor = this.roleMappings.find(item => item.brokerId === assigneeId);

    if (!advisor && assigneeId === this.intermediaryId) {
      advisor = this.roleMappings.find(rm => rm.isActive && rm.permission && RoleMappingsPermissions[rm.permission] > 1);
    }

    if (advisor && this.permissions.assistants.includes('support') && advisor?.permission) {
      const permissionMapped: number = RoleMappingsPermissions[advisor?.isActive ? advisor.permission : PortalPermissionType.View];

      if (permissionMapped) {
        const neededPermissionMapped: number = RoleMappingsPermissions[neededPermission as PortalPermissionType];
        return permissionMapped >= neededPermissionMapped;
      }
    }
    return false;
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
  private hasAtLeastOnePermission(section: string, features: string[], assigneeId: string | undefined): boolean {
    const sectionPermissions = this.permissions?.[section];

    return features.some(permission => {
      return sectionPermissions?.find((value: string) => {
        if (permission === 'assignee' && assigneeId) return permission === value && assigneeId === this.intermediaryId;
        return permission === value;
      });
    });
  }
}
