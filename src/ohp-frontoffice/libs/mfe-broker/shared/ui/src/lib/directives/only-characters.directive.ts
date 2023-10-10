import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[cfoOnlyCharacters]',
})
export class OnlyCharactersDirective {
  constructor(private el: ElementRef, private ngControl: NgControl) {}

  @Input() cfoOnlyCharacters: any;

  @HostListener('input', ['$event'])
  @HostListener('past', ['$event'])
  onInput() {
    const filteredValue = this.el.nativeElement.value.replace(
      /[^a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s'-]+/g,
      '',
    );
    this.ngControl?.control?.setValue(filteredValue);
  }
}
