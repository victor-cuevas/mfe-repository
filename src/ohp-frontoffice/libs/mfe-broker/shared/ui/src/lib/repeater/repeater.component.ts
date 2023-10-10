import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cfo-repeater',
  templateUrl: './repeater.component.html',
})
export class RepeaterComponent {
  @Input() addButtonLabel = 'Add';
  @Input() divider: boolean | undefined = true;
  @Input() readOnlyMode = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  onClick() {
    this.onAdd.emit('onAdd');
  }
}

@Component({
  selector: 'cfo-repeater-item',
  templateUrl: './repeater-item.component.html',
})
export class RepeaterItemComponent {
  @Input() removeButtonLabel = 'Remove';
  @Input() isRemovable = true;
  @Input() readOnlyMode = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  onClick() {
    this.onRemove.emit('onAdd');
  }
}
