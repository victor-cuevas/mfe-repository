import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'close-front-office-lender-user-details',
  templateUrl: './lender-user-details.component.html',
})
export class LenderUserDetailsComponent {
  breadcrumbItems: MenuItem[] = [{ label: this.translate.instant('general.buttons.back'), routerLink: '..', icon: 'pi pi-chevron-left' }];

  constructor(private translate: TranslateService) {}
}
