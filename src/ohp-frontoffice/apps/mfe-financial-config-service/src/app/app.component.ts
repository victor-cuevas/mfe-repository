import { Component } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { ConfigContextService } from '@close-front-office/shared/config';
@Component({
  selector: 'mfcs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mfe-financial-config-service';

  public logoPath : string;
  constructor(public spinnerservice: SpinnerService, public authenticator: AuthenticatorService, public commonService : ConfigContextService) {
    const configcontext = this.commonService.getConfigContext();
    this.logoPath = configcontext.LOGO_PATH;

  }
}
