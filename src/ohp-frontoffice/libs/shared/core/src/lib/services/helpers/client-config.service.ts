import { Injectable } from '@angular/core';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

type Config = Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class ClientConfigService {
  private configContext: Config = CONFIGURATION_MOCK;

  setClientConfig(clientConfig: Config) {
    this.configContext = clientConfig;
  }

  getConfig<T = Config>(key?: string): T | undefined {
    if (!key) return this.configContext as T;

    const keys = key.split('.');
    const config = this.recurseConfigAccess(keys, this.configContext);

    return config as T;
  }

  private recurseConfigAccess(keys: string[], config: Config): Config | undefined | null | unknown {
    const [accessor, ...rest] = keys;

    if (typeof config[accessor] !== 'object') return config[accessor];
    if (rest.length && config[accessor]) {
      return this.recurseConfigAccess(rest, config[accessor] as Config);
    }
    return config[accessor];
  }
}
