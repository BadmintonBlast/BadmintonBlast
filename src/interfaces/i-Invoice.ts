export interface IInvoice
{
 IdInvoice:number;
 IdCustomer:number;
 Totalamount: number;
 Paymentmethod: string;
 Customername: string;
 Customerphone: string;
 Transactioncode: string;
 Reservationdate: Date;
 Status: boolean;
}
