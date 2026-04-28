import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { LoginService } from '../login/login-service';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    PasswordModule,
    RouterLink,
    FormsModule,
    DividerModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule
  ],
  providers: [LoginService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit, OnDestroy {
  password: string = '';
  confirmPassword: string = '';

  registerForm!: FormGroup;
  private authSubscription?: Subscription;

  constructor(
    private loginService: LoginService,
    private messageService: MessageService, // <-- MessageService injetado
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    },
    {
      validators: passwordMatchValidator
    });
  }

  ngOnInit() {
    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.loginService.loginWithGoogle(user.idToken).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Bem-vindo(a)!',
              detail: 'Login com Google realizado com sucesso!'
            });
            this.router.navigate(['/app/dashboard']);
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
    this.authSubscription?.unsubscribe();
  }

  submit() {
    this.loginService.register(
      this.registerForm.value.name,
      this.registerForm.value.username,
      this.registerForm.value.email,
      this.registerForm.value.password
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Conta criada!',
          detail: 'Cadastro realizado com sucesso! Faça login para continuar.'
        });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Falha no Cadastro',
          detail: 'Verifique os dados informados e tente novamente.'
        });
      }
    });
  }
}