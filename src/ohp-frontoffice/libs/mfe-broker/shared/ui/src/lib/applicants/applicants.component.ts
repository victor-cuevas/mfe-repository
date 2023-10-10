import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'cfo-applicants',
  templateUrl: './applicants.component.html',
})
export class ApplicantsComponent {
  show = this.router.url.includes('/dip/') || this.router.url.includes('/illustration/') || this.router.url.includes('/fma/');
  contactsInformation = this.route.parent?.snapshot?.data?.summary?.caseData?.contactsInformation || [];

  applicantsHtml =
    '<div class="mt-2 mb-2">' +
    this.contactsInformation
      .map(
        (el: any) =>
          `<p class="mb-1">${el.firstName ? this.titleCasePipe.transform(el.firstName) + ' ' : ''}${
            el.familyNamePrefix ? this.titleCasePipe.transform(el.familyNamePrefix) + ' ' : ''
          }${el.familyName ? this.titleCasePipe.transform(el.familyName) : ''}</p>`,
      )
      .join('') +
    '</div>';

  constructor(private route: ActivatedRoute, private router: Router, private titleCasePipe: TitleCasePipe) {}
}
