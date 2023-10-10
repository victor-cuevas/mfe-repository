import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'cfo-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
})
export class DropDownMenuComponent {
  @Input()
  label!: string;

  showMenu = false;

  @HostListener('document:click', ['$event'])
  closeWhenClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && this.showMenu) {
      this.showMenu = false;
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  constructor(private eRef: ElementRef) {}
}
