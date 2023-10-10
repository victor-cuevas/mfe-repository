import { Component, Input } from '@angular/core';

import { IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  selector: 'cfo-linked-advisors',
  templateUrl: './linked-advisors.component.html',
})
export class LinkedAdvisorsComponent {
  @Input() title!: string;
  @Input() intermediaryName?: string;
  @Input() advisors!: IntermediarySummary[];

  constructor() {}
}
