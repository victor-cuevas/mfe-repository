import { Component, Input } from '@angular/core';

@Component({
  selector: 'cfo-dropdown-item',
  templateUrl: 'dropdown-item.component.html',
})
export class DropdownItemComponent {
  @Input() tooltip!: string;

  constructor() {}
}
