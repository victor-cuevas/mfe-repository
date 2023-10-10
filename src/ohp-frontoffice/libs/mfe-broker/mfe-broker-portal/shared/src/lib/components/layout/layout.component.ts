import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mbp-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  @Input() breadcrumbItems!: MenuItem[];
  @Input() stepsItems!: MenuItem[];

  constructor() {}
}
