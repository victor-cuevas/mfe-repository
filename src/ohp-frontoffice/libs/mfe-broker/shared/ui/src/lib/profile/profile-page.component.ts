import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cfo-profile-page',
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  constructor() {}
}
