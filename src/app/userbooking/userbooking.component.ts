import { Component, OnInit, OnDestroy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { SlotSelectionService } from '../../services/shareCourt/slot-selection.service';
import { IdField } from '../../interfaces/i-Field';
import { ReservationService } from '../../services/reservation/reservation.service';
import { IInvoiceCreate, IReservation } from '../../interfaces/i-Reservation';
import { CustomersService } from '../../services/customer/customers.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';
import { PaypalService } from '../../services/paypal/paypal.service';
interface TimeChoose {
  idTime: number;
  startTime: string;
  endTime: string;
}
interface timefield {
  field: string;
  startTime: string;
  endTime: string;
}
@Component({
  selector: 'app-userbooking',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, FormsModule, NotificationComponent],
  templateUrl: './userbooking.component.html',
  styleUrls: ['./userbooking.component.css'],
})
export class UserbookingComponent implements OnInit, OnDestroy {
  // implements OnInit
  selectedSlots: { field: string; index: number }[] = [];
  timeRanges: { [key: string]: { [key: string]: number } } = {};
  totalHourSelections: number = 0;
  totalAmount: number = 0;
  date: string = '';
  editor: Editor;
  html = '';
  idCustomer: number = 0;
  nameCustomer: string = '';
  phoneCustomer: string = '';
  messageSlot: string = '';
  role:string=''
  constructor(
    private route: ActivatedRoute,
    private slotSelectionService: SlotSelectionService,
    private reservationService: ReservationService,
    private customerService: CustomersService,
    private router: Router,
    private paypalService: PaypalService
  ) {
    this.editor = new Editor();
  }
  ngOnInit(): void {
    this.fetchExchangeRate();
    this.idCustomer = this.customerService.getClaimValue();
    this.role =localStorage.getItem('role');
    this.slotSelectionService.selectedSlots$.subscribe((slots) => {
      this.selectedSlots = slots;
      console.log(this.selectedSlots);
      if (this.selectedSlots.length == 0) {
        this.router.navigate(['/datsan']);
      }
      this.selectedSlots.sort((a, b) => {
        if (a.field === b.field) {
          return a.index - b.index; // Sắp xếp theo `index` nếu `field` giống nhau
        } else {
          return a.field.localeCompare(b.field); // Sắp xếp theo `field` nếu khác nhau
        }
      });
    });
    this.slotSelectionService.timeRanges$.subscribe((ranges) => {
      this.timeRanges = ranges;
      let idTime = 0;

      // Duyệt qua tất cả các mục trong timeRanges
      Object.keys(this.timeRanges).forEach((startTime) => {
        const endTimes = Object.keys(this.timeRanges[startTime]);

        endTimes.forEach((endTime) => {
          // Lấy giá trị idTime từ timeRanges
          const id = this.timeRanges[startTime][endTime];

          // Chèn vào listTimeChoose
          this.listTimeChoose.push({
            idTime: id,
            startTime: startTime,
            endTime: endTime,
          });

          // Tăng idTime cho lần tiếp theo
          idTime++;
        });
      });

      this.listTimeChoose.sort((a, b) => {
        return a.idTime - b.idTime;
      });
    });

    this.slotSelectionService.totalHourSelections$.subscribe((hours) => {
      this.totalHourSelections = hours;
    });

    this.slotSelectionService.totalAmount$.subscribe((amount) => {
      this.totalAmount = amount;
    });
    this.slotSelectionService.date$.subscribe((date) => {
      this.date = date;
    });

    this.getTime(); // Gọi hàm lấy th��i gian theo field và index của slots đã chọn
  }
  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }
  listTimeChoose: TimeChoose[] = [];
  postTimeField: timefield[] = [];

  listimefield: timefield[] = [];
  getTime() {
    let startTime = '';
    let endTime = '';
    console.log(this.nameCustomer, this.phoneCustomer, this.html);
    for (let i = 0; i < this.selectedSlots.length - 1; i++) {
      if (
        this.selectedSlots[i].field == this.selectedSlots[i + 1].field &&
        this.selectedSlots[i].index == this.selectedSlots[i + 1].index - 1
      ) {
        for (let j = 0; j < this.listTimeChoose.length; j++) {
          if (this.listTimeChoose[j].idTime === this.selectedSlots[i].index) {
            this.postTimeField.push({
              field: this.selectedSlots[i].field,
              startTime: this.listTimeChoose[j].startTime,
              endTime: this.listTimeChoose[j].endTime,
            });
            if (startTime === '') {
              startTime = this.listTimeChoose[j].startTime;
              console.log(startTime);
            }
            endTime = this.listTimeChoose[j + 1].endTime;
            console.log(endTime);
            break;
          }
        }
      } else {
        this.listimefield.push({
          field: this.selectedSlots[i].field,
          startTime: startTime,
          endTime: endTime,
        });
        this.postTimeField.push({
          field: this.selectedSlots[i].field,
          startTime:
            this.listTimeChoose[this.listTimeChoose.length - 1].startTime,
          endTime: this.listTimeChoose[this.listTimeChoose.length - 1].endTime,
        });

        startTime = '';
        endTime = '';
      }
    }
    if (this.selectedSlots.length > 0) {
      this.listimefield.push({
        field: this.selectedSlots[this.selectedSlots.length - 1].field,
        startTime: startTime,
        endTime: endTime,
      });
      this.postTimeField.push({
        field: this.selectedSlots[this.selectedSlots.length - 1].field,
        startTime:
          this.listTimeChoose[this.listTimeChoose.length - 1].startTime,
        endTime: this.listTimeChoose[this.listTimeChoose.length - 1].endTime,
      });
    }
    console.log(this.postTimeField);
  }
  message = '';
  convertVNDToUSD(amountVND: number, exchangeRate: number): number {
    // Làm tròn đến 2 chữ số thập phân và trả về dưới dạng số
    return parseFloat((amountVND / exchangeRate).toFixed(2));
  }
  exchangeRate: number = 0;
  fetchExchangeRate() {
    this.paypalService.getExchangeRate().subscribe({
      next: (response) => {
        this.exchangeRate = response.conversion_rates.VND;
      },
      error: (error) => {
        console.error('Không thể lấy thông tin tỷ giá: ');
      },
    });
  }
  reservation() {
    // Convert total amount to USD
    let monney = this.convertVNDToUSD(this.totalAmount, this.exchangeRate);

    // Function to convert time to "HH:mm:ss" format
    function convertToTimeString(time: Date | string): string {
      if (!time) return '00:00:00';
      if (time instanceof Date) {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
      }
      if (typeof time === 'string') {
        if (/^\d{1,2}:\d{2}$/.test(time)) {
          const [hours, minutes] = time.split(':');
          return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
        } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
          return time;
        }
      }
      throw new Error('Invalid time format');
    }

    // Check if the user is Admin
    if (this.role === 'Admin') {
      // Directly create the invoice and reservations without PayPal
      const invoice: IInvoiceCreate = {
        idInvoice: 0,
        idcustomer: this.idCustomer,
        totalamount: this.totalAmount,
        paymentmethod: 'Admin', // No payment required
        customername: this.nameCustomer,
        customerphone: this.phoneCustomer,
        transactioncode: 'AdminTransaction', // Dummy transaction code for Admin
        reservationdate: this.date,
        status: true,
      };

      this.reservationService
        .createInvoice(invoice)
        .forEach((createdInvoice) => {
          let i = 0;

          this.postTimeField.forEach((timefield) => {
            const reservationData: IReservation = {
              idReservation: 0,
              idField: null,
              idcustomer: Number(this.idCustomer),
              idhourlyrates: null,
              starttimerates: convertToTimeString(timefield.startTime),
              endtimerates: convertToTimeString(timefield.endTime),
              namecustomer: this.nameCustomer,
              transactioncode: 'AdminTransaction',
              price: 200, // Example price
              namefield: timefield.field,
              fieldstatus: '',
              missingSlots: this.html,
              idinvoice: createdInvoice.newInvoiceId,
            };

            this.reservationService
              .createReservation(reservationData)
              .forEach(() => {
                i++;
                if (i === this.postTimeField.length) {
                  this.message = 'Đặt sân thành công';
                  setTimeout(() => {
                    this.message = '';
                    this.router.navigate(['/datsan']);
                  }, 2000);
                }
              });
          });
        });
    } else {
      // Load PayPal script and render the PayPal button
      this.paypalService.loadPayPalScript().then(() => {
        this.paypalService.renderPayPalButton(
          'paypal-container',
          monney,
          (details: any) => {
            // Once PayPal payment is successful, create the invoice
            const invoice: IInvoiceCreate = {
              idInvoice: 0,
              idcustomer: this.idCustomer,
              totalamount: this.totalAmount,
              paymentmethod: 'PayPal',
              customername: this.nameCustomer,
              customerphone: this.phoneCustomer,
              transactioncode: details.transactioncode,
              reservationdate: this.date,
              status: true,
            };

            this.reservationService
              .createInvoice(invoice)
              .forEach((createdInvoice) => {
                let i = 0;

                this.postTimeField.forEach((timefield) => {
                  const reservationData: IReservation = {
                    idReservation: 0,
                    idField: null,
                    idcustomer: Number(this.idCustomer),
                    idhourlyrates: null,
                    starttimerates: convertToTimeString(timefield.startTime),
                    endtimerates: convertToTimeString(timefield.endTime),
                    namecustomer: this.nameCustomer,
                    transactioncode: details.transactioncode,
                    price: 200,
                    namefield: timefield.field,
                    fieldstatus: '',
                    missingSlots: this.html,
                    idinvoice: createdInvoice.newInvoiceId,
                  };

                  this.reservationService
                    .createReservation(reservationData)
                    .forEach(() => {
                      i++;
                      if (i === this.postTimeField.length) {
                        this.message = 'Đặt sân thành công';
                        setTimeout(() => {
                          this.message = '';
                          this.router.navigate(['/datsan']);
                        }, 2000);
                      }
                    });
                });
              });
          }
        );
      });
    }
  }
}
