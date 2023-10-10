import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthManagementService } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authManagementService: AuthManagementService) { }

  canActivate(): Promise<boolean> {
    return this.authManagementService.checkAuthenticatedUser();
  }
}
