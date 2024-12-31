import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // Cuộn đến vị trí cũ
        this.viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // Cuộn tới anchor nếu có
        this.viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // Cuộn lên đầu trang
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
