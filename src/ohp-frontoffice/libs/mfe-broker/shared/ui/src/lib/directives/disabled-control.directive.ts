import { Directive, Input, OnChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[cfoDisableControl]',
})
export class DisableControlDirective implements OnChanges {
  @Input() cfoDisableControl: any;
  constructor(private ngControl: NgControl) {}

  ngOnChanges(changes: any) {
    if (changes['cfoDisableControl']) {
      const action = this.cfoDisableControl ? 'disable' : 'enable';
      if (this.ngControl.control) {
        this.ngControl.control[action]();
      }
    }
  }
}
