import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutComponent } from './components/layout/layout.component';
import { PipesModule } from '@close-front-office/mfe-broker/core';
import { RootLayoutComponent } from './components/root-layout/root-layout.component';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import { SharedHeaderModule } from './components/header/shared-header.module';

const modules = [
  FormsModule,
  PipesModule,
  ReactiveFormsModule,
  SharedHeaderModule,
  MfeBrokerSharedUiModule,
  TranslateModule,
  TranslateModule,
];

@NgModule({
  imports: [CommonModule, ...modules, MfeBrokerSharedUiModule],
  declarations: [RootLayoutComponent, LayoutComponent],
  exports: [...modules, LayoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelSharedModule {}
