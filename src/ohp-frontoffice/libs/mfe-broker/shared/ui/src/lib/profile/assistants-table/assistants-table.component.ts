import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable, of } from 'rxjs';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediaryRole } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { permissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'cfo-assistants-table',
  templateUrl: './assistants-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantsTableComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  intermediaryRole: typeof IntermediaryRole = IntermediaryRole;
  totalRecords!: number;
  pageSize = 10;

  permissionsOptions = permissionType;

  @Input() title!: string;
  @Input() assistants$: Observable<IntermediarySummary[]> = of([]);
  @Input() intermediaryId!: string;
  @Output() changeCollaboration = new EventEmitter<any>();
  @Output() unlink = new EventEmitter<string>();
  @Input() readOnly!: boolean;

  onChangeCollaboration(event: any, brokerId: string | null) {
    this.changeCollaboration.emit({ collaboration: event.value, brokerId });
  }

  onUnlink(brokerId: string) {
    this.unlink.emit(brokerId);
  }
}
