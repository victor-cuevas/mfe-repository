import { Component, Input } from '@angular/core';

@Component({
  selector: 'mbp-summary-card',
  templateUrl: './summary-card.component.html',
})
export class SummaryCardComponent {
  @Input() header = '';

  constructor() {}
}
