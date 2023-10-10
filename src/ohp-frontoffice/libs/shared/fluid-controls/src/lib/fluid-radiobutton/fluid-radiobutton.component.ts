import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  ViewChild,
  
} from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';
import {  NG_VALUE_ACCESSOR } from '@angular/forms';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';
import { ButtonType } from './fluid-radiobutton.model';

@Component({
  selector: 'cfc-fluid-radiobutton',
  templateUrl: './fluid-radiobutton.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidRadiobuttonComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FluidRadiobuttonComponent extends FluidControlBaseComponent {
  ButtonTypes = ButtonType;
  @Output() OnRadioChanged = new EventEmitter();
  @Output() OnToggleChanged = new EventEmitter();
  @Input() flexColumn?: boolean;
  @ViewChild('inputModel') inputValue:any;

  public defaultInnerValue: any = null;

  OnRadioChangeValue(value:any) {
    this.OnRadioChanged.emit(value);
  }

  OnToggleChangeValue(event:any) {
    this.OnToggleChanged.emit(event);
  }

  
}
