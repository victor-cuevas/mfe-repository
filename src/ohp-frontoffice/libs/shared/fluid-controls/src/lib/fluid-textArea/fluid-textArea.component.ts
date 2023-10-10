import { Component, forwardRef, Input } from "@angular/core";
import { ControlContainer, NgForm, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FluidControlBaseComponent } from "../services/fluid-control-base.component";


@Component({
  selector: 'cfc-fluid-textarea',
  templateUrl: './fluid-textArea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FluidTextAreaComponent),
      multi: true,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class FluidTextAreaComponent extends FluidControlBaseComponent {

  @Input() maxLength !: number
}
