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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'cfc-fluid-picklist',
  templateUrl: './fluid-pickList.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidPickListComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FluidPickListComponent
  extends FluidControlBaseComponent {
  @Input() source!: any[];
  @Input() target!: any[];
  @Input() responsive: boolean;
  @Input() dragdrop: boolean;
  @Input() filterBy!: any
  @Input() showSourceControls: boolean;
  @Input() showTargetControls: boolean;
  @Input() showTargetFilter: boolean ;
  @Output() OnSelectionChanged = new EventEmitter();
  @Input() sourceValue!: string;
  constructor() {
    super();
    this.responsive  = true;
    this.dragdrop  = false;
    this.showSourceControls  = false;
    this.showTargetControls  = false;
    this.showTargetFilter  = true;
  }
  onSelectionchange(event: any) {
    this.OnSelectionChanged.emit(event);
  }
}
