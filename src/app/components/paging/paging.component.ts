import { Component, EventEmitter, Input, Output } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-paging',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css']
})
export class PagingComponent {
  @Input() totalPages: number = 10  ;  // Tổng số trang
  @Input() currentPage: number = 1;  // Trang hiện tại
  @Input() pagesToShow: number = 3;  // Số trang hiển thị
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();  // Sự kiện thay đổi trang

  // Getter cho danh sách các trang
  get pages(): (number | string)[] {
    const startPage = Math.max(1, this.currentPage - Math.floor(this.pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    const pages = [];

    // Trang đầu tiên và dấu ba chấm
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    // Trang giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Dấu ba chấm và trang cuối cùng
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) pages.push('...');
      pages.push(this.totalPages);
    }

    return pages;
  }

  changePage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);  // Phát sự kiện khi trang thay đổi
    } else if (page === '...') {
      const nextPageGroup = Math.min(this.totalPages, this.currentPage + this.pagesToShow);
      this.currentPage = nextPageGroup;
      this.pageChanged.emit(this.currentPage);  // Phát sự kiện khi thay đổi nhóm trang
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
}
  