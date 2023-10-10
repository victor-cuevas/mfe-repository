import { Component, Input } from '@angular/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'cfo-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() messages!: Message[];
  constructor() {}
}
