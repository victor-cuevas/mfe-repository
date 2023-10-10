import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';

@Injectable({
  providedIn: 'root',
})
export class ReadOnlyModeResolver {
  constructor(@Inject(PERMISSIONS) private checkPermissionsService: CheckPermissionsServiceInterface) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const { section, features } = this.getPermission(route);

    return this.checkPermissionsService.checkPermissions({ section, features });
  }

  private getPermission(route: ActivatedRouteSnapshot) {
    const section: string = route.data['section'] || '';
    const features: string[] = route.data['lenderFeatures'] || ['viewer'];

    return { section, features };
  }
}
