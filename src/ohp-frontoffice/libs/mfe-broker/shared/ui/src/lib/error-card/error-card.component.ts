import { Component, Input } from '@angular/core';

@Component({
  selector: 'cfo-error-card',
  templateUrl: './error-card.component.html',
})
export class ErrorCardComponent {
  @Input() title = '';
  @Input() detail = '';
}
