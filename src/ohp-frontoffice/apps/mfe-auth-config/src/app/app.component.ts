import { Component } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-auth-config/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mfe-auth-config';

  public logoPath : string;
  constructor(public spinnerservice: SpinnerService, public authenticator: AuthenticatorService, public commonService : ConfigContextService) {
    const configcontext = this.commonService.getConfigContext();
    this.logoPath = configcontext.LOGO_PATH;
  }
}
