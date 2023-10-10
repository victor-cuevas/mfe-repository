import { Component } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mccs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mfe-communication-config-service';

  public logoPath : string;
  constructor(public spinnerService: SpinnerService,public authenticator: AuthenticatorService, public commonService : ConfigContextService) {
    const configcontext = this.commonService.getConfigContext();
    this.logoPath = configcontext.LOGO_PATH;

  }
}
