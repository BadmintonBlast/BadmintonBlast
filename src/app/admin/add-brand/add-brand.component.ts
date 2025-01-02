import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IBrand } from '../../../interfaces/i-Brand';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../services/brand/brand.service';

@Component({
  selector: 'app-add-brand',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-brand.component.html',
  styleUrl: './add-brand.component.css',
})
export class AddBrandComponent {
  @Input() idBrand: number = 0; // Biến để mở modal
  @Output() closeFormEvent = new EventEmitter<void>();
  imagePreview: string | null = null; // Biến để lưu đường dẫn hình ảnh xem trước
  newBrand: IBrand = {
    idbrand: 0, // hoặc giá trị mặc định phù hợp
    namebrand: '',
    description: '',
    image: null as unknown as File,
  };

  constructor(private brandService: BrandService) {}
  ngOnInit() {
    if (this.idBrand > 0) {
      this.brandService.getBrandById(this.idBrand).subscribe((brand) => {
        this.newBrand = brand;
        this.imagePreview = String(brand.image);
      });
    }
  }
  // Hàm xử lý khi chọn file
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.newBrand.image = file;

      // Tạo URL để xem trước ảnh
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.idBrand > 0) {
      this.brandService.updateBrand(this.newBrand).subscribe({
        next: () => {
          alert('Cập nhật thương hiệu thành công!');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          alert('Có lỗi xảy ra khi cập nhật thương hiệu.');
        },
      });
    }
    else
    {
      this.brandService.createBrand(this.newBrand).subscribe({
        next: () => {
          alert('Thêm thương hiệu thành công!');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          alert('Có lỗi xảy ra khi thêm thương hiệu.');
        },
      });
    }
  }
  // Đóng modal
  closeModal(): void {
    this.closeFormEvent.emit();
    this.imagePreview = null;
  }
}
