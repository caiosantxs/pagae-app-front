import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { LoginService } from './login-service';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
    ToastModule 
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  password?: string;

  currentUserId: number | null = null;
  private authSubscription?: Subscription;

  constructor(
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private socialAuthService: SocialAuthService,
  ) {
    this.loginForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      username: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.loginService.loginWithGoogle(user.idToken).subscribe({
          next: () => {
            this.currentUserId = this.loginService.getUserId();
            this.messageService.add({
              severity: 'success',
              summary: 'Bem-vindo(a)!',
              detail: 'Login realizado com sucesso.'
            });
            this.navigateAfterLogin();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro de Autenticação',
              detail: 'Login com Google falhou. Tente novamente.'
            });
          },
        });
      }
    });
  }

  ngOnDestroy() {
    this.loginForm.reset();
    this.authSubscription?.unsubscribe();
  }

  submit() {
    this.loginService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.currentUserId = this.loginService.getUserId();
          this.messageService.add({
            severity: 'success',
            summary: 'Bem-vindo(a)!',
            detail: 'Login realizado com sucesso!'
          });
          this.navigateAfterLogin();
          this.loginForm.reset();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Acesso Negado',
            detail: 'Verifique suas credenciais e tente novamente.'
          });
        },
      });
  }

  private navigateAfterLogin() {
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectUrl');
      this.router.navigateByUrl(redirectUrl);
    } else {
      this.router.navigate(['/app/dashboard']);
    }
  }
}