import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../../pages/login/login-service'; // Ajuste o caminho

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const token = loginService.getToken();

  console.log('[AuthInterceptor] URL:', req.url);
  console.log('[AuthInterceptor] Token encontrado:', !!token, token ? token.substring(0, 20) + '...' : 'NENHUM');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
