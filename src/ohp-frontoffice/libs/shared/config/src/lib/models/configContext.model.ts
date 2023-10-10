export interface ConfigContextModel {
  AWS: any;
  DATADOG?: DatadogConfigModel;
  CLIENT?: string;
  STAGE?: string;
  REMOTE_MFES: MfeModel[];
  DEFAULT_ROUTE: string;
  DEFAULT_CONFIG_ROUTE: string;
  LOGO_PATH: string;
}

export interface CognitoInfoModel {
  loginUrl: string;
  logoutUrl: string;
}

export interface MfeModel {
  path: string;
  remoteUrl: string;
  remoteName: string;
  exposedModule: string;
  ngModuleName: string;
  apiUrl: string;
}

export interface DatadogConfigModel {
  applicationId: string;
  clientToken: string;
  site: string;
  service: string;
  env: string;
  version: string;
  sampleRate: number;
  trackInteractions: boolean;
}
