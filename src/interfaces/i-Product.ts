import {IProductStock} from "./i-ProductStock";
export interface IProduct {
    idproduct: number|0; 
    idbrand: number|0; 
    idkindproduct: number|0;
    nameproduct: string; 
    kindproduct: string;
    namebrand: string;
    description: string;
    price: number; 
    available: number; 
    deprice: number;
    date:Date;
    image: Image[]; 
    productstocks: IProductStock[]; 
}
export interface IproductBuy
{
  
}
export interface IProductStatic
{
  idproduct: number|0;
  nameproduct: string|'';
  price: number|0;
  sale: number|0
  totalProduct: number|0;
  totalMoney:number|0;
}

export interface Image {
    idproduct: number;
    image4?: File | null; 
    id: number;
  }

  export interface IProductInsert {
    idproduct: number; 
    idbrand: number; 
    idkindproduct: number;
    nameproduct: string; 
    kindproduct: string;
    namebrand: string;
    description: string;
    price: number; 
    available: number; 
    deprice: number;
    date:Date;
    image: File[]; 
}
