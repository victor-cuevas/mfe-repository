import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HeaderLogoComponent } from './components/header-logo/header-logo.component';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
import { HeaderModulesComponent } from './components/header-modules/header-modules.component';
import { HeaderNotificationsComponent } from './components/header-notifications/header-notifications.component';
import { HeaderUserInfoComponent } from './components/header-user-info/header-user-info.component';
import { HeaderComponent } from './header.component';
import { PipesModule } from '@close-front-office/mfe-broker/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    MenubarModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    OverlayPanelModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    PipesModule,
  ],
  declarations: [
    HeaderComponent,
    HeaderLogoComponent,
    HeaderMenuComponent,
    HeaderModulesComponent,
    HeaderNotificationsComponent,
    HeaderUserInfoComponent,
  ],
  exports: [
    HeaderComponent,
    HeaderLogoComponent,
    HeaderMenuComponent,
    HeaderModulesComponent,
    HeaderNotificationsComponent,
    HeaderUserInfoComponent,
  ],
})
export class SharedHeaderModule {}
