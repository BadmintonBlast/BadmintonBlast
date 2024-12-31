import { Image, IProduct } from './i-Product';
import { IProductStock } from './i-ProductStock';
export interface IOrder {
  idorder: number;
  idbill: number;
  idproduct: number;
  price: number;
  nameproduct: string;
  color: string;
  size: string;
  quatity: number;
  dateOrder: string;
}

export interface IOrderProduct {
  idorder: number;
  idbill: number;
  idproduct: number;
  price: number;
  nameproduct: string;
  color: string;
  size: string;
  quatity: number;
  dateOrder: string;
  idbrand: number | 0;
  idkindproduct: number | 0;
  kindproduct: string;
  namebrand: string;
  description: string;
  available: number;
  deprice: number;
  date: Date;
  productDetails: IProduct;
}
