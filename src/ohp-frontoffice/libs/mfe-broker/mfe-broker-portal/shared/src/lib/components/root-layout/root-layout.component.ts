import { Component, HostListener } from '@angular/core';
import { AuthManagementService } from '@close-front-office/shared/config';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  selector: 'mbp-root-layout',
  templateUrl: './root-layout.component.html',
})
export class RootLayoutComponent {
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    this.authManagement.checkTimeOut(CONFIGURATION_MOCK.TIME_AUTO_LOGOUT);
  }

  constructor(private authManagement: AuthManagementService) {
    this.checkUserActivity();
  }
}
