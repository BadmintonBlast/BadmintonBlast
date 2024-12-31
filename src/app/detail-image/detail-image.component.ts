import { Component,Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-detail-image',
  standalone: true,
  imports: [NgFor],
  templateUrl: './detail-image.component.html',
  styleUrl: './detail-image.component.css'
})
export class DetailImageComponent {
  @Input() selectedImages: string[] = [];
  currentImageIndex: number = 0; // Khởi tạo vị trí hình ảnh hiện tại

  // Hàm chuyển sang hình ảnh trước
  prevImage(): void {
    if (this.selectedImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedImages.length) % this.selectedImages.length;
    }
  }

  // Hàm chuyển sang hình ảnh kế tiếp
  nextImage(): void {
    if (this.selectedImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedImages.length;
    }
  }
}
