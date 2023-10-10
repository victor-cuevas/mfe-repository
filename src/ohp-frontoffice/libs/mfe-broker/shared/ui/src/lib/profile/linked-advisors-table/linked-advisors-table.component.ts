import { Component, Input } from '@angular/core';

import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediaryRole, IntermediarySearchResultEntry } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { permissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'cfo-linked-advisors-table',
  templateUrl: './linked-advisors-table.component.html',
})
export class LinkedAdvisorsTableComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  intermediaryRole: typeof IntermediaryRole = IntermediaryRole;
  firmMembers: IntermediarySearchResultEntry[] = [];
  totalRecords!: number;
  pageSize = 10;

  collaborationOptions = permissionType;
  positionOptions = Object.keys(IntermediaryRole);

  @Input() title!: string;
  @Input() advisors!: IntermediarySummary[];

  constructor() {}
}
