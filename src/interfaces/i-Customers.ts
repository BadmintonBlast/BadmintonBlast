// Customer.ts
export interface ICustomer {
  idcustomer: number;
  namecustomer: string;
  imageCustomer: string;
  phone: string;
  province: string;
  district: string;
  village: string;
  hamlet: string;
  email: string;
  passwordHash: string;
  status: boolean;
  role: string;
  birthday:Date;
}
export interface ILogin {
  email: string;
  password: string;
}
interface ILoginResponse {
    token: string;
    role: string;
    // Thêm các thuộc tính khác nếu cần
  }