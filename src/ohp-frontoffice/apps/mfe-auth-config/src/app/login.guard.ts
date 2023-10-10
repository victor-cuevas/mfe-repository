import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthManagementService, ConfigContextService } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authManagementService: AuthManagementService, private router: Router, private configService: ConfigContextService) {}

  canActivate(): Promise<boolean> {
    return this.authManagementService.checkAuthenticatedUser().then(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([this.configService.getDefaultRoute()]);
      }
      return !isLoggedIn;
    });
  }
}
