import {
    Directive,
    ElementRef,
    Renderer2,
    HostListener,
    Input,
    Output,
    EventEmitter,
  } from '@angular/core';
  import { DecimalPipe } from '@angular/common';
  @Directive({
    selector: '[cfcFluidPercentageMask]',
  })
  export class FluidPercentageMaskDirective {
    @Input() locale!: string;
    @Input() percentageFormat!: string;
    @Output() ngModelChange = new EventEmitter();
    currentValue: any;
    constructor(
      private renderer: Renderer2,
      private el: ElementRef,
      private decimalPipe: DecimalPipe
    ) {
      renderer.addClass(el.nativeElement, 'text-right');
    }
  
    @HostListener('keypress', ['$event']) onKeyPress(event: any) {
      if ([13].indexOf(event.keyCode) !== -1) {
        return;
      }
      if (
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && // Only in firefox
        ([46, 8, 9].indexOf(event.keyCode) !== -1 ||
          (event.keyCode >= 33 && event.keyCode <= 40) || // Allow Home, End, Page up and Page down
          event.ctrlKey ||
          event.metaKey)
      ) {
        return;
      }
    }
    @HostListener('keydown', ['$event']) onKeyDown(event: any) {
      if (
        !(
          (event.keyCode >= 48 && event.keyCode <= 57) ||
          (event.keyCode >= 96 && event.keyCode <= 105) || //Allow numbers
          event.keyCode === 190 ||
          event.keyCode === 110 || //Allow .
          event.keyCode === 188 || //Allow ,
          event.keyCode === 8 || //Allow backspace
          event.keyCode === 46 || //Allow delete
          event.keyCode === 37 || //Allow left arrow
          event.keyCode === 39
        )
      ) {
        //Allow right arrow
        event.preventDefault();
      }
  
      if (event.key === '.' || event.key === ',') {
        //Restrict  multiple occurences of dot and comma
        if (
          event.target.value.includes('.') ||
          event.target.value.includes(',')
        ) {
          event.preventDefault();
        }
        //Restrict entering dot and comma at start of input
        if (event.target.selectionStart === 0) {
          event.preventDefault();
        }
      }
      //restrict two decimals
      if (event.target.value.includes('.') || event.target.value.includes(',')) {
        if (event.target.value.split(/[.|,]/)[1].length > 1) {
          if (
            !(
              event.keyCode === 8 || //Allow backspace
              event.keyCode === 46 || //Allow delete
              event.keyCode === 37 || //Allow left arrow
              event.keyCode === 39
            )
          )
            event.preventDefault();
        }
      }
    }
    @HostListener('blur', ['$event']) onBlur(event: any) {
      const value = this.isDefaultDecimalType(event.target.value);
      if (event.target && event.target.value && value) {
        this.currentValue = this.decimalPipe.transform(
          value,
          this.percentageFormat,
          'en-US'
        );
        this.ngModelChange.emit(this.currentValue); //bind value to model
  
        setTimeout(() => {
          event.target.value = this.decimalPipe.transform(
            value,
            this.percentageFormat,
            this.locale
          ); //transform to locale
        }, 1);
      }
    }
    //change to universal decimal format
    isDefaultDecimalType(value:any) {
      if (value && isNaN(value)) {
        if (value.includes(',')) {
          if (value.match(',').length === 1 && !value.includes('.')) {
            //if comma used as decimal separator (i.e., 1,65 => 1.65)
            const tempValue = value.replace(',', '.');
            return tempValue.replace(/\s/, ''); // due to locale transform empty spaces get added => this removes the empty spaces
          } else {
            const tempValue = value.replaceAll(',', ''); //if comma used as integer separator (i.e, 1,00,000.00)
            return tempValue.replaceAll(/\s/, ''); // due to locale transform empty spaces get added => this removes the empty spaces
          }
        }
      } else if (/\s/.test(value)) {
        return value.replaceAll(/\s/, ''); // due to locale transform empty spaces get added => this removes the empty spaces
      } else {
        return value;
      }
    }
  }
  