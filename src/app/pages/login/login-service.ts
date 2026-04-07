import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../types/login-response.type';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {}

  apiUrl: string = environment.apiUrl + '/auth';

  login(login: string, password: string) {
    return this.httpClient.post<LoginResponse>( this.apiUrl + "/login", { login, password }).pipe(
      tap((value) => {
        sessionStorage.setItem('authToken', value.token);
        sessionStorage.setItem('authUsername', value.name);
        sessionStorage.setItem('authUserId', String(value.id));
      })
    );
  }

  loginWithGoogle(idToken: string) {
    return this.httpClient.post<any>(this.apiUrl + '/google', { idToken }).pipe(
      tap((value: any) => {
        if (value && value.idToken) {
          sessionStorage.setItem('authToken', value.idToken);
          sessionStorage.setItem('authUsername', value.name || 'Usuário Google');
          sessionStorage.setItem('authUserId', String(value.id || '0'));
        }
      })
    );
  }

  register(name: string, login: string, email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, login, password }).pipe(
      tap((value) => {
        sessionStorage.setItem('authToken', value.token);
      })
    );;
  }

  getUsername(): string | null {
    return sessionStorage.getItem('authUsername');
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Retorna true se o token existir
  }

  getUserId(): number | null {
    const id = sessionStorage.getItem('authUserId');
    return id ? Number(id) : null;
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUsername');
    sessionStorage.removeItem('authUserId');

    this.socialAuthService.signOut()
      .catch(() => {
      })
      .finally(() => {
        this.router.navigate(['/login']);
      });
  }

}
