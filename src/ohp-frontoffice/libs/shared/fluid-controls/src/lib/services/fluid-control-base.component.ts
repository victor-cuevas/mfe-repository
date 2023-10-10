import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { FluidControlBase } from './fluid-control-base.interface';
import { ErrorDto } from '../models/models';
import { NgForm, ControlContainer } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cfc-fluid-control',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidControlBaseComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FluidControlBaseComponent
  extends FluidControlBase
  implements ControlValueAccessor
{
  @Input() form!: NgForm;
  @Input() name!: string;
  @Input() ControlConfig: any;
  @Input() MobilePattern: any;
  @Input() Type!: string;
  @Input() ButtonStyle!: string;
  @Input() OptionsLabel!: string;
  @Input() placeholder: string ;
  @Input() options: any;
  @Input() isReadOnly!: boolean;
  @Input() tabInputIndex!: number;
  @Input() maxlength!: number;
  @Input() minlength!: number;

  @Output() OnClick: EventEmitter<any> = new EventEmitter();
  @Output() OnBlur: EventEmitter<any> = new EventEmitter();
  @Output() ngModelChange = new EventEmitter();

  public defaultInnerValue: any = '';
  private innerValue: any = this.defaultInnerValue;
  private onTouchedCallback!: () => void;
  private onChangeCallback!: (_: any) => void;

  constructor() {
    super();
    this.maxlength=2147483647;
    this.placeholder='';
    
  }

  IsEnabled(): boolean {
    throw new Error('Method not implemented.');
  }
  IsRequired(): boolean {
    return this.ControlConfig.required && !this.isReadOnly;
  }
  HasRequiredValidation(): boolean {
    throw new Error('Method not implemented.');
  }
  OnClickEvent(event:any): void {
    this.OnClick.emit(event);
  }
  ValidateCustomError() {
    return this.ControlConfig.Errors.some((x: ErrorDto) => x.isShowValidation);
  }

 

  //The internal data model
 

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor

 

  //get accessor
  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
    this.OnBlur.emit();
  }

  //From ControlValueAccessor interface

  writeValue(value: any) {
    //if (value !== this.innerValue) {
    //  this.innerValue = value;
    //  if (value != null) {
    //    this.onChangeCallback(value);
    //  }
    //}
    if (value !== null && value !== '') {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
