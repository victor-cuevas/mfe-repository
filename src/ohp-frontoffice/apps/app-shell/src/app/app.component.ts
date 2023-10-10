import { Component } from '@angular/core';
import { AuthenticatorService, translations } from '@aws-amplify/ui-angular';
import { ConfigContextService } from '@close-front-office/shared/config';
import { Auth, I18n } from 'aws-amplify';

I18n.putVocabularies(translations);

const notWhitespaceErr =
  "2 validation errors detected: Value at 'userAlias' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+; Value at 'userName' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+";
const notWhitespaceMsgEn = 'Username cannot have whitespace.';
const notWhitespaceMsgEs = 'El nombre de usuario no puede tener espacios en blanco.';
const notWhitespaceMsgNl = 'Gebruikersnaam mag geen spaties bevatten.';

I18n.putVocabularies({
  en: {
    [notWhitespaceErr]: [notWhitespaceMsgEn],
  },
  es: {
    [notWhitespaceErr]: [notWhitespaceMsgEs],
  },
  nl: {
    [notWhitespaceErr]: [notWhitespaceMsgNl],
  },
});

@Component({
  selector: 'close-front-office-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public logoPath : string;
  constructor(public authenticator: AuthenticatorService,public commonService: ConfigContextService) {
  const configcontext = this.commonService.getConfigContext();
  this.logoPath = configcontext.LOGO_PATH;
  }

  services = {
    async handleSignIn(formData: Record<string, any>) {
      const { username, password } = formData;

      return Auth.signIn({
        username,
        password,
      });
    },
  };
}
