import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../services/brand/brand.service';
import { IBrand } from '../../../interfaces/i-Brand';
import { NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule,NgbCarousel],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'] // Chỉnh sửa từ 'styleUrl' thành 'styleUrls'
})
export class BrandComponent implements OnInit {
  brand: IBrand[] = [];
  visibleBrands: IBrand[] = []; // Mảng để lưu sản phẩm hiện đang hiển thị
  currentIndex: number = 0; // Chỉ số hiện tại
  currentSlide: number = 0;
  intervalId: any;
  currentImageIndex = 1;
  autoSlideInterval: any;
  images = [
    'assets/banner/Lining.png',
    'assets/banner/yonex.png',
    'assets/banner/3.png'
  ];
  
  constructor(private brandService: BrandService) {}

  ngOnInit() {
    
    this.brandService.getAllBrands().subscribe((data) => {
      this.brand = data;
      this.updateVisibleBrands(); // Cập nhật sản phẩm hiển thị sau khi lấy dữ liệu
    });
  }


  prevImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }
// Hàm xử lý khi chuột di chuyển vào hình ảnh
onMouseEnter() {
  this.autoSlideInterval = setInterval(() => {
    this.nextImage();
  }, 800); // 2000ms = 2 giây
}

// Hàm xử lý khi chuột di chuyển ra khỏi hình ảnh
onMouseLeave() {
  if (this.autoSlideInterval) {
    clearInterval(this.autoSlideInterval);
    this.autoSlideInterval = null;
  }
}
  // Hàm để chuyển sang hình ảnh tiếp theo
  nextImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.images.length;
    this.updateImage();
  }
  updateImage() {
    const bannerImage = document.getElementById('bannerImage') as HTMLImageElement;
    bannerImage.src = this.images[this.currentImageIndex];
  }
  updateVisibleBrands() {
    const itemsPerPage = 5; // Số sản phẩm hiển thị mỗi lần
    this.visibleBrands = this.brand.slice(this.currentIndex, this.currentIndex + itemsPerPage);
  }


  scrollLeft() {
    const itemsPerPage = 5; // Số sản phẩm hiển thị mỗi lần
    if (this.currentIndex > 0) {
      this.currentIndex -= itemsPerPage;
      this.updateVisibleBrands();
    }
  }

  scrollRight() {
    const itemsPerPage = 5; // Số sản phẩm hiển thị mỗi lần
    if (this.currentIndex + itemsPerPage < this.brand.length) {
      this.currentIndex += itemsPerPage;
      this.updateVisibleBrands();
    }
  }
}
