import {
  Directive,
  HostListener,
  AfterViewChecked,
  ElementRef,
  OnInit,
  Input,
} from '@angular/core';
import { NgModel, NgControl } from '@angular/forms';
import { FluidFormatIBANPipe } from '../Pipes/fluid-format-iban.pipe';

@Directive({ selector: '[cfcFluidIbanFormatter]' })
export class FluidIBANFormatterDirective implements OnInit {
  model: NgModel;
  isFocus!: boolean;
  element: HTMLInputElement;
  private ibanPipe: FluidFormatIBANPipe;
  constructor(
    model: NgModel,
    elementRef: ElementRef,
    private control: NgControl
  ) {
    this.model = model;
    this.element = elementRef.nativeElement;
    this.ibanPipe = new FluidFormatIBANPipe();
  }

  private _selected: any;
  @Input()
  set player(value: any) {
   
    this._selected = { ...value };
    if (value && !this.isFocus) {
      this.element.value = this.ibanPipe.transform(value);
      this.updateControlValues(value);
    }
  }
  get player(): any {
    return this._selected;
  }

  ngOnInit() {
    if (this.model && this.model.name) {
      this.model.control.valueChanges.subscribe((value: string | number) => {
        if (value === this.model.model) {
          this.writeValue(this.ibanPipe.transform(this.model.model));
        }
      });
    }
  }

  ngOnChanges() {
    if (this.element.value) {
      const viewValue = this.element.value.toString().replace(/\s/g, '');
      if (viewValue == "") {
        this.element.value = this.ibanPipe.transform(viewValue);
      }
      this.updateControlValues(this.element.value);
    }
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.isFocus = true;
    this.element.value = this.ibanPipe.transformback(value);
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(viewValue: string) {
    this.isFocus = false;
    viewValue = viewValue.toString().replace(/\s/g, '');
    this.element.value = this.ibanPipe.transform(viewValue);
    this.updateControlValues(viewValue);
  }

  updateControlValues(value: string) {
    if (this.ibanPipe.transform(value)) {
      this.model.viewToModelUpdate(value);
      return true;
    } else {
      this.model.viewToModelUpdate(null);
      if (this.control.control) {
        this.control.control.setValue(null);
      }
      return false;
    }
  }

  writeValue(value: string | number): void {
    if (this.model && this.model.name) {
      this.model.valueAccessor?.writeValue(value);
    } else {
      this.element.value = value.toString();
    }
  }
}
