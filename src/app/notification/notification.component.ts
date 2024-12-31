import { Component,Input} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ] 
})
export class NotificationComponent {
// Trong component của bạn
@Input() message: string = ''; // Nhận nội dung thông báo
}
