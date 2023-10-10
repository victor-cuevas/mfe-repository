import { Component } from '@angular/core';

@Component({
  selector: 'mbpanel-header-notifications',
  templateUrl: './header-notifications.component.html',
})
export class HeaderNotificationsComponent {
  notifications = [
    { title: 'Full mortage applcation', description: 'Opened a case with Identifier consectetur adip iscing elit', date: '20-06-21 09:24' },
    {
      title: 'Decision in Principle',
      description: 'Opened a case with Identifier consectetur adip iscing elit vitae lacus ac metus cursus aliquam',
      date: '20-06-21 09:24',
    },
    {
      title: 'Illustration',
      description: 'Opened a case with Identifier consectetur adip iscing elitvitae lacus ac',
      date: '20-06-21 09:24',
    },
    { title: 'New Case', description: 'Opened a case with Identifier consectetur adip iscing elit', date: '20-06-21 09:24' },
  ];
  constructor() {}
}
