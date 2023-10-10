import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckPermissionsInterface, CheckPermissionsServiceInterface, PERMISSIONS } from '../mfe-broker-core.module';

/**
 * Can Activate guard that checks if the logged-in user has the appropriate permissions
 * to enter the route. Takes a section as string and features as array of strings from the data on the route
 * and compares it with the permissions of the logged-in user.
 */
@Injectable({
  providedIn: 'root',
})
export class CheckPermissionsGuard implements CanActivate, Resolve<boolean> {
  constructor(@Inject(PERMISSIONS) private permissionsService: CheckPermissionsServiceInterface, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const { section, features, neededPermission } = this.getPermission(route);
    const isPanel = window.location.href.includes('panel');

    if (this.permissionsService.checkPermissions({ section, features, neededPermission })) {
      return true;
    }
    this.router.navigate([`${isPanel ? 'panel' : 'broker'}/not-found`], { skipLocationChange: true });
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { section, features, neededPermission } = this.getPermission(route);

    if (this.permissionsService.checkPermissions({ section, features, neededPermission })) {
      return true;
    }
    this.router.navigate(['broker/not-found'], { skipLocationChange: true });
    return false;
  }

  private getPermission(route: ActivatedRouteSnapshot): CheckPermissionsInterface {
    const section: string = route.data['section'] || '';
    const features: string[] = route.data['features'] || ['view'];
    const neededPermission: string = route.data['assistantPermission'] || '';

    return { section, features, neededPermission };
  }
}
