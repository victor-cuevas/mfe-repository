import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mcmc-collection-measure-dossier-status',
  templateUrl: './collection-measure-dossier-status.component.html',
  styleUrls: ['./collection-measure-dossier-status.component.scss']
})
export class CollectionMeasureDossierStatusComponent implements OnInit {
  constructor() {}

  test !: string
  ngOnInit(): void {
    this.test ='test'
  }
}
