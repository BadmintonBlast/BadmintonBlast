import { Component,Output,EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  @Output() closeFormEvent = new EventEmitter<void>();
  @Output() executeEvent = new EventEmitter<void>();
  delete(): void {
    this.executeEvent.emit()
  }
  closeModal(): void {
    this.closeFormEvent.emit()
  }
}
