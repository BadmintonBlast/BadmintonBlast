import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { HeaherComponent } from '../../components/heaher/heaher.component';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { IReservation, IInvoice } from '../../../interfaces/i-Reservation';
import { RouterModule, Router } from '@angular/router';
import { UserbookingComponent } from '../../userbooking/userbooking.component';
import { Title } from '@angular/platform-browser';
import { NotificationComponent } from '../../notification/notification.component';
import { firstValueFrom } from 'rxjs';
import { SlotSelectionService } from '../../../services/shareCourt/slot-selection.service';
import { Console } from 'console';
import { InforTeamComponent } from '../../infor-team/infor-team.component';
import { CustomersService } from '../../../services/customer/customers.service';
interface ScheduleStatus {
  [key: string]: { status: number; id: number | null }[];
}
@Component({
  selector: 'app-court',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    RouterModule,
    NotificationComponent,
    InforTeamComponent,
  ],
  templateUrl: './court.component.html',
  styleUrl: './court.component.css',
})
export class CourtComponent {
  timechangebit: { [key: string]: { [key: string]: number } } = {};
  timeSlots: string[] = [
    '5:00',
    '5:30',
    '6:00',
    '6:30',
    '7:00',
    '7:30',
    '8:00',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
  ];

  fields: string[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  mockSchedule: ScheduleStatus = {};
  minDate: string = '';
  maxDate: string = '';
  today: string = '';
  index: number = 1;
  sizepage: number = 100;
  invoice: IInvoice[] = [];
  reservations: IReservation[] = [];
  formatDate = (date: Date): string => date.toISOString().split('T')[0];
  idcustomer:number=0;
  role:string = '';
  constructor(
    private reservation: ReservationService,
    private router: Router,
    private title: Title,
    private slotSelectionService: SlotSelectionService,
    private customersService: CustomersService
  ) {
    this.role=localStorage.getItem('role');
    this.title.setTitle('Đặt sân - Badminton Blast');
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    this.minDate = this.formatDate(today);
    this.maxDate = this.formatDate(twoWeeksLater);
    this.today = this.formatDate(new Date());
    this.getInvoice();
    this.initializeTimechangebit();
    this.idcustomer=this.customersService.getClaimValue();
  }
  ngOnInit() {
    this.getHourLy();
  }
  initializeTimechangebit(): void {
    let value = 0;
    for (let i = 0; i < this.timeSlots.length; i++) {
      const start = this.timeSlots[i];
      const end = this.timeSlots[i + 1];

      if (!this.timechangebit[start]) {
        this.timechangebit[start] = {};
      }
      this.timechangebit[start][end] = value;
      value++;
    }
  }
  formatTimeUsingDate(time: string): string {
    const [hours, minutes] = time.split(':'); // Tách giờ và phút từ chuỗi
    return `${parseInt(hours)}:${minutes}`; // Chuyển đổi giờ sang số nguyên (loại bỏ số 0 trước) và ghép với phút
  }
  getInvoice() {
    const numberOfSlots = 37; // Tổng số slot trong mỗi mảng
    const lastSlotStatus = 7; // Trạng thái cuối cùng của mỗi mảng (ví dụ: 7)
    console.log(this.today);
    const courts = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    this.reservations = [];
    this.mockSchedule = {}; // Khởi tạo lại mockSchedule

    // Gọi API để lấy invoice
    this.reservation
      .getInvoice(this.index, this.sizepage, this.today, '', '')
      .subscribe(async (res) => {
        this.invoice = res;

        // Chờ các yêu cầu getReservationById hoàn thành
        for (let i = 0; i < res.length; i++) {
          const reservationDetails = await firstValueFrom(
            this.reservation.getReservationById(res[i].idInvoice)
          );
          this.reservations = [...this.reservations, ...reservationDetails];
        }
        // Cập nhật mockSchedule với các trạng thái
        for (let i = 0; i < this.reservations.length; i++) {
          const startSlot = this.formatTimeUsingDate(
            this.reservations[i].starttimerates
          );
          const endSlot = this.formatTimeUsingDate(
            this.reservations[i].endtimerates
          );
          const court = this.reservations[i].namefield;
          const slotRange = this.timechangebit[startSlot][endSlot];
          const idBill = this.reservations[i].idinvoice; // Lấy idInvoice (idBill)

          // Khởi tạo nếu chưa có sân trong mockSchedule
          if (!this.mockSchedule[court]) {
            this.mockSchedule[court] = Array(numberOfSlots).fill({
              status: 0,
              id: null,
            });
          }

          // Gán trạng thái và lưu idBill nếu cần
          if (this.reservations[i].missingSlots === '') {
            // Nếu không có slot thiếu
            this.mockSchedule[court][slotRange] = { status: 1, id: idBill }; // Màu vàng
          } else {
            // Nếu có slot thiếu
            this.mockSchedule[court][slotRange] = { status: 2, id: idBill }; // Màu khác
          }
        }
      });

    // Khởi tạo mảng mockSchedule cho từng sân
    courts.forEach((court) => {
      if (!this.mockSchedule[court]) {
        this.mockSchedule[court] = Array(numberOfSlots - 1).fill({
          status: 0,
          id: null,
        }); // Khởi tạo mảng với các giá trị 0
      }

      // Đặt giá trị 7 vào slot cuối cùng
      this.mockSchedule[court][numberOfSlots - 1] = {
        status: lastSlotStatus,
        id: null,
      };

      // Đảm bảo các giá trị chưa có sẽ được gán là 0
      for (let i = 0; i < numberOfSlots - 1; i++) {
        if (
          !this.mockSchedule[court][i] ||
          (this.mockSchedule[court][i].status !== 1 &&
            this.mockSchedule[court][i].status !== 2)
        ) {
          this.mockSchedule[court][i] = { status: 0, id: null }; // Gán lại giá trị mặc định
        }
      }
    });
  }

  onDateChange(event: Event) {
    this.reservations = [];
    this.invoice = [];
    this.getInvoice();
  }
  getStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'bg-white';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-400';
      case 3:
        return 'bg-green-400';
      case 7:
        return 'bg-transparent';
      default:
        return '';
    }
  }
  checktranger: boolean = false;
  selectedCells: Set<string> = new Set();
  selectedSlots: { field: string; index: number }[] = []; // Mảng lưu trữ
  timeRanges: { [key: string]: { [key: string]: number } } = {};
  totalHourSelections: number = 0;
  totalAmount: number = 0;
  inforTeam: boolean = false;
  idbill: number = 0;
  isLoginOpen = false;
  closeLogin() {
    this.idbill = 0;
  }
  // Hàm được gọi khi người dùng click vào ô
  onCellClick(field: string, index: number, idbill: number): void {
    if (index != 36) {
      if (
        this.mockSchedule[field][index].status !== 1 &&
        this.mockSchedule[field][index].status !== 2
      ) {
        if (this.mockSchedule[field][index].status !== 0) {
          this.mockSchedule[field][index].status = 0;
        } else {
          this.mockSchedule[field][index].status = 3;
        }
        // Kiểm tra nếu slot đã được chọn
        const existingSlotIndex = this.selectedSlots.findIndex(
          (slot) => slot.field === field && slot.index === index
        );

        if (existingSlotIndex > -1) {
          // Nếu đã tồn tại, xóa slot khỏi mảng (bỏ chọn)
          this.selectedSlots.splice(existingSlotIndex, 1);

          // Cập nhật lại totalAmount khi bỏ chọn
          for (const timeKey in this.timechangebit) {
            const timeRange = this.timechangebit[timeKey];
            for (const rangeKey in timeRange) {
              const rangeValue = timeRange[rangeKey];
              if (
                rangeValue === index &&
                this.timeRanges[timeKey]?.[rangeKey] === index
              ) {
                // Trừ giá trị tương ứng khi bỏ chọn
                this.totalAmount -= this.compareHour(timeKey);

                // Xóa key khỏi timeRanges
                delete this.timeRanges[timeKey][rangeKey];
                if (Object.keys(this.timeRanges[timeKey]).length === 0) {
                  delete this.timeRanges[timeKey]; // Xóa timeKey nếu không còn rangeKey
                }
                break;
              }
            }
          }
        } else {
          // Nếu chưa tồn tại, thêm vào mảng (chọn ô mới)
          this.selectedSlots.push({ field, index });

          for (const timeKey in this.timechangebit) {
            const timeRange = this.timechangebit[timeKey];
            for (const rangeKey in timeRange) {
              const rangeValue = timeRange[rangeKey];
              if (rangeValue === index) {
                if (!this.timeRanges[timeKey]) {
                  this.timeRanges[timeKey] = {}; // Khởi tạo một object rỗng
                }

                // Thêm vào timeRanges và tăng totalAmount
                this.timeRanges[timeKey][rangeKey] = index;
                this.totalAmount += this.compareHour(timeKey);
                break;
              }
            }
          }
        }
        // Cập nhật tổng số giờ đã chọn
        this.totalHourSelections = this.selectedSlots.length * 30;
      } else if (this.mockSchedule[field][index].status == 2) {
        // this.inforTeam=true;
        this.idbill = idbill;
      }
    }
  }

  timeToMinutes(time: string): number {
    if (!time) {
      console.error('Invalid time input');
      return 0; // Hoặc xử lý lỗi tùy theo yêu cầu
    }
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time format');
      return 0; // Hoặc xử lý lỗi tùy theo yêu cầu
    }
    return hours * 60 + minutes;
  }

  //gọi giá trị của mỗi khung gi
  compareHour(time: string) {
    if (!time || typeof time !== 'string') {
      console.error('Invalid time input:', time);
      return null; // Hoặc trả về giá trị mặc định khác
    }

    const hours = time.split(':');
    const timechange = parseInt(hours[0]) * 60 + parseInt(hours[1]);

    for (let i = 0; i < this.hourly.length; i++) {
      const startTimeInMinutes = this.timeToMinutes(
        this.hourly[i].starttimerates
      );
      const endTimeInMinutes = this.timeToMinutes(this.hourly[i].endtimerates);

      if (timechange >= startTimeInMinutes && timechange < endTimeInMinutes) {
        return this.hourly[i].price;
      }
    }
    return null; // Trường hợp không tìm thấy giá
  }
  message: string = '';
  
  tranferdata() {
    if (this.selectedSlots == null||this.selectedSlots.length === 0) {
      this.message = 'Vui lòng chọn thời gian và sân';
      setTimeout(() => {
        this.message = '';
      }, 2500);
      return;
    }
    if(!this.idcustomer)
    {
      this.message = 'Vui lòng đăng nhập để đặt sân';
      setTimeout(() => {
        this.message = '';
      }, 2500);
      return;
    }
    if (this.validateSelection(this.selectedSlots)) {
      const queryParams = {
        selectedSlots: JSON.stringify(this.selectedSlots), // Chuyển dữ liệu thành chuỗi JSON
        timeRanges: JSON.stringify(this.timeRanges),
        totalHourSelections: this.totalHourSelections,
        totalAmount: this.totalAmount,
      };
      this.slotSelectionService.updateSelectedSlots(this.selectedSlots);
      this.slotSelectionService.updateTimeRanges(this.timeRanges);
      this.slotSelectionService.updateTotalHourSelections(
        this.totalHourSelections
      );
      this.slotSelectionService.updateTotalAmount(this.totalAmount);
      this.slotSelectionService.updatedate(this.today);
      // Chuyển trang và truyền dữ liệu qua query params
      this.router.navigate(['/xacnhandatsan']);
    } else {
      this.message = 'Vui lòng chọn ít nhất 1 tiếng liên tục cho từng sân.';
      setTimeout(() => {
        this.message = '';
      }, 2500);
    }
  }
  hourly: any[] = [];
  getHourLy() {
    this.reservation.getHourly().subscribe((hourly) => {
      this.hourly = hourly;
    });
  }
  // Hàm để kiểm tra xem ô có được chọn không
  isSelected(field: string, index: number): boolean {
    const cellIdentifier = `${field}-${index}`;
    return this.selectedCells.has(cellIdentifier);
  }

  validateSelection(schedule: { field: string; index: number }[]): boolean {
    // Tạo một đối tượng để lưu trữ các index của mỗi sân
    const fieldIndexMap: { [key: string]: number[] } = {};

    // Phân loại các index theo từng sân (field)
    for (const item of schedule) {
      if (!fieldIndexMap[item.field]) {
        fieldIndexMap[item.field] = [];
      }
      fieldIndexMap[item.field].push(item.index);
    }

    // Kiểm tra các nhóm index liên tiếp
    for (const field in fieldIndexMap) {
      const indexes = fieldIndexMap[field];
      indexes.sort((a, b) => a - b); // Sắp xếp các index theo thứ tự tăng dần

      let check = 0;
      for (let i = 1; i <= indexes.length; i++) {
        if (indexes[i] === indexes[i - 1] + 1) {
          check++;
        } else {
          if (check == 0) {
            return false;
          } else {
            check = 0;
          }
        }
      }
    }
    return true;
  }

  // Hàm để lấy class tùy chỉnh khi ô được chọn
  getCellClass(field: string, index: number): string {
    return this.isSelected(field, index) ? 'selected' : '';
  }
}
