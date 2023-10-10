import { Component } from '@angular/core';
import { SeveritiesEnum } from '@close-front-office/mfe-broker/shared-toast';

@Component({
  selector: 'cfo-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  SEVERITIES: typeof SeveritiesEnum = SeveritiesEnum;
}
