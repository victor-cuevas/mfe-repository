import { Component, Input } from '@angular/core';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';

@Component({
  selector: 'cfc-fluid-button',
  templateUrl: './fluid-button.component.html',
  styles: [],
})
export class FluidButtonComponent extends FluidControlBaseComponent {
  @Input() caption !: string;
  @Input() name!: string;
  @Input() disabled!: boolean;
  @Input() progressBtnPercentage!: number;
  
  constructor() {
    super();
  }


}