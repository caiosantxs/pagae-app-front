import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces para os DTOs (crie-as!)
interface AuthenticationDTO {
  login: string;
  password: string;
}
interface LoginResponseDTO {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) { }


  login(credentials: AuthenticationDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => this.saveToken(response.token))
    );
  }

  /**
   * Salva o token no sessionStorage e redireciona.
   */
  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  /**
   * Pega o token salvo.
   */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica se o usuário está logado (se existe um token).
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Remove o token e redireciona para o login.
   */
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

}
