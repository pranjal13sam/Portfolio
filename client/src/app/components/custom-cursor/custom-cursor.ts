import { Component, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.html',
})
export class CustomCursor implements OnDestroy {
  // Same as React useState
  position = { x: 0, y: 0 };

  private moveHandler = (e: MouseEvent) => {
    this.position = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  constructor() {
    // Same as useEffect mount
    window.addEventListener('mousemove', this.moveHandler);
  }

  // Cleanup like React return()
  ngOnDestroy() {
    window.removeEventListener('mousemove', this.moveHandler);
  }
}
