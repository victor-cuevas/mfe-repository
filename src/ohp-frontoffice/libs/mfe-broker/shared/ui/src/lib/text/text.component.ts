import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'cfo-text',
  templateUrl: 'text.component.html',
})
export class TextComponent implements AfterViewInit {
  @Input() value!: string;
  @Input() isTruncated?: boolean;
  @Input() useTooltip?: boolean;
  @Input() tooltipPosition = 'top';
  @Input() tooltipStyleClass = '';

  @ViewChild('valueWrapper') valueWrapper!: ElementRef;

  tooltip = '';

  constructor() {}

  ngAfterViewInit(): void {
    if (this.useTooltip && this.valueWrapper?.nativeElement.offsetWidth < this.valueWrapper?.nativeElement.scrollWidth) {
      this.tooltip = this.value;
    }
  }
}
