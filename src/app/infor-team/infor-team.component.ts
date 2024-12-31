import { Component, Input, Output,EventEmitter} from '@angular/core';
import { ReservationService } from '../../services/reservation/reservation.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-infor-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infor-team.component.html',
  styleUrl: './infor-team.component.css',
})
export class InforTeamComponent {
  @Input() id: number | 0;
  message: string;
  isVisible: boolean = true;
  @Output() closeFormEvent = new EventEmitter<void>();
  constructor(private reservation: ReservationService) {}
  ngOnInit() {
    console.log(this.id);
    this.reservation.getReservationById(this.id).subscribe((reservation) => {
      this.message = reservation[0].missingSlots;
    });
  }
  closeForm() {
    this.closeFormEvent.emit();
  }
}
