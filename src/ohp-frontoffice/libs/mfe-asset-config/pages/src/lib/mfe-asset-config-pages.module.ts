import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DecimalTransformPipe, SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls'
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ManageIndexationComponent } from './components/manage-indexation/manage-indexation.component';
import { IndexationService } from './service/indexation.service';
import { ManageIndexationResolver } from './resolver/manage-indexation.resolver';
import { ConfigContextService } from '@close-front-office/shared/config';

const routes: Routes = [
  {
    path: '',
    component: ManageIndexationComponent,
    resolve: { IndexationData: ManageIndexationResolver }
  },
  {
    path: 'manage-indexation',
    component: ManageIndexationComponent,
    resolve: { IndexationData: ManageIndexationResolver }
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule, TranslateModule],
  declarations: [
    ManageIndexationComponent
  ],
  providers: [IndexationService, DatePipe, DecimalTransformPipe]
})
export class MfeAssetConfigPagesModule {
  constructor(private configService: ConfigContextService){
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'asset');
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
