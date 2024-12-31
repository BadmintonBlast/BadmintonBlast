import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagerCustomerComponent } from './admin/managerCustomer/manager-customer.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaherComponent } from './components/heaher/heaher.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginAdminComponent } from './client/loginAdmin/login-admin.component';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ManagerCustomerComponent,
    RouterOutlet,
    HeaherComponent,
    FooterComponent,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'Badminton_Blast';
  httpClient = inject(HttpClient);
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}
  fetchProduct(): void {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Cuộn về vị trí [0, 0]
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }
}
