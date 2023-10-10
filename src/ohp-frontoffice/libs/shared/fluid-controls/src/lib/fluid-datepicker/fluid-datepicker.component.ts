import { Component, OnInit, Input, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NgForm,
  ControlContainer,
} from '@angular/forms';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'cfc-fluid-datepicker',
  templateUrl: './fluid-datepicker.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidDatePickerComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FluidDatePickerComponent
  extends FluidControlBaseComponent
  implements OnInit
{
  dutch: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() minDateLimit: any;
  @Input() maxDateLimit: any;
  @Input() yearRange: any;
  @Input() defaultDate: any;
  @Input() calendarLanguage: any;
  @Input() appendToBody: any = null;

  constructor(private primeNGConfig: PrimeNGConfig) {
    super();
  }

  ngOnInit() {
    if (this.ControlConfig.calendarLanguage) {
      this.primeNGConfig.setTranslation(this.ControlConfig.calendarLanguage);
    }
    if (!this.yearRange) {
      this.yearRange = '1900:2050';
    }
  }
}
