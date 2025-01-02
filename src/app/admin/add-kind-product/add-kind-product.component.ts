import { Component, Input,Output,EventEmitter } from '@angular/core';
import { KindproductService } from '../../../services/kindproduct/kindproduct.service';
import { Ikindproduct } from '../../../interfaces/i-KindProduct';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-kind-product',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './add-kind-product.component.html',
  styleUrl: './add-kind-product.component.css'
})
export class AddKindProductComponent {
 @Input() idkindProduct :number=0;
 @Output() closeFormEvent = new EventEmitter<void>();
  newKindProduct:Ikindproduct = {
    idkindproduct: 0,
    nameproduct: '',
    image: null as unknown as File,
  };
  imagePreview: string | ArrayBuffer | null = null;
constructor(private KindproductService: KindproductService)
{

}
onImageSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    this.newKindProduct.image = file;

    // Tạo URL để xem trước ảnh
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

  onSubmit(): void {
    this.KindproductService.insertKindProduct(this.newKindProduct).subscribe({
      next: (response) => {
        console.log('Thêm thành công:', response);
        alert('Thêm thương hiệu thành công!');
      },
      error: (err) => {
        console.error('Có lỗi xảy ra:', err);
        alert('Thêm thương hiệu thất bại!');
      }
    });
    
    this.closeModal();
  }

  closeModal(): void {
    this.closeFormEvent.emit();
    this.imagePreview = null;
    }
  }

