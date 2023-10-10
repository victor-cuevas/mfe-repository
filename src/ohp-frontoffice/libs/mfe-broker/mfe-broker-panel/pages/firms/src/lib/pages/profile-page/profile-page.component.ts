import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';

@Component({
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  breadcrumbItems: MenuItem[] = [
    { label: this.translate.instant('general.buttons.back'), routerLink: '../..', icon: 'pi pi-chevron-left' },
  ];

  constructor(private translate: TranslateService) {}
}
