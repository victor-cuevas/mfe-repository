import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';
import { NgForm, ControlContainer } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'cfc-fluid-autocomplete',
  templateUrl: './fluid-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidAutoCompleteComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class FluidAutoCompleteComponent
  extends FluidControlBaseComponent {
  @Input() filteredNames: any[] = [];
  @Input() showEmpty!: boolean ;
  @Input() name: any;
  @Input() field: any
  @Input() minLength: any;
  @Input() maxLength: any;
  @Output() filtername = new EventEmitter();
  @Output() Clear = new EventEmitter();
  @Output() Selected = new EventEmitter();

  constructor() {
    super();
    this.showEmpty = true;
  }

  clear(event: any) {
    this.Clear.emit(event);
  }
  onSelect(event: any) {
    this.Selected.emit(event);
  }
  filterName(event: any) {
    this.filtername.emit(event);
  }
}
