import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mtsc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mfe-tax-statement-config';

  public logoPath : string;
  constructor(public spinnerService: SpinnerService, public authenticator: AuthenticatorService, public commonService : ConfigContextService) {
    const configcontext = this.commonService.getConfigContext();
    this.logoPath = configcontext.LOGO_PATH;

  }
}
