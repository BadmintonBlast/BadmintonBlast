import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [NgClass],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {


  delete(): void {

    console.log('Delete button clicked');
  }

  closeModal(): void {
    // Đóng modal, reset trạng thái nếu cần
    console.log('Modal closed');
  }
}
