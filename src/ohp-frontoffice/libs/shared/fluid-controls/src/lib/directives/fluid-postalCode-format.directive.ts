import {
    Directive,
    HostListener,
    Input,
    EventEmitter,
    Output,
    ElementRef,
    OnInit,
    OnChanges,
  } from '@angular/core';
  import { NgModel, NgControl } from '@angular/forms';
  
  
  @Directive({ selector: '[cfcFluidPostalCodeFormatter]' })
  export class FluidPostalCodeFormatterDirective implements OnInit, OnChanges {
    model: NgModel;
    element: HTMLInputElement;
    regexCountrycode = /^([A-Za-z]){2}$/;
    regexPostalCode = /^([0-9]){1,4}$/;
  
    @Output() ngModelChange = new EventEmitter();
    @Input() closeFluidPostCodeMask: any;
  
    constructor(
      model: NgModel,
      elementRef: ElementRef,
      private control: NgControl
    ) {
      this.model = model;
      this.element = elementRef.nativeElement;
    }
  
    ngOnInit() {
      if (this.model && this.model.name) {
        console.log(this.model);
      }
    }
  
    ngOnChanges(changes: any) {

      if (this.closeFluidPostCodeMask) {
        const elementValue = this.closeFluidPostCodeMask
          .toString()
          .replace(/\s/g, '');
        const postalcode = elementValue.substring(0, 4);
        const countrycode = elementValue.substring(4, elementValue.length);
        if (
          this.regexPostalCode.test(postalcode) &&
          this.regexCountrycode.test(countrycode)
        ) {
          this.ngModelChange.emit(
            this.updateControlValues(this.closeFluidPostCodeMask)
          );
          setTimeout(() => {
            this.element.value = this.updateControlValues(
              this.closeFluidPostCodeMask
            );
          }, 100);
        } else {
          this.control.control?.setErrors({
            invalidPostalCode: true,
          });
        }
      }
    }
  
    @HostListener('blur', ['$event.target.value'])
    onBlur(viewValue: string) {
      const elementValue = viewValue.toString().replace(/\s/g, '');
      const postalcode = elementValue.substring(0, 4);
      const countrycode = elementValue.substring(4, elementValue.length);
      if (this.element.value != '' && this.element.value) {
        if (
          this.regexPostalCode.test(postalcode) &&
          this.regexCountrycode.test(countrycode)
        ) {
          this.ngModelChange.emit(
            this.updateControlValues(viewValue).replace(/\s/g, '')
          );
          setTimeout(() => {
            this.element.value = this.updateControlValues(viewValue);
          }, 1);
        } else {
          this.control.control?.setErrors({
            invalidPostalCode: true,
          });
        }
      }
    }
  
    updateControlValues(value: string)   {
      if (value) {
        if (value) {
          if (value.length >= 6) {
            value = value.replace(/ /g, '').toUpperCase().substring(0, 6);
          }
          const postalcode = value.substring(0, 4);
          if (postalcode.match(this.regexPostalCode)) {
            value = value.replace(/(?=.{2}$)/, ' ');
          }
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
  