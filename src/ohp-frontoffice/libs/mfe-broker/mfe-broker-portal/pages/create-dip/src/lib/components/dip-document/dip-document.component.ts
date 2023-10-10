import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'dip-dip-document',
  templateUrl: './dip-document.component.html',
})
export class DipDocumentComponent implements OnInit {
  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  dipDocumentForm = this.fb.group({});

  constructor(private fb: FormBuilder, private dataService: DataService, private route: ActivatedRoute) {
    this.caseId = this.route.snapshot.parent?.paramMap.get('caseid');
  }

  ngOnInit() {
    this.onChanges();
  }

  onChanges(): void {
    this.dipDocumentForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(val, this.dipDocumentForm.status, 'step14');
    });
  }
}
