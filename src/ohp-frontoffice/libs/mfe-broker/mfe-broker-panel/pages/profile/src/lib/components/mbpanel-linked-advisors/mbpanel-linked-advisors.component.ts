import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './mbpanel-linked-advisors.component.html',
})
export class MbpanelLinkedAdvisorsComponent {
  advisors = this.route.snapshot.parent?.data?.intermediary.reduxData?.roleMappings || {};

  constructor(private route: ActivatedRoute) {}
}
