import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { SeveritiesEnum } from './enums/severities.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  SEVERITIES: typeof SeveritiesEnum = SeveritiesEnum;

  constructor(private messageService: MessageService) {}

  clearMessages() {
    this.messageService.clear();
  }

  showMessage({
    key = 'root',
    summary = '',
    severity = this.SEVERITIES.SUCCESS,
    detail = '',
    sticky = false,
    contentStyleClass = 'd-flex justify-content-between align-items-center',
    life = 3000,
  }: Message): void {
    this.messageService.add({
      key,
      severity,
      summary,
      detail,
      sticky,
      contentStyleClass,
      life,
    });
  }
}
