import {
    Directive,
    ElementRef,
    Renderer2,
    HostListener,
    Input,
  } from '@angular/core';
  
  @Directive({
    selector: '[cfcFluidDigitsOnly]',
  })
  export class FluidDigitsOnlyDirective {
    @Input() allowNegative = false;
  
    nonNegativePattern = /^[0-9]*$/g;
    negativePattern = /^-?[0-9]*$/g;
    constructor(private renderer: Renderer2, private el: ElementRef) {
      renderer.addClass(el.nativeElement, 'text-right');
    }
    @HostListener('paste', ['$event'])
    onPaste(event:any) {
      // Don't allow pasted text that contains non-numerics
      const clp = (event.originalEvent || event).clipboardData;
      const pastedText = clp
        ? clp.getData('text/plain')
        : (window as any).clipboardData.getData('text');
      if (pastedText) {
        const regEx = new RegExp(
          this.allowNegative ? this.negativePattern : this.nonNegativePattern
        );
        if (!regEx.test(pastedText)) {
          event.preventDefault();
        }
      }
    }
  
    @HostListener('keypress', ['$event']) onKeyDown(event: any) {
      if ([13].indexOf(event.keyCode) !== -1) {
        return;
      }
  
      if (
        (event.key === '-' &&
          (event.target.selectionStart !== 0 ||
            event.target.value.indexOf('-') >= 0)) ||
        (event.key !== '-' &&
          event.target.selectionStart <= event.target.value.indexOf('-'))
      ) {
        event.preventDefault();
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
  
      this.allowNegative
        ? (this.negativePattern.lastIndex = 0)
        : (this.nonNegativePattern.lastIndex = 0);
      if (
        this.allowNegative
          ? !this.negativePattern.test(event.key)
          : !this.nonNegativePattern.test(event.key)
      ) {
        event.preventDefault();
      }
    }
  }
  