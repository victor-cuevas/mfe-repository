import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './mbportal-linked-advisors.component.html',
})
export class MbportalLinkedAdvisorsComponent {
  advisors = this.route.snapshot.parent?.data?.intermediary.reduxData?.roleMappings || {};

  constructor(private route: ActivatedRoute) {}
}
