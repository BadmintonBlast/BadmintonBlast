import { Routes } from '@angular/router';
import { CategoriesComponent } from './client/caterogies/caterogies.component';
import { CourtComponent } from './client/court/court.component';
import { DetailproductComponent } from './client/detailproduct/detailproduct.component';
import { HomeComponent } from './client/home/home.component';
import { UserComponent } from './client/user/user.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { DetailCustomerComponent } from './admin/detail-customer/detail-customer.component';
import { HeaherComponent } from './components/heaher/heaher.component';
import { LoginAdminComponent } from './client/loginAdmin/login-admin.component';
import { ManagerCustomerComponent } from './admin/managerCustomer/manager-customer.component';
import { PagingComponent } from './components/paging/paging.component';
import { MenuManagerComponent } from './components/menu-manager/menu-manager.component';
import { FooterComponent } from './components/footer/footer.component';
import { WarehouseComponent } from './client/warehouse/warehouse.component';
import { authGuard } from '../services/guards/auth.guard';
import { UserbookingComponent } from './userbooking/userbooking.component';
import { PaymentComponent } from './client/payment/payment.component';
import { Component } from '@angular/core';
import { InforTeamComponent } from './infor-team/infor-team.component';
import { AddKindProductComponent } from './admin/add-kind-product/add-kind-product.component';
import { DetailOrderComponent } from './admin/detail-order/detail-order.component';
import { adminAuthGuard } from '../services/guardsAdmin/authadmin.guard';
export const routes: Routes = [
  // { path: '', redirectTo: 'managerCustomer', pathMatch: 'full' }, // Redirect to 'manager' instead of '/'
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Handle
  { path: 'ManagerCustomer', component: ManagerCustomerComponent },
  { path: 'login', component: LoginAdminComponent, canActivate: [authGuard] },
  { path: 'page', component: PagingComponent },
  { path: 'addproduct', component: AddProductComponent },
  { path: 'detailsCustomer', component: DetailCustomerComponent },
  { path: 'home', component: HomeComponent },
  { path: 'header', component: HeaherComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'chitietsanpham', component: DetailproductComponent },
  { path: 'chitietsanpham/:id/:name', component: DetailproductComponent },
  { path: 'sanpham', component: CategoriesComponent },
  { path: 'datsan', component: CourtComponent },
  { path: 'khachhang', component: UserComponent, canActivate: [authGuard] },
  { path: 'menu/:index', component: MenuManagerComponent},
  // { path: 'giohang', component: CartComponent },
  { path: 'sanpham/:id/:name', component: CategoriesComponent },
  { path: 'sanpham/:keyword', component: CategoriesComponent },
  { path: 'giohang', component: WarehouseComponent },
  { path: 'xacnhandatsan', component: UserbookingComponent },
  { path: 'menu/:index/:idproduct', component: MenuManagerComponent },
  { path: 'thanhtoan', component: PaymentComponent },
  {path:'chitietdathang/:id', component:DetailOrderComponent},
  { path: '**', redirectTo: '' },
];
