import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MetaResolver } from './services/helpers/meta.resolver';
import { SharedConfigModule } from '@close-front-office/shared/config';
import { ClientConfigService } from './services/helpers/client-config.service';

@NgModule({
  imports: [CommonModule, RouterModule, SharedConfigModule],
  providers: [MetaResolver, ClientConfigService],
})
export class SharedCoreModule {}
