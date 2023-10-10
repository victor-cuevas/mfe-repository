import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mprdc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mfe-product-config';

  public logoPath : string;
  constructor(public spinnerService: SpinnerService, public authenticator: AuthenticatorService, public commonService : ConfigContextService) {
    const configcontext = this.commonService.getConfigContext();
    this.logoPath = configcontext.LOGO_PATH;
    
  }
}
