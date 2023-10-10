import {
  Component,
  OnInit,
  Input,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';

@Component({
  selector: 'cfc-fluid-checkbox',
  templateUrl: './fluid-checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidCheckboxComponent),
      multi: true,
    },
  ],
})
export class FluidCheckboxComponent
  extends FluidControlBaseComponent
  
{
  @Output() OnCheckedChange = new EventEmitter();
  @Input() checkboxLabel!: string;

  OnChecked() {
    this.OnCheckedChange.emit();
  }
  


}
