import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { LOCALE_ID } from '@angular/core';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false,
            },
        }
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr(),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
  provide: 'SocialAuthServiceConfig', // 👈 A mágica está aqui, escrito como string!
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(environment.googleClientId),
      }
    ],
    onError: (err) => {
      console.error(err);
    }
  } as SocialAuthServiceConfig,
}
  ]
};
