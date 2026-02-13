import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherX } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-overlay-menu',
  standalone: true,
 imports: [
  NgIf,
  NgFor,
  NgIconComponent,
  RouterLink,
  RouterLinkWithHref
],
  providers: [provideIcons({ featherX })],
  templateUrl: './overlay-menu.html',
})
export class OverlayMenu {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();

  menuItems = ['Home', 'About', 'Skills', 'Projects','Experience','Testimonials', 'Contact'];

  close() {
    this.onClose.emit();
  }
}
