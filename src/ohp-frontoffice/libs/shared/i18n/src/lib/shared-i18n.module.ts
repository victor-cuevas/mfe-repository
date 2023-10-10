import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

export interface TranslateConfig {
  path: string;
  mfeName?: string;
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: SharedI18nModule.HttpLoaderFactory,
        deps: [HttpBackend, ConfigContextService],
      },
      isolate: true,
      defaultLanguage: 'en',
    }),
  ],
  exports: [TranslateModule],
})
export class SharedI18nModule {
  static path: string | undefined;
  static mfeName: string | undefined;

  public static HttpLoaderFactory(httpHandler: HttpBackend, configContextService: ConfigContextService) {
    let remoteUrl;
    if (SharedI18nModule.mfeName) {
      remoteUrl = (configContextService.getConfigContext()?.REMOTE_MFES.find(item => item.path === SharedI18nModule.mfeName) as MfeModel)
        .remoteUrl;
    }

    return new TranslateHttpLoader(new HttpClient(httpHandler), (remoteUrl || '') + SharedI18nModule.path, '.json');
  }

  public static forRoot(config: TranslateConfig): ModuleWithProviders<SharedI18nModule> {
    SharedI18nModule.path = config.path;
    SharedI18nModule.mfeName = config.mfeName;
    return {
      ngModule: SharedI18nModule,
      providers: [],
    };
  }

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
