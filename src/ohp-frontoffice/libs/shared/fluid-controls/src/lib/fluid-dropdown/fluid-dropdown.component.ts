import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';
import { DropDownType } from './fluid-dropdown.model';
@Component({
  selector: 'cfc-fluid-dropdown',
  templateUrl: './fluid-dropdown.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidDropdownComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FluidDropdownComponent
  extends FluidControlBaseComponent
 
{
  @Input() optionLabel!: string;
  @Input() dataKey!: string;
  @Input() showClearIcon!: boolean;
  @Input() virtualScroll !: boolean

  dropDownType = DropDownType;

  @Output() OnSelectionChanged = new EventEmitter();

  constructor() {
    super();
    this.showClearIcon = true;
  }

  onSelectionchange(event: any) {
    this.OnSelectionChanged.emit(event);
  }
  
}
