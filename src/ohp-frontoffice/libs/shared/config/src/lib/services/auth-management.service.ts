import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Auth } from 'aws-amplify';
import { ConfigContextService } from './config-context.service';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Injectable({
  providedIn: 'root',
})
export class AuthManagementService {
  timeoutId: null | ReturnType<typeof setTimeout> = null;
  isPrdOrAcc = false;

  constructor(private router: Router, private authenticatorService: AuthenticatorService, private configService: ConfigContextService) {
    const stage = this.configService.getConfigContext().STAGE;
    this.isPrdOrAcc = stage === 'prd' || stage === 'acc';
  }

  logout() {
    this.authenticatorService.signOut();
  }

  async globalLogOut() {
    Auth.signOut({ global: true })
      .then(() => this.router.navigate(['/']))
      .catch(error => {
        console.log(`Error logging out: ${error}`);
      });
  }

  checkAuthenticatedUser(): Promise<boolean> {
    return Auth.currentAuthenticatedUser().then(
      () => {
        return true;
      },
      error => {
        console.log(error);
        return false;
      },
    );
  }

  changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return Auth.currentAuthenticatedUser().then(user => Auth.changePassword(user, oldPassword, newPassword));
  }

  checkTimeOut(timeOutPeriod: number) {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    if (CONFIGURATION_MOCK.HAS_AUTO_LOGOUT && this.isPrdOrAcc) this.timeoutId = setTimeout(() => this.globalLogOut(), timeOutPeriod);
  }
}
