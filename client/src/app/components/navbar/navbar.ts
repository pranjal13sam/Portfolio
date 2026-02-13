import {
  Component,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherMenu } from '@ng-icons/feather-icons';
import { OverlayMenu } from '../overlay-menu/overlay-menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [OverlayMenu, NgIconComponent],
  providers: [provideIcons({ featherMenu })],
  templateUrl: './navbar.html',
})
export class Navbar implements AfterViewInit, OnDestroy {
  isMenuOpen = false;

  visible = true;
  forceVisible = false;

  // same as useRef()
  private lastScrollY = 0;
  private scrollHandler!: () => void;
  private observer!: IntersectionObserver;

  ngAfterViewInit() {
    /* ----------------------------
       IntersectionObserver
       ---------------------------- */

    const homeSection = document.querySelector('#home');

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.forceVisible = true;
          this.visible = true;
        } else {
          this.forceVisible = false;
        }
      },
      { threshold: 0.1 }
    );

    if (homeSection) {
      this.observer.observe(homeSection);
    }

    /* ----------------------------
       Scroll Logic
       ---------------------------- */

    this.scrollHandler = () => {
      if (this.forceVisible) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        this.visible = false;
      } else {
        this.visible = true;
      }

      this.lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}