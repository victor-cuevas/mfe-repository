import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * reusable structural directive for formControlValue or any other string value to check whether or not
 * value exists in the provided list with string values. If yes renders the conditional template.
 *
 * @param cfoValueCheck
 * @param cfoValueChecklist
 */
@Directive({
  selector: '[cfoValueCheck]',
})
export class ValueCheckDirective implements OnChanges {
  @Input() cfoValueCheck: string | undefined;
  @Input() cfoValueCheckList!: string[];

  constructor(private templateRef: TemplateRef<never>, private viewContainer: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cfoValueCheck']) {
      this.viewContainer.clear();
      this.displayTemplate();
    }
  }

  private displayTemplate(): void {
    this.cfoValueCheck && this.cfoValueCheckList.includes(this.cfoValueCheck)
      ? this.viewContainer.createEmbeddedView(this.templateRef)
      : this.viewContainer.clear();
  }
}
