import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionMeasureConfigComponent } from './components/collection-measure-config/collection-measure-config.component';
import { CollectionMeasureDossierStatusComponent } from './components/collection-measure-dossier-status/collection-measure-dossier-status.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { CollectionMeasureConfigResolver } from './components/collection-measure-config/Resolvers/collection-measure-config.resolver';
import { CollectionMeasureTypeResolver } from './components/collection-measure-config/Resolvers/collection-measure-type.resolver';
import { DossierStatusResolver } from './components/collection-measure-config/Resolvers/dossier-status.resolver';
import { FollowUpEventNameResolver } from './components/collection-measure-config/Resolvers/follow-up-event-name.resolver';
import { CloseMeasureIntervalTypeResolver } from './components/collection-measure-config/Resolvers/close-measure-interval-type.resolver';

const routes: Routes = [
  {
    path: '',
    component: CollectionMeasureConfigComponent,
    resolve: {
      collectionMeasureList: CollectionMeasureConfigResolver,
      collectionMeasureTypeList: CollectionMeasureTypeResolver,
      dossierStatusList: DossierStatusResolver,
      followUpEventNameList: FollowUpEventNameResolver,
      intervalTypeList : CloseMeasureIntervalTypeResolver
    }
  },
  {
    path: 'collection-measure-config',
    component: CollectionMeasureConfigComponent,
    resolve: {
      collectionMeasureList: CollectionMeasureConfigResolver,
      collectionMeasureTypeList: CollectionMeasureTypeResolver,
      dossierStatusList: DossierStatusResolver,
      followUpEventNameList: FollowUpEventNameResolver,
      intervalTypeList : CloseMeasureIntervalTypeResolver
    }
  },
  {
    path: 'collection-measure-dossier',
    component: CollectionMeasureDossierStatusComponent,
  },
  
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule,
    TranslateModule ],
  declarations: [CollectionMeasureConfigComponent, CollectionMeasureDossierStatusComponent],
  providers: [HttpClient]
})
export class MfeCollectionMeasureConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'collection-measure');
    if (mfeConfig) {
      const el = document.getElementById('whitelabel-config-styles');

      if (!el) {
        const headEl = document.getElementsByTagName('head')[0];
        const styleLinkEl = document.createElement('link');
        styleLinkEl.rel = 'stylesheet';
        styleLinkEl.id = 'whitelabel-config-styles';
        styleLinkEl.href = `${mfeConfig.remoteUrl}/whitelabel-config-styles.css`;
        headEl.appendChild(styleLinkEl);
      }
    }
  }
}
