import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PermissionContextService } from '@close-front-office/mfe-broker/core'; // TODO

@Injectable({
  providedIn: 'root',
})
export class FirmResolver {
  constructor(private permissionContextService: PermissionContextService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | void {
    this.permissionContextService.setCurrentFirmContext(route.paramMap.get('id') || '');
    return;
  }
}
