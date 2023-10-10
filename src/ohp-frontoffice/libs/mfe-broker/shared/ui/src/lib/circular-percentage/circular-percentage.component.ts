import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cfo-circular-percentage',
  templateUrl: './circular-percentage.component.html',
})
export class CircularPercentageComponent implements OnInit {
  @Input() percentage!: number;
  @Input() percentageLabel = '';
  @Input() doneLabel = '';
  @Input() missingLabel = '';

  strokeDasharray = '0';

  constructor() {}

  ngOnInit(): void {
    this.strokeDasharray = `${this.percentage} ${100 - this.percentage}`;
  }
}
