import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseStatusResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbp-case-history-table',
  templateUrl: './case-history-table.component.html',
})
export class CaseHistoryTableComponent {
  @ViewChild('casehistorytable') casehistorytable!: Table;

  caseId = this.route.snapshot.paramMap.get('caseId');
  caseData = this.route.snapshot.data.summary?.caseData;
  sortedStatusHistory = this.sortStatusHistory(this.caseData?.statusHistory);

  constructor(private router: Router, private route: ActivatedRoute) {}

  private sortStatusHistory(data: CaseStatusResponse[]) {
    return data?.sort((a, b) => {
      if (a.statusDate && b.statusDate) {
        if (a.statusDate > b.statusDate) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
  }
}
