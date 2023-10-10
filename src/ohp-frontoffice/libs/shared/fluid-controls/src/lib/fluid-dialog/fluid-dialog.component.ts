import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cfc-fluid-dialog',
  templateUrl: './fluid-dialog.component.html',
  styles: [],
})
export class FluidDialogComponent implements OnChanges {
  @Input() displayModal: any;
  @Input() headerContent: any;
  @Input() footerContent: any;
  @Input() footerButtonVisiblity: boolean | undefined;
  @Input() Type: any;

  @Output() OnSubmitModel: EventEmitter<any> = new EventEmitter();
  @Output() OnCloseModel: EventEmitter<any> = new EventEmitter();

  @ViewChild('form', { static: true }) testForm!: NgForm;
  @ContentChild('contentTemplate') contentTemplate!: TemplateRef<ElementRef>;
  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<ElementRef>;
  @ContentChild('footerTemplate') footerTemplate!: TemplateRef<ElementRef>;

  @Input() itemsData!: any[];
  ngOnChanges(changes: SimpleChanges) {
   
    if (
      this.footerButtonVisiblity != null &&
      this.footerButtonVisiblity != undefined
    ) {
      const temp = this.footerButtonVisiblity
      this.footerButtonVisiblity =temp ;
    }
  }

  constructor() {}


  OnClick() {
    this.OnSubmitModel.emit(true);
  }

  onHideModel() {
    this.OnCloseModel.emit(true);
  }
}
