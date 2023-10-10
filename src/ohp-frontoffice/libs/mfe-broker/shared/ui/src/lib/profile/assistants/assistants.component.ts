import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { permissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { IntermediaryRole, IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

import { DialogData } from '../../models/DialogData';
import { Observable, of } from 'rxjs';

interface AvailableIntermediarySummary extends IntermediarySummary {
  disabled?: boolean;
}

@Component({
  selector: 'cfo-assistants',
  templateUrl: './assistants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantsComponent implements OnInit {
  isAddModalOpen = false;
  searchResults: AvailableIntermediarySummary[] = [];
  unlinkModal: { isOpen: boolean; brokerId: string | null } = { isOpen: false, brokerId: null };
  unlinkModalData: DialogData = {
    type: 'success',
    icon: 'pi pi-link',
    header: this.translate.instant('profile.labels.unlinkAssistant'),
    content: this.translate.instant('profile.labels.unlinkAssistantMsg'),
  };
  selectedAssistant: IntermediarySummary | null = null;

  collaborationOptions = permissionType;
  portalIntermediaryRole = IntermediaryRole;

  @Input() title!: string;
  @Input() intermediaryId!: string;
  @Input() intermediaryName?: string;
  @Input() assistants$: Observable<IntermediarySummary[]> = of([]);
  @Input() assistantsIds: string[] = [];
  @Input() searchResults$?: Observable<AvailableIntermediarySummary[]>;
  @Output() add = new EventEmitter<IntermediarySummary>();
  @Output() unlink = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() changeCollaboration = new EventEmitter<any>();
  @Input() readOnly!: boolean;

  constructor(private translate: TranslateService, private spinnerService: SpinnerService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.searchResults$?.subscribe(results => {
      this.searchResults = results.map(intermediary => ({
        ...intermediary,
        disabled: (intermediary.brokerId && this.assistantsIds.includes(intermediary.brokerId)) || false,
      }));
      this.cd.detectChanges();
    });
  }

  onSearch(query: string) {
    this.search.emit(query);
  }

  onSelect(assistant: any) {
    this.selectedAssistant = assistant;
  }

  onChangeCollaboration(event: any) {
    if (event.brokerId) {
      this.changeCollaboration.emit(event);
    } else if (this.selectedAssistant) {
      this.selectedAssistant.permission = event.value;
    }
  }

  onConfirmAdd() {
    if (!this.selectedAssistant?.permission) return;
    this.selectedAssistant && this.add.emit(this.selectedAssistant);
    this.isAddModalOpen = false;
    this.selectedAssistant = null;
  }

  onCancelAdd() {
    this.isAddModalOpen = false;
    this.selectedAssistant = null;
  }

  onUnlink(brokerId: string) {
    this.unlinkModal = { isOpen: true, brokerId };
  }

  onConfirmUnlink() {
    this.spinnerService.setIsLoading(true);
    this.unlinkModal.brokerId && this.unlink.emit(this.unlinkModal.brokerId);
    this.unlinkModal = { isOpen: false, brokerId: null };
  }

  onCancelUnlink() {
    this.unlinkModal = { isOpen: false, brokerId: null };
  }
}
