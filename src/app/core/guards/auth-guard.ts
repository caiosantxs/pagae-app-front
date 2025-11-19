import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../pages/login/login-service'; // Ajuste o caminho

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isLoggedIn()) {
    return true; // Pode acessar
  }

  router.navigate(['/login']);
  return false;
};
