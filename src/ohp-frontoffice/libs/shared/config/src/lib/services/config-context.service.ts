import { Injectable } from '@angular/core';
import { ConfigContextModel, MfeModel } from '../models/configContext.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigContextService {
  private configContext!: ConfigContextModel;

  setConfigContext(configContext: ConfigContextModel) {
    this.configContext = configContext;
  }

  getConfigContext(): ConfigContextModel {
    return this.configContext;
  }

  getDefaultRoute(): string {
    return this.configContext.DEFAULT_ROUTE;
  }

  getDefaultConfigRoute(): MfeModel {
    let defaultMfeConfig = this.configContext?.REMOTE_MFES.find(item => item.path === this.configContext.DEFAULT_CONFIG_ROUTE) as MfeModel;
    if(defaultMfeConfig === undefined) {
      const mfe = {} as MfeModel;
      mfe.remoteUrl = this.configContext?.DEFAULT_CONFIG_ROUTE;
      defaultMfeConfig = mfe;
    }
    return defaultMfeConfig;
  }

  getMfeApiUrl(mfeName: string): string {
    return this.configContext?.REMOTE_MFES.find(item => item.path === mfeName)?.apiUrl as string;
  }
}
