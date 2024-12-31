import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ScrollService } from '../services/sroll.service';
import { IMAGE_CONFIG } from '@angular/common';

// Hàm để lấy token
export function tokenGetter() {
  return localStorage.getItem('user-token');
}

// Cấu hình JwtModule
const JWT_Module_Options: JwtModuleOptions = {
  config: {
    tokenGetter: tokenGetter,
    allowedDomains: ['localhost:7231'],
    disallowedRoutes: ['localhost:7231/api/auth'],
  },
};

// Cấu hình ApplicationConfig
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    ScrollService, // Đảm bảo dịch vụ được cung cấp
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),  
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    ...(JwtModule.forRoot(JWT_Module_Options).providers ?? []), // Thêm các provider của JwtModule
  ],
};
