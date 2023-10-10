import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'cfo-filter-menu',
  templateUrl: './filter-menu.component.html',
})
export class FilterMenuComponent {
  showFilter = false;
  isActive = false;

  @HostListener('document:click', ['$event'])
  closeWhenClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && this.showFilter) {
      this.showFilter = false;
    }
  }

  constructor(private eRef: ElementRef) {}

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
}
