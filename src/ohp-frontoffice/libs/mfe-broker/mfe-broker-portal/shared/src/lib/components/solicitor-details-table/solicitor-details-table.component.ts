import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FMAService, Solicitor } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'mbp-solicitor-details-table',
  templateUrl: './solicitor-details-table.component.html',
})
export class SolicitorDetailsTableComponent implements OnInit {
  @ViewChild('table') table!: Table;
  solicitors: Solicitor[] = [];
  selectedSolicitor?: Solicitor;
  loading = true;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private fmaService: FMAService) {}

  ngOnInit(): void {
    this.fmaService.fMASearchSolicitor(this.config.data.postcode, this.config.data.firmName, this.config.data.town).subscribe(resp => {
      this.solicitors = resp.solicitors as Solicitor[];
      this.loading = false;
    });
  }

  closeDialog(selectedSolicitor?: Solicitor) {
    this.ref.close(selectedSolicitor);
  }
}
