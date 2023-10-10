import {
    Directive,
    HostListener,
    Input,
    Optional,
    EventEmitter,
    Output,
    ElementRef,
    OnChanges,
  } from '@angular/core';
  import { NgModel, NgControl } from '@angular/forms';
  
  @Directive({
    selector: '[cfcFluidInitialFormatter]',
    providers: [NgModel],
  })
  export class FluidInitialFormatterDirective implements OnChanges {
    element: HTMLInputElement;
  
    @Output() ngModelChange = new EventEmitter();
    @Input() initialMask: any;
  
    constructor(
      @Optional() public model: NgModel,
      elementRef: ElementRef,
      private ngModel: NgControl
    ) {
      this.model = model;
      this.element = elementRef.nativeElement;
    }
  
    ngOnChanges(changes:any) {
      if (changes.closeFluidInitialMask) {
        if (this.initialMask) {
          const currentValue = this.updateControlValues(this.initialMask);
          this.ngModelChange.emit(currentValue);
          setTimeout(() => {
            this.element.value = currentValue;
          }, 100);
        }
      }
    }
  
    @HostListener('blur', ['$event.target.value'])
    onBlur(viewValue: string) {
      this.ngModelChange.emit(this.updateControlValues(viewValue));
    }
  
    updateControlValues(value: string) {
      if (value) {
        const regexp = /^([A-Z]\.{1,1})+$/;
        if (!regexp.test(value)) {
          value = value.split('.').join('');
          value = value.replace(/ /g, '').toUpperCase().split('').join('.');
          value = value + '.';
        }
      }
      return value;
    }
  
    writeValue(value: string | number): void {
      if (this.model && this.model.name) {
        this.model.valueAccessor?.writeValue(value);
      } else {
        this.element.value = value.toString();
      }
    }
  }
  