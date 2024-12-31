export interface IReservation {
  idReservation: number;
  idField: number;
  idcustomer: number;
  idhourlyrates: number;
  starttimerates: string;
  endtimerates: string;
  namecustomer: string;
  transactioncode: string;
  price: number;
  namefield: string;
  fieldstatus: string;
  missingSlots: string | '';
  idinvoice: number;
}
export interface IInvoice {
  idInvoice: number;
  idcustomer: number;
  totalamount: number;
  paymentmethod: string | null;
  customername: string;
  customerphone: string | null;
  transactioncode: string | null;
  reservationdate: string; // Hoặc Date nếu bạn muốn lưu ngày dưới dạng Date
  status: string | null;
  reservations: IReservation[]; // Mảng chứa các đối tượng Reservation
}

export interface IInvoiceCreate {
  idInvoice: number;
  idcustomer: number;
  totalamount: number;
  paymentmethod: string | null;
  customername: string;
  customerphone: string | null;
  transactioncode: string | null;
  reservationdate: string; // Hoặc Date nếu bạn muốn lưu ngày dưới dạng Date
  status: boolean; //
}
