import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StipulationStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { GenericStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'cfo-document-status',
  templateUrl: './document-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentStatusComponent {
  public statusEnum = GenericStatus;
  @Input() stipulationStatus?: StipulationStatus | null;
}
