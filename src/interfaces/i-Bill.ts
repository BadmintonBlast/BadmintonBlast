import { IOrderProduct} from './i-Order';
export interface IBill {
    idbill: number;
    idcustomer: number;
    dateorder: string; // ISO date format
    namecustomer: string;
    phone: string;
    address: string;
    totalamount: number;
    status: number;
    pay: string;
    transactioncode: string;
    message: string;
    coupon: number;
    idcoupon: number;
  }
  export  interface responseBill {
    idBill: number;
}
  export interface IBillDetail {
    idbill: number;
    idcustomer: number;
    dateorder: string; // ISO date format
    namecustomer: string;
    phone: string;
    address: string;
    totalamount: number;
    status: number;
    pay: string;
    transactioncode: string;
    message: string;
    coupon: number;
    idcoupon: number;
    orders :IOrderProduct[];
  }